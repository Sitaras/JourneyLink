import { User } from "../models/user.model";
import { Profile } from "../models/profile.model";
import { UpdateProfilePayload } from "@journey-link/shared";
import { Booking } from "../models/booking.model";
import { Ride } from "../models/ride.model";
import { Types } from "mongoose";
import { IGetUserRidesQueryPayload } from "../schemas/user/userRideSchema";
import { RideStatus, BookingStatus, UserRideRole } from "@journey-link/shared";
import { StatusCodes } from "http-status-codes";

export class UserService {
  async getUserInfo(userId: string) {
    const user = await User.findById(userId)
      .select("-password -refreshTokens -__v")
      .populate({
        path: "profile",
        select: "-__v -createdAt -updatedAt -_id",
      });

    if (!user) {
      throw { statusCode: StatusCodes.NOT_FOUND, message: "Not found" };
    }

    return user;
  }

  async getProfile(userId: string) {
    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      throw { statusCode: StatusCodes.NOT_FOUND, message: "Profile not found" };
    }

    return profile;
  }

  async getUserProfile(requesterId: string, targetUserId: string) {
    if (requesterId === targetUserId) {
      return this.getProfile(requesterId);
    }

    const canView = await this.canViewProfile(requesterId, targetUserId);
    if (!canView) {
      throw {
        statusCode: StatusCodes.FORBIDDEN,
        message:
          "You can only view profiles of users you have a confirmed ride with.",
      };
    }

    const profile = await Profile.findOne({ user: targetUserId });
    if (!profile) {
      throw { statusCode: StatusCodes.NOT_FOUND, message: "Profile not found" };
    }

    return profile;
  }

  private async canViewProfile(
    requesterId: string,
    targetUserId: string
  ): Promise<boolean> {
    const booking = await Booking.findOne({
      status: BookingStatus.CONFIRMED,
      $or: [
        { driver: requesterId, passenger: targetUserId },
        { driver: targetUserId, passenger: requesterId },
      ],
    });

    return !!booking;
  }

  async updateProfile(userId: string, updateData: UpdateProfilePayload) {
    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!profile) {
      throw { statusCode: StatusCodes.NOT_FOUND, message: "Profile not found" };
    }

    return profile;
  }

  async getRides(userId: string, query: IGetUserRidesQueryPayload) {
    const {
      type = UserRideRole.AS_PASSENGER,
      sortOrder = "asc",
      page = 1,
      limit = 10,
    } = query || {};

    const skip = (page - 1) * limit;
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    let data: any[];
    let totalCount: number;

    if (type === UserRideRole.AS_DRIVER) {
      const matchStage = {
        $match: {
          driver: new Types.ObjectId(userId),
          status: { $in: [RideStatus.ACTIVE, RideStatus.COMPLETED] },
        },
      };

      const totalCountResult = await Ride.aggregate([
        matchStage,
        { $count: "total" },
      ]);

      totalCount = totalCountResult[0]?.total || 0;

      data = await Ride.aggregate([
        matchStage,
        {
          $addFields: {
            confirmedPassengers: {
              $filter: {
                input: "$passengers",
                as: "p",
                cond: { $eq: ["$$p.status", BookingStatus.CONFIRMED] },
              },
            },
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
            totalPassengersBooked: { $size: "$confirmedPassengers" },
            status: 1,
          },
        },
        { $sort: { departureTime: sortDirection } },
        { $skip: skip },
        { $limit: limit },
      ]);
    } else {
      totalCount = await Booking.countDocuments({
        passenger: userId,
      });

      const bookings = await Booking.aggregate([
        {
          $match: {
            passenger: new Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "rides",
            localField: "ride",
            foreignField: "_id",
            as: "rideDetails",
          },
        },
        { $unwind: "$rideDetails" },
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
          $unwind: {
            path: "$driverProfile",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            driverProfile: {
              $cond: {
                if: { $ne: ["$driverProfile", null] },
                then: {
                  firstName: "$driverProfile.firstName",
                  rating: "$driverProfile.rating",
                },
                else: null,
              },
            },
          },
        },
        {
          $project: {
            user: 0,
          },
        },
        {
          $project: {
            _id: "$rideDetails._id",
            origin: "$rideDetails.origin",
            destination: "$rideDetails.destination",
            departureTime: "$rideDetails.departureTime",
            pricePerSeat: "$rideDetails.pricePerSeat",
            status: "$rideDetails.status",
            driver: "$driverProfile",
            bookingStatus: "$status",
            bookingDate: "$createdAt",
          },
        },
        { $sort: { createdAt: sortDirection } },
        { $skip: skip },
        { $limit: limit },
      ]);

      data = bookings;
    }

    return {
      count: data.length,
      total: totalCount,
      page,
      pages: Math.ceil(totalCount / limit),
      data,
    };
  }

  async getRideById(rideId: string, userId: string) {
    if (!Types.ObjectId.isValid(rideId)) {
      throw { statusCode: StatusCodes.BAD_REQUEST, message: "Invalid Ride ID" };
    }

    const rideBase = await Ride.findById(rideId)
      .populate("driver", "email phoneNumber roles profile")
      .lean();

    if (!rideBase) {
      throw { statusCode: StatusCodes.NOT_FOUND, message: "Ride not found" };
    }

    const isDriver = rideBase.driver?._id?.toString() === userId?.toString();
    const isPassenger = rideBase.passengers?.some(
      (p) => p.user?._id?.toString() === userId?.toString()
    );

    if (!isDriver && !isPassenger) {
      throw {
        statusCode: StatusCodes.FORBIDDEN,
        message: "Not authorized to view this ride",
      };
    }

    const userHasRequested = rideBase.passengers?.some(
      (p) => p.user?.toString() === userId?.toString()
    );

    const noAvailableSeats = (rideBase.availableSeats ?? 0) <= 0;

    const rideInactive = ["completed", "cancelled"].includes(
      rideBase.status?.toLowerCase()
    );

    const canBook = !(
      isDriver ||
      userHasRequested ||
      noAvailableSeats ||
      rideInactive
    );

    let responseData;
    if (isDriver) {
      const rideWithPassengers = await Ride.findById(rideId)
        .populate("passengers.user", "email phoneNumber profile")
        .lean();

      responseData = {
        ride: {
          ...rideBase,
          passengers: rideWithPassengers?.passengers || [],
          canBook,
        },
      };
    } else {
      const { passengers: _passengers, ...rideWithoutPassengers } = rideBase;
      responseData = {
        ride: {
          ...rideWithoutPassengers,
          canBook,
        },
      };
    }

    return responseData;
  }
}

export const userService = new UserService();
