import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";
import { AuthService } from "../services/auth-service";

export const AuthController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError(ERROR_MESSAGES.PASSWORD_EMAIL_REQUIRED, 400);
      }
      const result = await AuthService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
