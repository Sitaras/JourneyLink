import { Response } from "express";
import { User } from "../models/user.model";
import { Profile } from "../models/profile.model";
import { AuthRequest } from "@/middleware/auth.middleware";
import { StatusCodes } from "http-status-codes";
import { UpdateProfilePayload } from "../schemas/user/userProfileSchema";
import { Booking } from "../models/booking.model";
import { Ride } from "../models/ride.model";
import { Types } from "mongoose";
import { MongoIdParam } from "../schemas/idSchema";
import { IGetUserRidesQueryPayload } from "@/schemas/user/userRideSchema";
import { RideStatus } from "../types/ride.types";
import { BookingStatus } from "../types/booking.types";
import { UserRideRole } from "../types/user.types";

export class UserController {
  static async getUserInfo(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;

      const user = await User.findById(userId)
        .select("-password -refreshTokens -__v -_id")
        .populate({
          path: "profile",
          select: "-__v -createdAt -updatedAt -_id",
        });

      if (!user) {
        res.error("Not found", StatusCodes.NOT_FOUND);
        return;
      }

      res.success(user);
    } catch (error: any) {
      res.error("An error occurred", StatusCodes.INTERNAL_SERVER_ERROR);
      return;
    }
  }

  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;

      const profile = await Profile.findOne({ user: userId });

      if (!profile) {
        res.error("Profile not found", StatusCodes.NOT_FOUND);
        return;
      }

      res.success(profile);
    } catch (error) {
      console.error("Get profile error:", error);
      res.error("An error occurred", StatusCodes.INTERNAL_SERVER_ERROR);
      return;
    }
  }

  static async updateProfile(
    req: AuthRequest<{}, {}, UpdateProfilePayload>,
    res: Response
  ) {
    try {
      const userId = req.user?.userId;
      const updateData = req.body;

      const profile = await Profile.findOneAndUpdate(
        { user: userId },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!profile) {
        res.error("Profile not found", StatusCodes.NOT_FOUND);
        return;
      }

      res.success(profile);
    } catch (error: any) {
      console.error("Profile update error:", error);
      res.error("An error occurred", StatusCodes.INTERNAL_SERVER_ERROR);
      return;
    }
  }

  static async getRides(
    req: AuthRequest<{}, {}, {}, IGetUserRidesQueryPayload>,
    res: Response
  ) {
    try {
      const userId = req.user?.userId;
      const {
        type = UserRideRole.AS_PASSENGER,
        sortOrder = "asc",
        page = 1,
        limit = 10,
      } = req.query || {};

      const skip = (page - 1) * limit;

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
        const totalCount = totalCountResult[0]?.total || 0;

        const rides = await Ride.aggregate([
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
          { $skip: skip },
          { $limit: limit },
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return res.success(
          {
            count: rides.length,
            total: totalCount,
            page,
            pages: totalPages,
            data: rides,
          },
          "Rides fetched successfully",
          StatusCodes.OK
        );
      }

      if (type === UserRideRole.AS_PASSENGER) {
        const totalCount = await Booking.countDocuments({
          passenger: userId,
          status: { $ne: BookingStatus.CANCELLED },
        });

        const bookings = await Booking.find({
          passenger: userId,
          status: { $ne: BookingStatus.CANCELLED },
        })
          .populate("ride", "origin destination departureTime pricePerSeat")
          .sort({ createdAt: sortOrder === "asc" ? 1 : -1 })
          .skip(skip)
          .limit(limit);

        const totalPages = Math.ceil(totalCount / limit);

        return res.success(
          {
            count: bookings.length,
            total: totalCount,
            page,
            pages: totalPages,
            data: bookings,
          },
          "Rides fetched successfully",
          StatusCodes.OK
        );
      }
    } catch (error) {
      return res.error(
        "Server error while fetching rides.",
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      );
    }
  }

  static async getRideById(req: AuthRequest<MongoIdParam>, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      // Validate ride ID
      if (!Types.ObjectId.isValid(id)) {
        return res.error("Invalid Ride ID", StatusCodes.BAD_REQUEST);
      }

      const rideBase = await Ride.findById(id)
        .populate("driver", "email phoneNumber roles profile")
        .lean();

      if (!rideBase) {
        return res.error("Ride not found", StatusCodes.NOT_FOUND);
      }

      const isDriver = rideBase.driver?._id?.toString() === userId?.toString();
      const isPassenger = rideBase.passengers?.some(
        (p) => p.user?._id?.toString() === userId?.toString()
      );

      if (!isDriver && !isPassenger) {
        return res.error(
          "Not authorized to view this ride",
          StatusCodes.FORBIDDEN
        );
      }

      let responseData;
      // If user is driver, populate passengers info
      if (isDriver) {
        const rideWithPassengers = await Ride.findById(id)
          .populate("passengers.user", "email phoneNumber profile")
          .lean();

        responseData = {
          ride: {
            ...rideBase,
            passengers: rideWithPassengers?.passengers || [],
          },
        };
      } else {
        // For passengers, exclude the passengers field
        const { passengers, ...rideWithoutPassengers } = rideBase;
        responseData = { ride: rideWithoutPassengers };
      }

      return res.success(responseData, "Ride details", StatusCodes.OK);
    } catch (error) {
      return res.error(
        "Server Error",
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      );
    }
  }
}
