import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { IGetUserRidesQueryPayload } from "../schemas/user/userRideSchema";
import { MongoIdParam } from "../schemas/idSchema";
import { UserService, userService } from "../services/user.service";
import { UpdateProfilePayload } from "@journey-link/shared";

export class UserController {
  constructor(private userService: UserService) {}

  getUserInfo = async (req: AuthRequest, res: Response, next: any) => {
    try {
      const userId = req.user?.userId;
      const result = await this.userService.getUserInfo(userId!);
      return res.success(result, "User info fetched successfully");
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: AuthRequest, res: Response, next: any) => {
    try {
      const userId = req.user?.userId;
      const result = await this.userService.getProfile(userId!);
      return res.success(result, "Profile fetched successfully");
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (
    req: AuthRequest<unknown, unknown, UpdateProfilePayload>,
    res: Response,
    next: any
  ) => {
    try {
      const userId = req.user?.userId;
      const result = await this.userService.updateProfile(userId!, req.body);
      return res.success(result, "Profile updated successfully");
    } catch (error) {
      next(error);
    }
  };

  getRides = async (
    req: AuthRequest<unknown, unknown, unknown, IGetUserRidesQueryPayload>,
    res: Response,
    next: any
  ) => {
    try {
      const userId = req.user?.userId;
      const result = await this.userService.getRides(userId!, req.query);
      return res.success(result, "User rides fetched successfully");
    } catch (error) {
      next(error);
    }
  };

  getRideById = async (
    req: AuthRequest<MongoIdParam>,
    res: Response,
    next: any
  ) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const result = await this.userService.getRideById(id, userId!);
      return res.success(result, "Ride details fetched successfully");
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController(userService);
