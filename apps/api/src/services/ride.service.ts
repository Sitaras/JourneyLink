import { Ride } from "../models/ride.model";
import { Booking } from "../models/booking.model";
import {
  BookingStatus,
  RideStatus,
  ICreateRidePayload,
  IGetRideQueryPayload,
  IDeleteRidePayload,
} from "@journey-link/shared";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { agenda, JobTypes } from "../config/agenda";
import { notificationService } from "./notification.service";
import { NotificationType } from "@journey-link/shared";

export class RideService {
  async checkAndCompleteRides(rideId?: string) {
    try {
      const now = new Date();
      const query: any = {
        status: RideStatus.ACTIVE,
        departureTime: { $lt: now.toISOString() },
      };

      if (rideId) {
        query._id = rideId;
      }

      const ridesToComplete = await Ride.find(query);

      if (ridesToComplete.length > 0) {
        for (const ride of ridesToComplete) {
          ride.status = RideStatus.COMPLETED;
          await ride.save();

          await Booking.updateMany(
            {
              ride: ride._id,
              status: BookingStatus.PENDING,
            },
            {
              status: BookingStatus.DECLINED,
            }
          );
        }
      }
    } catch (error) {
      console.error("RideService: Error updating ride statuses", error);
    }
  }

  async completeRide(rideId: string) {
    try {
      const ride = await Ride.findById(rideId);
      if (!ride || ride.status !== RideStatus.ACTIVE) return;

      ride.status = RideStatus.COMPLETED;
      await ride.save();

      await Booking.updateMany(
        {
          ride: rideId,
          status: BookingStatus.PENDING,
        },
        {
          status: BookingStatus.DECLINED,
        }
      );
    } catch (error) {
      console.error(`RideService: Error completing ride ${rideId}`, error);
    }
  }

  private addSeatCalculationStages(pipeline: any[]): void {
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

  private addDriverInfo(pipeline: any[]): void {
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

  private buildMatchStage(query: IGetRideQueryPayload) {
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

  private buildSortStage(
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

  async getRides(query: IGetRideQueryPayload) {
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
    } = query;

    const pipeline: any[] = [];
    const matchStage = this.buildMatchStage(query);

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

    return {
      count: rides.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: rides,
    };
  }

  async createRide(userId: string, data: ICreateRidePayload) {
    const {
      origin,
      destination,
      departureTime,
      availableSeats,
      pricePerSeat,
      vehicleInfo,
      preferences,
      additionalInfo,
    } = data;

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

    try {
      await agenda.schedule(ride.departureTime, JobTypes.COMPLETE_RIDE, {
        rideId: ride._id.toString(),
      });
    } catch (error) {
      console.error("RideService: Failed to schedule completion job", error);
    }

    return await Ride.findById(ride._id).populate("driver", "name email phone");
  }

  async getRideById(id: string, userId: string) {
    await this.checkAndCompleteRides(id);

    const pipeline: any[] = [
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
    ];

    this.addSeatCalculationStages(pipeline);
    this.addDriverInfo(pipeline);

    const [rideAgg] = await Ride.aggregate(pipeline);
    const ride = Ride.hydrate(rideAgg);

    if (!ride) {
      throw { statusCode: StatusCodes.NOT_FOUND, message: "Ride not Found!" };
    }

    const { canBook, reason: cannotBookReason } = ride.getBookingStatus(userId);

    const isDriver = ride.driver.toString() === userId?.toString();
    const isPassenger = ride.passengers?.some(
      (p) => p.user?.toString() === userId?.toString()
    );

    this.applyVisibilityRules(rideAgg, isDriver, isPassenger);

    let myBooking = null;
    if (isPassenger) {
      const booking = await Booking.findOne({
        ride: id,
        passenger: userId,
      }).select("status createdAt seatsBooked");
      if (booking) {
        myBooking = booking;
      }
    }

    return { canBook, cannotBookReason, myBooking, ...rideAgg };
  }

  private applyVisibilityRules(
    ride: any,
    isDriver: boolean,
    isPassenger: boolean
  ): void {
    if (isDriver) {
      return;
    }

    if (isPassenger) {
      delete ride.passengers;
      return;
    }

    delete ride.passengers;

    if (ride.vehicleInfo) {
      ride.vehicleInfo = {
        make: ride.vehicleInfo.make,
        model: ride.vehicleInfo.model,
        color: ride.vehicleInfo.color,
      };
    }

    if (ride.driverProfile) {
      const { firstName, avatar, rating } = ride.driverProfile;
      ride.driverProfile = { firstName, avatar, rating };
    }
  }

  async deleteRide(rideId: string, userId: string, data: IDeleteRidePayload) {
    const ride = await Ride.findById(rideId);

    if (!ride) {
      throw { statusCode: StatusCodes.NOT_FOUND, message: "Ride not found" };
    }

    if (ride.status === "cancelled") {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Ride is already cancelled",
      };
    }

    if (ride.status === "completed") {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Cannot cancel a completed ride",
      };
    }

    if (ride.driver.toString() !== userId) {
      throw {
        statusCode: StatusCodes.FORBIDDEN,
        message: "Not authorized to delete this ride",
      };
    }

    ride.status = RideStatus.CANCELLED;
    ride.cancelledAt = new Date();

    if (data?.reason) {
      ride.cancellationReason = data.reason;
    }

    await ride.save();

    if (data?.notifyPassengers) {
      // TODO: notification
    }

    try {
      await agenda.cancel({
        name: JobTypes.COMPLETE_RIDE,
        "data.rideId": rideId.toString(),
      });
    } catch (error) {
      console.error("RideService: Failed to cancel completion job", error);
    }

    return ride;
  }

  async updateRide(rideId: string, userId: string, data: ICreateRidePayload) {
    const ride = await Ride.findById(rideId);

    if (!ride) {
      throw { statusCode: StatusCodes.NOT_FOUND, message: "Ride not found" };
    }

    if (ride.driver.toString() !== userId) {
      throw {
        statusCode: StatusCodes.FORBIDDEN,
        message: "Not authorized to update this ride",
      };
    }

    if (ride.status === RideStatus.COMPLETED) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Cannot edit a completed ride",
      };
    }

    if (ride.status === RideStatus.CANCELLED) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Cannot edit a cancelled ride",
      };
    }

    if (data.availableSeats) {
      const bookedSeats = ride.passengers
        .filter((p) => p.status === BookingStatus.CONFIRMED)
        .reduce((sum, p) => sum + p.seatsBooked, 0);

      if (data.availableSeats < bookedSeats) {
        throw {
          statusCode: StatusCodes.BAD_REQUEST,
          message: `Cannot reduce seats below ${bookedSeats} (already booked)`,
        };
      }
    }

    const {
      departureTime,
      availableSeats,
      pricePerSeat,
      vehicleInfo,
      preferences,
      additionalInfo,
    } = data;

    if (departureTime) {
      if (new Date(departureTime) <= new Date()) {
        throw {
          statusCode: StatusCodes.BAD_REQUEST,
          message: "Departure time must be in the future",
        };
      }
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

    // Notify Passengers about the update
    const affectedPassengers = ride.passengers.filter((p) =>
      [BookingStatus.PENDING, BookingStatus.CONFIRMED].includes(p.status as any)
    );

    for (const passenger of affectedPassengers) {
      if (passenger.user) {
        await notificationService.createNotification(
          passenger.user.toString(),
          NotificationType.RIDE_UPDATED,
          "Ride Updated",
          `The ride from ${ride.origin.city} to ${ride.destination.city} has been updated by the driver.`,
          { rideId: ride._id }
        );
      }
    }

    const pipeline: any[] = [
      { $match: { _id: new mongoose.Types.ObjectId(rideId) } },
    ];
    this.addSeatCalculationStages(pipeline);
    this.addDriverInfo(pipeline);

    const [updatedRide] = await Ride.aggregate(pipeline);

    if (departureTime) {
      try {
        await agenda.cancel({
          name: JobTypes.COMPLETE_RIDE,
          "data.rideId": rideId.toString(),
        });
        await agenda.schedule(new Date(departureTime), JobTypes.COMPLETE_RIDE, {
          rideId: rideId.toString(),
        });
      } catch (error) {
        console.error(
          "RideService: Failed to reschedule completion job",
          error
        );
      }
    }

    return updatedRide;
  }
}

export const rideService = new RideService();
