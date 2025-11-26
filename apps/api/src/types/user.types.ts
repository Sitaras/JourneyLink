import { Types } from "mongoose";
import { UserRole, IRefreshToken } from "@journey-link/shared";

// Mongoose Document interface for User
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
