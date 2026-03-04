import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { IGetUserRidesQueryPayload } from "../schemas/user/userRideSchema";
import { MongoIdParam } from "../schemas/idSchema";
import { UserService, userService } from "../services/user.service";
import { UpdateProfilePayload } from "@journey-link/shared";

export class UserController {
  constructor(private userService: UserService) {}

  getUserInfo = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const userInfo = await this.userService.getUserInfo(userId!);
      return res.success(userInfo, "User info fetched successfully");
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const userProfile = await this.userService.getProfile(userId!);
      return res.success(userProfile, "Profile fetched successfully");
    } catch (error) {
      next(error);
    }
  };

  getUserProfile = async (
    req: AuthRequest<MongoIdParam>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const requesterId = req.user?.userId;
      const targetUserId = req.params.id;
      const targetUserProfile = await this.userService.getUserProfile(
        requesterId!,
        targetUserId
      );
      return res.success(targetUserProfile, "Profile fetched successfully");
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (
    req: AuthRequest<unknown, unknown, UpdateProfilePayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.userId;
      const updatedProfile = await this.userService.updateProfile(userId!, req.body);
      return res.success(updatedProfile, "Profile updated successfully");
    } catch (error) {
      next(error);
    }
  };

  getRides = async (
    req: AuthRequest<unknown, unknown, unknown, IGetUserRidesQueryPayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.userId;
      const userRides = await this.userService.getRides(userId!, req.query);
      return res.success(userRides, "User rides fetched successfully");
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController(userService);
