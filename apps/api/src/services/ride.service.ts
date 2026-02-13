import { Ride } from "../models/ride.model";
import { User } from "../models/user.model";
import { Booking } from "../models/booking.model";
import {
  BookingStatus,
  RideStatus,
  ICreateRidePayload,
  IGetRideQueryPayload,
  IDeleteRidePayload,
  ErrorCodes,
} from "@journey-link/shared";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { agenda, JobTypes } from "../config/agenda";
import { notificationService } from "./notification.service";
import { NotificationType } from "@journey-link/shared";
import { rideRepository } from "../repositories/ride.repository";
import { logger } from "../utils/logger";

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
      logger.error({ err: error }, "RideService: Error updating ride statuses");
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
      logger.error(
        { err: error },
        `RideService: Error completing ride ${rideId}`
      );
    }
  }

  async getRides(query: IGetRideQueryPayload) {
    return await rideRepository.findRides(query);
  }

  async createRide(userId: string, data: ICreateRidePayload) {
    const user = await User.findById(userId).populate("profile");

    if (!user) {
      throw {
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorCodes.USER_NOT_FOUND,
      };
    }

    const profile = user.profile as any;
    const hasSocials =
      profile?.socials &&
      (profile.socials.facebook ||
        profile.socials.twitter ||
        profile.socials.linkedIn);

    if (
      !profile ||
      !profile.firstName ||
      !profile.lastName ||
      !profile.email ||
      !profile.phoneNumber ||
      !profile.bio ||
      !hasSocials
    ) {
      throw {
        statusCode: StatusCodes.FORBIDDEN,
        message: ErrorCodes.INCOMPLETE_PROFILE,
      };
    }

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
      logger.error(
        { err: error },
        "RideService: Failed to schedule completion job"
      );
    }

    return await Ride.findById(ride._id).populate("driver", "name email phone");
  }

  async getRideById(id: string, userId: string) {
    await this.checkAndCompleteRides(id);

    const pipeline: any[] = [
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
    ];

    rideRepository.addSeatCalculationStages(pipeline);
    rideRepository.addDriverInfo(pipeline);

    const [rideAgg] = await Ride.aggregate(pipeline);
    const ride = Ride.hydrate(rideAgg);

    if (!ride) {
      throw {
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorCodes.RIDE_NOT_FOUND,
      };
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
      throw {
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorCodes.RIDE_NOT_FOUND,
      };
    }

    if (ride.status === "cancelled") {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: ErrorCodes.RIDE_ALREADY_CANCELLED,
      };
    }

    if (ride.status === "completed") {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: ErrorCodes.CANNOT_CANCEL_COMPLETED_RIDE,
      };
    }

    if (ride.driver.toString() !== userId) {
      throw {
        statusCode: StatusCodes.FORBIDDEN,
        message: ErrorCodes.UNAUTHORIZED_DELETE_RIDE,
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
      logger.error(
        { err: error },
        "RideService: Failed to cancel completion job"
      );
    }

    return ride;
  }

  async updateRide(rideId: string, userId: string, data: ICreateRidePayload) {
    const ride = await Ride.findById(rideId);

    if (!ride) {
      throw {
        statusCode: StatusCodes.NOT_FOUND,
        message: ErrorCodes.RIDE_NOT_FOUND,
      };
    }

    if (ride.driver.toString() !== userId) {
      throw {
        statusCode: StatusCodes.FORBIDDEN,
        message: ErrorCodes.UNAUTHORIZED_UPDATE_RIDE,
      };
    }

    if (ride.status === RideStatus.COMPLETED) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: ErrorCodes.CANNOT_EDIT_COMPLETED_RIDE,
      };
    }

    if (ride.status === RideStatus.CANCELLED) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: ErrorCodes.CANNOT_EDIT_CANCELLED_RIDE,
      };
    }

    if (data.availableSeats) {
      const bookedSeats = ride.passengers
        .filter((p) => p.status === BookingStatus.CONFIRMED)
        .reduce((sum, p) => sum + p.seatsBooked, 0);

      if (data.availableSeats < bookedSeats) {
        throw {
          statusCode: StatusCodes.BAD_REQUEST,
          message: ErrorCodes.CANNOT_REDUCE_SEATS,
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
          message: ErrorCodes.DEPARTURE_TIME_MUST_BE_FUTURE,
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
    rideRepository.addSeatCalculationStages(pipeline);
    rideRepository.addDriverInfo(pipeline);

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
        logger.error(
          { err: error },
          "RideService: Failed to reschedule completion job"
        );
      }
    }

    return updatedRide;
  }
  async getPopularTrips(limit: number = 3) {
    const pipeline: any[] = [
      {
        $match: {
          status: RideStatus.ACTIVE,
          departureTime: { $gt: new Date() },
        },
      },
      {
        $group: {
          _id: {
            origin: "$origin.city",
            destination: "$destination.city",
          },
          count: { $sum: 1 },
          minPrice: { $min: "$pricePerSeat" },
          originDetails: { $first: "$origin" },
          destinationDetails: { $first: "$destination" },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 0,
          origin: "$_id.origin",
          destination: "$_id.destination",
          originCoordinates: "$originDetails.coordinates",
          destinationCoordinates: "$destinationDetails.coordinates",
          count: 1,
          minPrice: 1,
        },
      },
    ];

    const results = await Ride.aggregate(pipeline);
    return results;
  }
}

export const rideService = new RideService();
