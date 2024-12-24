import { Request, Response, NextFunction } from "express";
import {
  ISuccessResponse,
  CustomSuccessResponse,
} from "../types/successResponse.types";


export const successResponse = <T>(
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  (res as CustomSuccessResponse<T>).success = (
    data: T,
    message: string = "Operation successful",
    statusCode: number = 200
  ): void => {
    const response: ISuccessResponse<T> = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
    res.status(statusCode).json(response);
  };
  next();
};
