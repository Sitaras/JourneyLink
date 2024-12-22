import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Profile } from "../models/profile.model";
import * as tokenUtils from "../utils/token.utils";
import { IUserRegistration, IUserLogin } from "../types/user.types";

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

      if (
        !email ||
        !password ||
        !verifyPassword ||
        !firstName ||
        !lastName ||
        !dateOfBirth
      ) {
        res.error("All fields are required");
        return;
      }

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
        res.error("Invalid credentials");
        return;
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        res.error("Invalid credentials");
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
          ...req.body,
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
}
