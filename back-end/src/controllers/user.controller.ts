import { Response } from "express";
import { User } from "../models/user.model";
import { AuthRequest } from "@/middleware/auth.middleware";

export class UserController {
  static async getUserInfo(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;

      const user = await User.findById(userId).select(
        "-password -refreshTokens -profile -__v"
      );
      if (!user) {
        res.error("Not found", 404);
        return;
      }

      res.success(user);
    } catch (error: Error) {
      res.error("An error occurred", 500);
      return;
    }
  }
}
