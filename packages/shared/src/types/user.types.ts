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

export interface ITokenPayload {
  userId: string;
  roles: UserRole[];
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

export interface IRefreshResponse {
  refreshToken: string;
  accessToken: string;
}

// Frontend user type
export interface IUser {
  role: UserRole;
  profile?: any;
}
