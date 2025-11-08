import { Booking } from "../models/booking.model";
import { AuthRequest } from "../middleware/auth.middleware";
import { Ride } from "../models/ride.model";
import {
  ICreateRidePayload,
  IDeleteRidePayload,
  IGetRideQueryPayload,
  MongoIdParam,
} from "@/schemas/rideSchema";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose, { Types } from "mongoose";

export class RideController {
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

  private static buildMatchStage(query: IGetRideQueryPayload): any {
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

  static getRide = async (
    req: Request<{}, {}, {}, IGetRideQueryPayload>,
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

      const rides = await Ride.aggregate(pipeline);

      // Count total
      const countPipeline = pipeline.filter(
        (stage) =>
          !("$skip" in stage) && !("$limit" in stage) && !("$sort" in stage)
      );
      countPipeline.push({ $count: "total" });
      const countResult = await Ride.aggregate(countPipeline);
      const total = countResult.length > 0 ? countResult[0].total : 0;

      return res.success(
        {
          count: rides.length,
          total,
          page: parseInt(page as any),
          pages: Math.ceil(total / parseInt(limit as any)),
          data: rides,
        },
        "",
        StatusCodes.OK
      );
    } catch (error) {
      console.error("Error fetching rides:", error);
      return res.error(
        "An error occurred while searching rides",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  static createRide = async (
    req: AuthRequest<{}, {}, ICreateRidePayload>,
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

      const ride = await Ride.create({
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

      const populatedRide = await Ride.findById(ride._id).populate(
        "driver",
        "name email phone"
      );

      return res.success(
        populatedRide,
        "Ride created successfully",
        StatusCodes.CREATED
      );
    } catch (error) {
      console.error("Error creating ride:", error);
      return res.error("An error occurred", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  static getRideById = async (
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

      const [ride] = await Ride.aggregate(pipeline);

      if (!ride) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Ride not found",
        });
      }

      const isDriver = ride.driver.toString() === userId?.toString();
      const isPassenger = ride.passengers?.some(
        (p: any) => p.user?.toString() === userId?.toString()
      );

      this.applyVisibilityRules(ride, isDriver, isPassenger);

      return res.success(ride, "", StatusCodes.OK);
    } catch (error) {
      console.error("Error fetching ride:", error);
      return res.error("An error occurred", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  private static applyVisibilityRules(
    ride: any,
    isDriver: boolean,
    isPassenger: boolean
  ): void {
    if (isDriver) {
      // Driver sees everything (already sanitized by pipeline)
      return;
    }

    if (isPassenger) {
      // Passenger sees driver contact info but not other passengers
      delete ride.passengers;
      // driverProfile already has: firstName, lastName, email, phone, avatar, rating
      return;
    }

    // Non-participant (public view) - minimal info
    delete ride.passengers;

    if (ride.vehicleInfo) {
      ride.vehicleInfo = {
        make: ride.vehicleInfo.make,
        model: ride.vehicleInfo.model,
        color: ride.vehicleInfo.color,
      };
    }

    if (ride.driverProfile) {
      // Public: only firstName, avatar, rating
      const { firstName, avatar, rating } = ride.driverProfile;
      ride.driverProfile = { firstName, avatar, rating };
    }
  }

  static deleteRide = async (
    req: AuthRequest<MongoIdParam, undefined, IDeleteRidePayload>,
    res: Response
  ) => {
    const userId = req.user?.userId;
    const rideId = req.params?.id;

    try {
      const ride = await Ride.findById(rideId);

      if (!ride) {
        return res.error("Ride not found", StatusCodes.NOT_FOUND);
      }

      if (ride.status === "cancelled") {
        return res.error("Ride is already cancelled", StatusCodes.BAD_REQUEST);
      }

      if (ride.status === "completed") {
        return res.error(
          "Cannot cancel a completed ride",
          StatusCodes.BAD_REQUEST
        );
      }

      if (ride.driver.toString() !== userId) {
        return res.error(
          "Not authorized to delete this ride",
          StatusCodes.FORBIDDEN
        );
      }

      // Update ride status
      ride.status = "cancelled";
      ride.cancelledAt = new Date();

      if (req.body?.reason) {
        ride.cancellationReason = req.body.reason;
      }

      await ride.save();

      if (req.body?.notifyPassengers) {
        // TODO: notification
      }

      return res.success(ride, "Ride cancelled successfully", StatusCodes.OK);
    } catch (error) {
      return res.error("An error occurred", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  static async getRidesAs(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { type = "asPassenger", sortOrder = "desc" } = req.query;

      if (type === "asDriver") {
        const rides = await Ride.aggregate([
          {
            $match: {
              driver: new Types.ObjectId(userId),
              status: { $in: ["active", "completed"] },
            },
          },
          {
            $addFields: {
              confirmedPassengers: {
                $filter: {
                  input: "$passengers",
                  as: "p",
                  cond: { $eq: ["$$p.status", "confirmed"] },
                },
              },
            },
          },
          {
            $addFields: {
              totalPassengersBooked: { $size: "$confirmedPassengers" },
            },
          },
          {
            $project: {
              _id: 1,
              origin: 1,
              destination: 1,
              departureTime: 1,
              pricePerSeat: 1,
              availableSeats: 1,
              totalPassengersBooked: 1,
              status: 1,
            },
          },
          {
            $sort: { departureTime: sortOrder === "asc" ? 1 : -1 },
          },
        ]);

        res.status(StatusCodes.OK).json({
          success: true,
          count: rides.length,
          data: rides,
        });
        return;
      }

      if (type === "asPassenger") {
        const bookings = await Booking.find({
          passenger: userId,
          status: { $ne: "cancelled" },
        })
          .populate("ride", "origin destination departureTime pricePerSeat")
          .sort({ createdAt: sortOrder === "asc" ? 1 : -1 });

        res.status(StatusCodes.OK).json({
          success: true,
          count: bookings.length,
          data: bookings,
        });
        return;
      }

      res.status(400).json({ message: "Invalid 'type' parameter." });
    } catch (error) {
      console.error("Error fetching rides:", error);
      res
        .status(500)
        .json({ message: "Server Error", error: (error as Error).message });
    }
  }
}
