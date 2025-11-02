import { Response } from "express";
import { User } from "../models/user.model";
import { Profile } from "../models/profile.model";
import { AuthRequest } from "@/middleware/auth.middleware";
import { StatusCodes } from "http-status-codes";
import { UpdateProfilePayload } from "@/schemas/profileSchema";

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
}
