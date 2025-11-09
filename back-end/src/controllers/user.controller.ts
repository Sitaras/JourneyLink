import { Response } from "express";
import { User } from "../models/user.model";
import { Profile } from "../models/profile.model";
import { AuthRequest } from "@/middleware/auth.middleware";
import { StatusCodes } from "http-status-codes";
import { UpdateProfilePayload } from "../schemas/profileSchema";
import { Booking } from "../models/booking.model";
import { Ride } from "../models/ride.model";
import { Types } from "mongoose";

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

  static async getRides(req: AuthRequest, res: Response): Promise<void> {
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
