import { Request, Response } from "express";
import { IUserRegistration, IUserLogin } from "@journey-link/shared";
import { AuthRequest } from "../middleware/auth.middleware";
import { StatusCodes } from "http-status-codes";
import { IRefreshTokenPayload } from "../schemas/auth/refreshTokenSchema";
import { AuthService, authService } from "../services/auth.service";

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (
    req: Request<unknown, unknown, IUserRegistration>,
    res: Response,
    next: any
  ) => {
    try {
      const result = await this.authService.register(req.body);
      res.success(result, "User registered successfully");
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request<unknown, unknown, IUserLogin>,
    res: Response,
    next: any
  ) => {
    try {
      const result = await this.authService.login(req.body);
      res.success(result, "Successfully logged in");
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (
    req: Request<unknown, unknown, IRefreshTokenPayload>,
    res: Response,
    next: any
  ) => {
    try {
      const result = await this.authService.refreshToken(req.body);
      res.success(result, "Tokens refreshed successfully");
    } catch (error) {
      next(error);
    }
  };

  logout = async (
    req: AuthRequest<unknown, unknown, IRefreshTokenPayload>,
    res: Response,
    next: any
  ) => {
    try {
      await this.authService.logout(req.body);
      return res.success(
        null,
        "Logged out successfully",
        StatusCodes.RESET_CONTENT
      );
    } catch (error) {
      next(error);
    }
  };

  logoutAll = async (req: AuthRequest, res: Response, next: any) => {
    try {
      const userId = req.user?.userId;
      await this.authService.logoutAll(userId!);
      res.success(null, "Logged out successfully", StatusCodes.RESET_CONTENT);
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController(authService);
