import * as _Express from "express";

declare global {
  namespace Express {
    interface Response {
      success<T>(data: T, message?: string, statusCode?: number): void;
      error(message: string, statusCode?: number, error?: any): void;
    }
  }
}
