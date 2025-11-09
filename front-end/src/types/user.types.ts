export enum UserRole {
  PASSENGER = "passenger",
  DRIVER = "driver",
}

export interface IRefreshToken {
  token: string;
  createdAt: Date;
}

export interface ITokenPayload {
  userId: string;
  roles: UserRole[];
}

export interface IRefreshResponse {
  refreshToken: string;
  accessToken: string;
}

export interface IUser {
  role: UserRole;
  profile?: any;
}
