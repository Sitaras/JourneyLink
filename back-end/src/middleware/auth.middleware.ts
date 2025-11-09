import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ITokenPayload, UserRole } from "../types/user.types";
import { config } from "../config/config";
import * as core from "express-serve-static-core";

export interface AuthRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query,
  Locals extends Record<string, any> = Record<string, any>
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  user?: ITokenPayload;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) {
      res.error("Unauthorized", 401);
      return;
    }

    try {
      const decoded = jwt.verify(token, config.jwt.accessToken.secret);
      req.user = decoded as ITokenPayload;
      next();
    } catch (err) {
      res.error("Unauthorized", 401);
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
  if (!req.user?.roles.includes(UserRole.DRIVER)) {
    res.status(403).json({
      status: "error",
      message: "Driver access required",
    });
    return;
  }
  next();
};
