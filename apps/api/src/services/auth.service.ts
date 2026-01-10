import { User } from "../models/user.model";
import { Profile } from "../models/profile.model";
import * as tokenUtils from "../utils/token.utils";
import {
  IUserRegistration,
  IUserLogin,
  ErrorCodes,
} from "@journey-link/shared";
import { verifyRefreshToken } from "../utils/token.utils";
import { Types } from "mongoose";
import { IRefreshTokenPayload } from "../schemas/auth/refreshTokenSchema";
import { StatusCodes } from "http-status-codes";

export class AuthService {
  async register(data: IUserRegistration) {
    const {
      email,
      password,
      verifyPassword,
      phoneNumber,
      firstName,
      lastName,
      dateOfBirth,
    } = data;

    if (password !== verifyPassword) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: ErrorCodes.PASSWORDS_DO_NOT_MATCH,
      };
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      let message: string = ErrorCodes.USER_ALREADY_EXISTS;
      if (existingUser.email === email) {
        message = ErrorCodes.EMAIL_ALREADY_IN_USE;
      } else if (existingUser.phoneNumber === phoneNumber) {
        message = ErrorCodes.PHONE_NUMBER_ALREADY_IN_USE;
      }

      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message,
      };
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

    return data;
  }

  async login(data: IUserLogin) {
    const { email, password } = data;

    const user = await User.findOne({ email });

    if (!user) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: ErrorCodes.INVALID_CREDENTIALS,
      };
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: ErrorCodes.INVALID_CREDENTIALS,
      };
    }

    const tokenPayload = {
      userId: user._id.toString(),
      roles: user.roles,
    };

    const accessToken = tokenUtils.generateAccessToken(tokenPayload);
    const refreshToken = tokenUtils.generateRefreshToken(tokenPayload);

    user.refreshTokens.push({ token: refreshToken, createdAt: new Date() });
    await user.save();

    return {
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async refreshToken(data: IRefreshTokenPayload) {
    const { refreshToken } = data;

    const user = await User.findOne({
      "refreshTokens.token": refreshToken,
    });

    if (!user) {
      throw {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: ErrorCodes.UNAUTHORIZED,
      };
    }

    try {
      const decoded = verifyRefreshToken(refreshToken);

      if (
        typeof decoded === "string" ||
        user._id.toString() !== decoded.userId
      ) {
        throw {
          statusCode: StatusCodes.UNAUTHORIZED,
          message: ErrorCodes.UNAUTHORIZED,
        };
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

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: ErrorCodes.UNAUTHORIZED,
      };
    }
  }

  async logout(data: IRefreshTokenPayload) {
    const { refreshToken } = data;

    const user = await User.findOne({
      "refreshTokens.token": refreshToken,
    });

    if (!user) {
      throw {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: ErrorCodes.UNAUTHORIZED,
      };
    }

    user.refreshTokens = user.refreshTokens.filter(
      (token) => token.token !== refreshToken
    );
    await user.save();
  }

  async logoutAll(userId: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: ErrorCodes.UNAUTHORIZED,
      };
    }

    user.refreshTokens = [];
    await user.save();
  }
}

export const authService = new AuthService();
