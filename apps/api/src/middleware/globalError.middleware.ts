import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { IErrorResponse } from "@journey-link/shared";
import { logger } from "../utils/logger";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || "An unexpected error occurred";

  // Log unexpected errors
  if (statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
    logger.error({
      error: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
    });
  }

  // Don't leak error details in production for 500 errors
  if (
    process.env.NODE_ENV === "production" &&
    statusCode === StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    message = "Internal server error";
  }

  const errorResponse: IErrorResponse = {
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(statusCode).json(errorResponse);
};
