import { AuthRequest } from "../middleware/auth.middleware";
import { Ride } from "../models/ride.model";
import {
  ICreateRidePayload,
  IDeleteRidePayload,
  IGetRideQueryPayload,
} from "@/schemas/rideSchema";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { MongoIdParam } from "../schemas/idSchema";
import { BookingStatus } from "@journey-link/shared";
import { RideStatus } from "@journey-link/shared";

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
                    cond: { $eq: ["$$p.status", BookingStatus.CONFIRMED] },
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

  private static buildMatchStage(query: IGetRideQueryPayload) {
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
    req: Request<unknown, unknown, unknown, IGetRideQueryPayload>,
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
      const skip = (page - 1) * limit;
      pipeline.push({ $skip: skip }, { $limit: limit });

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
          page,
          pages: Math.ceil(total / limit),
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
    req: AuthRequest<unknown, unknown, ICreateRidePayload>,
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
  ) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.error("Authentication required", StatusCodes.UNAUTHORIZED);
      }

      const pipeline: any[] = [
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
      ];

      this.addSeatCalculationStages(pipeline);
      this.addDriverInfo(pipeline);

      const [rideAgg] = await Ride.aggregate(pipeline);
      const ride = Ride.hydrate(rideAgg);

      if (!ride) {
        return res.error("Ride not Found!", StatusCodes.INTERNAL_SERVER_ERROR);
      }

      const { canBook, reason: cannotBookReason } =
        ride.getBookingStatus(userId);

      const isDriver = ride.driver.toString() === userId?.toString();
      const isPassenger = ride.passengers?.some(
        (p: any) => p.user?.toString() === userId?.toString()
      );

      this.applyVisibilityRules(rideAgg, isDriver, isPassenger);

      return res.success(
        { canBook, cannotBookReason, ...rideAgg },
        "",
        StatusCodes.OK
      );
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
    try {
      const userId = req.user?.userId;
      const rideId = req.params?.id;

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
      ride.status = RideStatus.CANCELLED;
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

  static updateRide = async (
    req: AuthRequest<MongoIdParam, unknown, ICreateRidePayload>,
    res: Response
  ) => {
    try {
      const userId = req.user?.userId;
      const rideId = req.params?.id;

      const ride = await Ride.findById(rideId);

      if (!ride) {
        return res.error("Ride not found", StatusCodes.NOT_FOUND);
      }

      // if user is the driver
      if (ride.driver.toString() !== userId) {
        return res.error(
          "Not authorized to update this ride",
          StatusCodes.FORBIDDEN
        );
      }

      // prevent editing completed or cancelled rides
      if (ride.status === RideStatus.COMPLETED) {
        return res.error(
          "Cannot edit a completed ride",
          StatusCodes.BAD_REQUEST
        );
      }

      if (ride.status === RideStatus.CANCELLED) {
        return res.error(
          "Cannot edit a cancelled ride",
          StatusCodes.BAD_REQUEST
        );
      }

      if (req.body.availableSeats) {
        const bookedSeats = ride.passengers
          .filter((p) => p.status === BookingStatus.CONFIRMED)
          .reduce((sum, p) => sum + p.seatsBooked, 0);

        if (req.body.availableSeats < bookedSeats) {
          return res.error(
            `Cannot reduce seats below ${bookedSeats} (already booked)`,
            StatusCodes.BAD_REQUEST
          );
        }
      }

      const {
        departureTime,
        availableSeats,
        pricePerSeat,
        vehicleInfo,
        preferences,
        additionalInfo,
      } = req.body;

      if (departureTime) {
        ride.departureTime = new Date(departureTime);
      }

      if (availableSeats !== undefined) {
        ride.availableSeats = availableSeats;
      }

      if (pricePerSeat !== undefined) {
        ride.pricePerSeat = pricePerSeat;
      }

      if (vehicleInfo) {
        if (!ride.vehicleInfo) {
          ride.vehicleInfo = {} as any;
        }

        if (vehicleInfo.make !== undefined) {
          ride.vehicleInfo.make = vehicleInfo.make;
        }
        if (vehicleInfo.model !== undefined) {
          ride.vehicleInfo.model = vehicleInfo.model;
        }
        if (vehicleInfo.color !== undefined) {
          ride.vehicleInfo.color = vehicleInfo.color;
        }
        if (vehicleInfo.licensePlate !== undefined) {
          ride.vehicleInfo.licensePlate = vehicleInfo.licensePlate;
        }
      }

      if (preferences) {
        if (!ride.preferences) {
          ride.preferences = {} as any;
        }

        if (preferences.smokingAllowed !== undefined && ride.preferences) {
          ride.preferences.smokingAllowed = preferences.smokingAllowed;
        }
        if (preferences.petsAllowed !== undefined && ride.preferences) {
          ride.preferences.petsAllowed = preferences.petsAllowed;
        }
      }

      if (additionalInfo !== undefined) {
        ride.additionalInfo = additionalInfo;
      }

      await ride.save();

      const pipeline: any[] = [
        { $match: { _id: new mongoose.Types.ObjectId(rideId) } },
      ];
      this.addSeatCalculationStages(pipeline);
      this.addDriverInfo(pipeline);

      const [updatedRide] = await Ride.aggregate(pipeline);

      return res.success(
        updatedRide,
        "Ride updated successfully",
        StatusCodes.OK
      );
    } catch (error) {
      console.error("Error updating ride:", error);
      return res.error("An error occurred", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };
}
