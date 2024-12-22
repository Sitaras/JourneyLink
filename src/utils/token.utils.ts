import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { ITokenPayload } from "../types/user.types";

export const generateAccessToken = (payload: ITokenPayload): string => {
  return jwt.sign(payload, config.jwt.accessToken.secret, {
    expiresIn: config.jwt.accessToken.expiry,
  });
};

export const generateRefreshToken = (payload: ITokenPayload): string => {
  return jwt.sign(payload, config.jwt.refreshToken.secret, {
    expiresIn: config.jwt.refreshToken.expiry,
  });
};

export const verifyRefreshToken = (token: string): ITokenPayload => {
  return jwt.verify(token, config.jwt.refreshToken.secret) as ITokenPayload;
};
