import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ITokenPayload, UserRoleEnum } from "../types/user.types";
import { config } from "../config/config";

export interface AuthRequest extends Request {
  user?: ITokenPayload;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) {
      res.status(401).json({
        status: "error",
        message: "Access token is required",
      });
      return;
    }

    try {
      const decoded = jwt.verify(token, config.jwt.accessToken.secret);
      req.user = decoded as ITokenPayload;
      next();
    } catch (err) {
      res.status(403).json({
        status: "error",
        message: "Invalid or expired access token",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const isDriver = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user?.roles.includes(UserRoleEnum.DRIVER)) {
    res.status(403).json({
      status: "error",
      message: "Driver access required",
    });
    return;
  }
  next();
};
