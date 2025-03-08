import { Request, Response, NextFunction } from "express";
import {
  IErrorResponse,
  CustomErrorResponse,
} from "../types/errorResponse.types";
import { StatusCodes } from "http-status-codes";

export const errorResponse = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  (res as CustomErrorResponse).error = (
    message: string,
    statusCode: number = StatusCodes.BAD_REQUEST,
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
