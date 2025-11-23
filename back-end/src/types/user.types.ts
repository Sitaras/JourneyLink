import { Types } from "mongoose";

export enum UserRole {
  PASSENGER = "passenger",
  DRIVER = "driver",
}

export enum UserRideRole {
  AS_PASSENGER = "asPassenger",
  AS_DRIVER = "asDriver",
}

export interface IRefreshToken {
  token: string;
  createdAt: Date;
}

export interface IUser {
  email: string;
  password: string;
  phoneNumber: string;
  roles: UserRole[];
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
  dateOfBirth: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface ITokenPayload {
  userId: string;
  roles: UserRole[];
}
