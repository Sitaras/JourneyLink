import { AuthRequest } from "../middleware/auth.middleware";
import { Route } from "../models/route.model";
import {
  ICreateRoutePayload,
  IDeleteRoutePayload,
  IGetRoutesQueryPayload,
  MongoIdParam,
} from "@/schemas/routesSchema";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

// TODO: (PUT) update route
// TODO: Atlas Search with fuzzy

export class RoutesController {
  static getRoutes = async (
    req: Request<{}, {}, {}, IGetRoutesQueryPayload>,
    res: Response
  ) => {
    try {
      const {
        // maybe used with fuzzy search
        // originCity,
        // destinationCity,
        originLat,
        originLng,
        originRadius = 50, // Default 50km radius
        destinationLat,
        destinationLng,
        destinationRadius = 50,
        departureDate,
        minSeats,
        maxPrice,
        smokingAllowed,
        petsAllowed,
        page = 1,
        limit = 10,
        sortBy = "departureTime",
        sortOrder = "asc",
      } = req.query;

      const pipeline: any[] = [];

      const matchStage: any = {
        status: "active",
        departureTime: { $gte: new Date() },
      };

      if (departureDate) {
        const date = new Date(departureDate);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);

        matchStage.departureTime = {
          $gte: date,
          $lt: nextDay,
        };
      }

      if (maxPrice) {
        matchStage.pricePerSeat = { $lte: parseFloat(maxPrice as any) };
      }
      if (smokingAllowed !== undefined) {
        matchStage["preferences.smokingAllowed"] = smokingAllowed;
      }
      if (petsAllowed !== undefined) {
        matchStage["preferences.petsAllowed"] = petsAllowed;
      }

      pipeline.push({
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [
              parseFloat(originLng as any),
              parseFloat(originLat as any),
            ],
          },
          distanceField: "originDistance",
          maxDistance: (originRadius as number) * 1000,
          spherical: true,
          key: "origin.coordinates",
          query: matchStage,
        },
      });

      pipeline.push({
        $match: {
          "destination.coordinates": {
            $geoWithin: {
              $centerSphere: [
                [
                  parseFloat(destinationLng as any),
                  parseFloat(destinationLat as any),
                ],
                (destinationRadius as number) / 6378.1, // km → radians
              ],
            },
          },
        },
      });

      pipeline.push({
        $addFields: {
          bookedSeats: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$passengers",
                    as: "p",
                    cond: { $eq: ["$$p.status", "confirmed"] },
                  },
                },
                as: "cp",
                in: "$$cp.seatsBooked",
              },
            },
          },
        },
      });

      pipeline.push({
        $addFields: {
          remainingSeats: { $subtract: ["$availableSeats", "$bookedSeats"] },
        },
      });

      if (minSeats) {
        pipeline.push({
          $match: { remainingSeats: { $gte: parseInt(minSeats as any) } },
        });
      }

      pipeline.push({
        $lookup: {
          from: "users",
          localField: "driver",
          foreignField: "_id",
          as: "driverUser",
        },
      });

      pipeline.push({
        $unwind: { path: "$driverUser", preserveNullAndEmptyArrays: true },
      });

      pipeline.push({
        $lookup: {
          from: "profiles",
          localField: "driverUser.profile",
          foreignField: "_id",
          as: "driverProfile",
        },
      });

      pipeline.push({
        $unwind: { path: "$driverProfile", preserveNullAndEmptyArrays: true },
      });

      pipeline.push({
        $project: {
          _id: 1,
          origin: 1,
          destination: 1,
          departureTime: 1,
          availableSeats: 1,
          remainingSeats: 1,
          pricePerSeat: 1,
          vehicleInfo: 1,
          preferences: 1,
          additionalInfo: 1,
          originDistance: 1,
          driver: {
            firstName: "$driverProfile.firstName",
            lastName: "$driverProfile.lastName",
            avatar: "$driverProfile.avatar",
            rating: "$driverProfile.rating",
          },
          createdAt: 1,
        },
      });

      const sortStage: any = {};
      if (sortBy === "price") {
        sortStage.pricePerSeat = sortOrder === "asc" ? 1 : -1;
      } else if (sortBy === "distance" && originLat && originLng) {
        sortStage.originDistance = sortOrder === "asc" ? 1 : -1;
      } else {
        sortStage.departureTime = sortOrder === "asc" ? 1 : -1;
      }
      pipeline.push({ $sort: sortStage });

      // -------- Stage 8: pagination --------
      const skip = (parseInt(page as any) - 1) * parseInt(limit as any);
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: parseInt(limit as any) });

      // -------- Execute aggregation --------
      const routes = await Route.aggregate(pipeline);

      // -------- Count pipeline --------
      const countPipeline = pipeline.filter(
        (stage) =>
          !("$skip" in stage) && !("$limit" in stage) && !("$sort" in stage)
      );
      countPipeline.push({ $count: "total" });
      const countResult = await Route.aggregate(countPipeline);
      const total = countResult.length > 0 ? countResult[0].total : 0;
      return res.success(
        {
          count: routes.length,
          total,
          page: parseInt(page as any),
          pages: Math.ceil(total / parseInt(limit as any)),
          data: routes,
        },
        "",
        StatusCodes.OK
      );
    } catch (error) {
      return res.error(
        "An error occurred while searching routes",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  static createRoute = async (
    req: AuthRequest<{}, {}, ICreateRoutePayload>,
    res: Response
  ) => {
    try {
      const {
        origin,
        destination,
        departureTime,
        availableSeats,
        pricePerSeat,
        vehicleInfo,
        preferences,
        additionalInfo,
      } = req.body;

      const userId = req.user?.userId;

      // TODO: check is user has the driver role

      // TODO: Origin and destination cities must be different

      const route = await Route.create({
        driver: userId,
        origin,
        destination,
        departureTime,
        availableSeats,
        pricePerSeat,
        vehicleInfo,
        preferences,
        additionalInfo,
      });

      const populatedRoute = await Route.findById(route._id).populate(
        "driver",
        "name email phone"
      );

      return res.success(
        populatedRoute,
        "Route created successfully",
        StatusCodes.CREATED
      );
    } catch (error) {
      return res.error("An error occurred", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  static getRouteById = async (
    req: Request<MongoIdParam>,
    res: Response
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;

      const route = await Route.findById(id)
        .populate("driver", "name email phone rating avatar")
        .populate("passengers.user", "name avatar rating");

      if (!route) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Route not found",
        });
      }

      return res.success(route, "", StatusCodes.OK);
    } catch (error) {
      return res.error("An error occurred", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  static deleteRoute = async (
    req: AuthRequest<MongoIdParam, undefined, IDeleteRoutePayload>,
    res: Response
  ) => {
    const userId = req.user?.userId;
    const routeId = req.params?.id;

    try {
      const route = await Route.findById(routeId);

      if (!route) {
        return res.error("Route not found", StatusCodes.NOT_FOUND);
      }

      if (route.status === "cancelled") {
        return res.error("Route is already cancelled", StatusCodes.BAD_REQUEST);
      }

      if (route.status === "completed") {
        return res.error(
          "Cannot cancel a completed route",
          StatusCodes.BAD_REQUEST
        );
      }

      if (route.driver.toString() !== userId) {
        return res.error(
          "Not authorized to delete this route",
          StatusCodes.FORBIDDEN
        );
      }

      route.status = "cancelled";
      await route.save();

      if (req.body?.reason) {
        route.cancellationReason = req.body.reason;
      }

      route.cancelledAt = new Date();

      await route.save();

      if (req.body?.notifyPassengers) {
        // TODO: notification
      }

      return res.success(route, "Route cancelled successfully", StatusCodes.OK);
    } catch (error) {
      return res.error("An error occurred", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };
}
