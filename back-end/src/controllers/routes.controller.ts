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
import mongoose from "mongoose";

export class RoutesController {
  private static addSeatCalculationStages(pipeline: any[]): void {
    pipeline.push(
      {
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
      },
      {
        $addFields: {
          remainingSeats: { $subtract: ["$availableSeats", "$bookedSeats"] },
        },
      }
    );
  }

  private static addDriverInfo(pipeline: any[]): void {
    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "driver",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "profiles",
          localField: "user.profile",
          foreignField: "_id",
          as: "driverProfile",
        },
      },
      {
        $unwind: { path: "$driverProfile", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          driverProfile: {
            $cond: {
              if: { $ne: ["$driverProfile", null] },
              then: {
                _id: "$driverProfile._id",
                firstName: "$driverProfile.firstName",
                lastName: "$driverProfile.lastName",
                email: "$driverProfile.email",
                phone: "$driverProfile.phone",
                avatar: "$driverProfile.avatar",
                rating: "$driverProfile.rating",
              },
              else: null,
            },
          },
        },
      },
      {
        $project: {
          user: 0, // Remove the temporary user object
        },
      }
    );
  }

  // private static addPassengerInfo(pipeline: any[]): void {
  //   pipeline.push(
  //     {
  //       $lookup: {
  //         from: "users",
  //         localField: "passengers.user",
  //         foreignField: "_id",
  //         as: "passengerUsers",
  //       },
  //     },
  //     {
  //       $addFields: {
  //         passengers: {
  //           $map: {
  //             input: "$passengers",
  //             as: "passenger",
  //             in: {
  //               $mergeObjects: [
  //                 "$$passenger",
  //                 {
  //                   userDetails: {
  //                     $arrayElemAt: [
  //                       {
  //                         $filter: {
  //                           input: "$passengerUsers",
  //                           as: "user",
  //                           cond: { $eq: ["$$user._id", "$$passenger.user"] },
  //                         },
  //                       },
  //                       0,
  //                     ],
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //         },
  //       },
  //     },
  //     {
  //       $project: {
  //         passengerUsers: 0,
  //       },
  //     }
  //   );
  // }

  private static buildMatchStage(query: IGetRoutesQueryPayload): any {
    const { departureDate, maxPrice, smokingAllowed, petsAllowed } = query;

    const matchStage: any = {
      status: "active",
      departureTime: { $gte: new Date() },
    };

    if (departureDate) {
      const date = new Date(departureDate);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      matchStage.departureTime = { $gte: date, $lt: nextDay };
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

    return matchStage;
  }

  private static buildSortStage(
    sortBy: string,
    sortOrder: string,
    hasGeoQuery: boolean
  ): any {
    const sortStage: any = {};

    switch (sortBy) {
      case "price":
        sortStage.pricePerSeat = sortOrder === "asc" ? 1 : -1;
        break;
      case "distance":
        if (hasGeoQuery) {
          sortStage.originDistance = sortOrder === "asc" ? 1 : -1;
        } else {
          sortStage.departureTime = sortOrder === "asc" ? 1 : -1;
        }
        break;
      default:
        sortStage.departureTime = sortOrder === "asc" ? 1 : -1;
    }

    return sortStage;
  }

  static getRoutes = async (
    req: Request<{}, {}, {}, IGetRoutesQueryPayload>,
    res: Response
  ) => {
    try {
      const {
        originLat,
        originLng,
        originRadius = 50,
        destinationLat,
        destinationLng,
        destinationRadius = 50,
        minSeats,
        page = 1,
        limit = 10,
        sortBy = "departureTime",
        sortOrder = "asc",
      } = req.query;

      const pipeline: any[] = [];
      const matchStage = this.buildMatchStage(req.query);

      // Geo-spatial query
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
                (destinationRadius as number) / 6378.1,
              ],
            },
          },
        },
      });

      this.addSeatCalculationStages(pipeline);

      if (minSeats) {
        pipeline.push({
          $match: { remainingSeats: { $gte: parseInt(minSeats as any) } },
        });
      }

      this.addDriverInfo(pipeline);

      pipeline.push({
        $project: {
          _id: 1,
          origin: 1,
          destination: 1,
          departureTime: 1,
          availableSeats: 1,
          remainingSeats: 1,
          pricePerSeat: 1,
          preferences: 1,
          originDistance: 1,
          driverProfile: {
            avatar: 1,
            rating: 1,
          },
          createdAt: 1,
        },
      });

      const sortStage = this.buildSortStage(
        sortBy as string,
        sortOrder as string,
        true
      );
      pipeline.push({ $sort: sortStage });

      // Pagination
      const skip = (parseInt(page as any) - 1) * parseInt(limit as any);
      pipeline.push({ $skip: skip }, { $limit: parseInt(limit as any) });

      const routes = await Route.aggregate(pipeline);

      // Count total
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
      console.error("Error fetching routes:", error);
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
      console.error("Error creating route:", error);
      return res.error("An error occurred", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  static getRouteById = async (
    req: AuthRequest<MongoIdParam>,
    res: Response
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const pipeline: any[] = [
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
      ];

      this.addSeatCalculationStages(pipeline);
      this.addDriverInfo(pipeline);

      const [route] = await Route.aggregate(pipeline);

      if (!route) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Route not found",
        });
      }

      const isDriver = route.driver.toString() === userId?.toString();
      const isPassenger = route.passengers?.some(
        (p: any) => p.user?.toString() === userId?.toString()
      );

      this.applyVisibilityRules(route, isDriver, isPassenger);

      return res.success(route, "", StatusCodes.OK);
    } catch (error) {
      console.error("Error fetching route:", error);
      return res.error("An error occurred", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  private static applyVisibilityRules(
    route: any,
    isDriver: boolean,
    isPassenger: boolean
  ): void {
    if (isDriver) {
      // Driver sees everything (already sanitized by pipeline)
      return;
    }

    if (isPassenger) {
      // Passenger sees driver contact info but not other passengers
      delete route.passengers;
      // driverProfile already has: firstName, lastName, email, phone, avatar, rating
      return;
    }

    // Non-participant (public view) - minimal info
    delete route.passengers;

    if (route.vehicleInfo) {
      route.vehicleInfo = {
        make: route.vehicleInfo.make,
        model: route.vehicleInfo.model,
        color: route.vehicleInfo.color,
      };
    }

    if (route.driverProfile) {
      // Public: only firstName, avatar, rating
      const { firstName, avatar, rating } = route.driverProfile;
      route.driverProfile = { firstName, avatar, rating };
    }
  }

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

      // Update route status
      route.status = "cancelled";
      route.cancelledAt = new Date();

      if (req.body?.reason) {
        route.cancellationReason = req.body.reason;
      }

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
