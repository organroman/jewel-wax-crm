import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";

interface JwtPayload {
  id: number;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next(new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401));
  }
  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as JwtPayload;

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  } catch (error) {
    return next(new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401));
  }
};
