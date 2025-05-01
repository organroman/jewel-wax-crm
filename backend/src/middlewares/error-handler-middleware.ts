import { NextFunction, Request, Response } from "express";
import ERROR_MESSAGES from "../constants/error-messages";

function errorHandler(
  err: Error & { statusCode?: number },
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const statusCode = err.statusCode || 500;
  const message = err.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
  res.status(statusCode).json({
    error: message,
  });
}

export default errorHandler;
