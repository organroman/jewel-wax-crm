import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";

export const validateBody =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      const message = error.errors?.[0]?.message || ERROR_MESSAGES.INVALID_REQUEST;
      next(new AppError(message, 400));
    }
  };
