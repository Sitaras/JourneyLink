import { Request, Response, NextFunction } from "express";
import {
  IErrorResponse,
  CustomErrorResponse,
} from "../types/errorResponse.types";

export const errorResponse = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  (res as CustomErrorResponse).error = (
    message: string,
    statusCode: number = 400,
    error?: any
  ): void => {
    const errorResponse: IErrorResponse = {
      success: false,
      message,
      ...(error && { error }),
      ...(process.env.NODE_ENV === "development" && { stack: error?.stack }),
    };

    res.status(statusCode).json(errorResponse);
  };
  next();
};
