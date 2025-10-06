export enum UserRoleEnum {
  PASSENGER = "passenger",
  DRIVER = "driver",
}

export interface IRefreshToken {
  token: string;
  createdAt: Date;
}

export interface ITokenPayload {
  userId: string;
  roles: UserRoleEnum[];
}

export interface IRefreshResponse {
  refreshToken: string;
  accessToken: string;
}

export interface IUser {
  role: UserRoleEnum;
  profile?: any;
}
