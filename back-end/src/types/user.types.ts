import { Types } from "mongoose";

export enum UserRoleEnum {
  PASSENGER = "passenger",
  DRIVER = "driver",
}

export interface IRefreshToken {
  token: string;
  createdAt: Date;
}

export interface IUser {
  email: string;
  password: string;
  phoneNumber: string;
  roles: UserRoleEnum[];
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  refreshTokens: IRefreshToken[];
  profile: Types.ObjectId;
  createdAt: Date;
}

export interface IUserRegistration {
  email: string;
  password: string;
  verifyPassword: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface ITokenPayload {
  userId: string;
  roles: UserRoleEnum[];
}

export interface IRefreshTokenPayload {
  refreshToken: string;
}
