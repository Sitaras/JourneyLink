import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { IErrorResponse } from "@journey-link/shared";

export const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || "An unexpected error occurred";

  const errorResponse: IErrorResponse = {
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(statusCode).json(errorResponse);
};
