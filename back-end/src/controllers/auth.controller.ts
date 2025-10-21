import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Profile } from "../models/profile.model";
import * as tokenUtils from "../utils/token.utils";
import {
  IUserRegistration,
  IUserLogin,
  IRefreshTokenPayload,
} from "../types/user.types";
import { verifyRefreshToken } from "../utils/token.utils";

export class AuthController {
  static async register(
    req: Request<{}, {}, IUserRegistration>,
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

      user.profile = profile._id as any;

      await Promise.all([user.save(), profile.save()]);

      res.success(req.body, "User registered successfully");
    } catch (error) {
      res.error("An error occurred", 500);
    }
  }

  static async login(
    req: Request<{}, {}, IUserLogin>,
    res: Response
  ): Promise<void> {
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
        userId: user._id as string,
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
      res.error("An error occurred", 500);
    }
  }

  static async refreshToken(
    req: Request<{}, {}, IRefreshTokenPayload>,
    res: Response
  ): Promise<void> {
    try {
      const { refreshToken } = req.body;

      const user = await User.findOne({
        "refreshTokens.token": refreshToken,
      });

      if (!user) {
        res.error("Unauthorized", 401);
        return;
      }

      try {
        const decoded = verifyRefreshToken(refreshToken);

        if (
          typeof decoded === "string" ||
          (user._id as string).toString() !== decoded.userId
        ) {
          res.error("Unauthorized", 401);
          return;
        }

        user.refreshTokens = user.refreshTokens.filter((token) => {
          const tokenAge = Date.now() - token.createdAt.getTime();
          return tokenAge < 7 * 24 * 60 * 60 * 1000; // 7 days
        });

        const tokenPayload = {
          userId: user._id as string,
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
        res.error("Unauthorized", 401);
        return;
      }
    } catch (error) {
      res.error("An error occurred", 500);
    }
  }
}
