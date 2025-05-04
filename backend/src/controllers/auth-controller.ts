import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";
import INFO_MESSAGES from "../constants/info-messages";
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

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.body;

      if (!refreshToken) {
        throw new AppError(ERROR_MESSAGES.MISSING_REFRESH_TOKEN, 400);
      }

      await AuthService.logout(refreshToken);
      res.status(200).json({ message: INFO_MESSAGES.SUCCESS_LOGOUT });
    } catch (error) {
      next(error);
    }
  },
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refresh_token } = req.body;

      if (!refresh_token) {
        throw new AppError(ERROR_MESSAGES.MISSING_REFRESH_TOKEN, 400);
      }

      const result = await AuthService.refreshAccessToken(refresh_token);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  async resetPasswordToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      if (!email) {
        throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS, 400);
      }

      const result = await AuthService.createResetPasswordRequest(email);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, new_password } = req.body;

      if (!token || !new_password) {
        throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS, 400);
      }

      await AuthService.resetPassword(token, new_password);
      res.status(200).json({ message: INFO_MESSAGES.PASSWORD_HAS_BEEN_RESET });
    } catch (error) {
      next(error);
    }
  },
};
