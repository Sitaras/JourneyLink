import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Profile } from "../models/profile.model";
import * as tokenUtils from "../utils/token.utils";
import { IUserRegistration, IUserLogin } from "@journey-link/shared";
import { verifyRefreshToken } from "../utils/token.utils";
import { Types } from "mongoose";
import { AuthRequest } from "../middleware/auth.middleware";
import { StatusCodes } from "http-status-codes";
import { IRefreshTokenPayload } from "../schemas/auth/refreshTokenSchema";

export class AuthController {
  static async register(
    req: Request<unknown, unknown, IUserRegistration>,
    res: Response
  ) {
    try {
      const {
        email,
        password,
        verifyPassword,
        phoneNumber,
        firstName,
        lastName,
        dateOfBirth,
      } = req.body;

      if (password !== verifyPassword) {
        res.error("Passwords do not match");
        return;
      }

      const existingUser = await User.findOne({
        $or: [{ email }, { phoneNumber }],
      });

      if (existingUser) {
        res.error("User already exists");
        return;
      }

      const user = new User({
        email,
        password,
        phoneNumber,
      });
      const profile = new Profile({
        user: user._id,
        firstName,
        lastName,
        dateOfBirth,
        email,
        phoneNumber,
      });

      user.profile = profile._id as Types.ObjectId;

      await Promise.all([user.save(), profile.save()]);

      res.success(req.body, "User registered successfully");
    } catch (error) {
      res.error("An error occurred", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  static async login(
    req: Request<unknown, unknown, IUserLogin>,
    res: Response
  ) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        res.error("INVALID_CREDENTIALS");
        return;
      }

      const isValidPassword = await user.comparePassword(password);

      if (!isValidPassword) {
        res.error("INVALID_CREDENTIALS");
        return;
      }

      const tokenPayload = {
        userId: user.toString(),
        roles: user.roles,
      };

      const accessToken = tokenUtils.generateAccessToken(tokenPayload);
      const refreshToken = tokenUtils.generateRefreshToken(tokenPayload);

      user.refreshTokens.push({ token: refreshToken, createdAt: new Date() });
      await user.save();

      res.success(
        {
          tokens: {
            accessToken,
            refreshToken,
          },
        },
        "Successfully logged in"
      );
    } catch (error) {
      res.error("An error occurred", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  static async refreshToken(
    req: Request<unknown, unknown, IRefreshTokenPayload>,
    res: Response
  ) {
    try {
      const { refreshToken } = req.body;

      const user = await User.findOne({
        "refreshTokens.token": refreshToken,
      });

      if (!user) {
        res.error("Unauthorized", StatusCodes.UNAUTHORIZED);
        return;
      }

      try {
        const decoded = verifyRefreshToken(refreshToken);

        if (
          typeof decoded === "string" ||
          user._id.toString() !== decoded.userId
        ) {
          return res.error("Unauthorized", StatusCodes.UNAUTHORIZED);
        }

        user.refreshTokens = user.refreshTokens.filter((token) => {
          const tokenAge = Date.now() - token.createdAt.getTime();
          return tokenAge < 7 * 24 * 60 * 60 * 1000; // 7 days
        });

        const tokenPayload = {
          userId: user._id.toString(),
          roles: user.roles,
        };

        const newAccessToken = tokenUtils.generateAccessToken(tokenPayload);
        const newRefreshToken = tokenUtils.generateRefreshToken(tokenPayload);

        user.refreshTokens = user.refreshTokens.filter(
          (token) => token.token !== refreshToken
        );
        user.refreshTokens.push({
          token: newRefreshToken,
          createdAt: new Date(),
        });

        await user.save();

        res.success(
          {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          },
          "Tokens refreshed successfully"
        );
      } catch (error) {
        return res.error("Unauthorized", StatusCodes.UNAUTHORIZED);
      }
    } catch (error) {
      res.error("An error occurred", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  static async logout(
    req: AuthRequest<unknown, unknown, IRefreshTokenPayload>,
    res: Response
  ) {
    try {
      const { refreshToken } = req.body;

      const user = await User.findOne({
        "refreshTokens.token": refreshToken,
      });

      if (!user) {
        res.error("Unauthorized", StatusCodes.UNAUTHORIZED);
        return;
      }

      if (user) {
        user.refreshTokens = user.refreshTokens.filter(
          (token) => token.token !== refreshToken
        );
        await user.save();
      }

      return res.success(
        null,
        "Logged out successfully",
        StatusCodes.RESET_CONTENT
      );
    } catch (error) {
      return res.error(
        "An error occurred during logout",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Logout from all devices
  static async logoutAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      const user = await User.findById(userId);

      if (!user) {
        res.error("Unauthorized", StatusCodes.UNAUTHORIZED);
        return;
      }

      if (user) {
        user.refreshTokens = [];
        await user.save();
      }

      res.success(null, "Logged out successfully", StatusCodes.RESET_CONTENT);
    } catch (error) {
      res.error(
        "An error occurred during logout",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
