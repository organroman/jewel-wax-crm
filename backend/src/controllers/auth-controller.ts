import { NextFunction, Request, Response } from "express";

import { AuthService } from "../services/auth-service";
import { PersonService } from "../services/person-service";

import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";
import INFO_MESSAGES from "../constants/info-messages";
import { clearRefreshCookie, setRefreshCookie } from "../utils/cookies";

export const AuthController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError(ERROR_MESSAGES.PASSWORD_EMAIL_REQUIRED, 400);
      }
      const { token, refresh_token, person } = await AuthService.login(
        email,
        password
      );
      if (refresh_token) {
        setRefreshCookie(res, refresh_token);
      }

      res.status(200).json({ token, person });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const rt = req.cookies?.rt;

      if (!rt) {
        clearRefreshCookie(res);
        res.status(204).end();
      }

      await AuthService.logout(rt);
      clearRefreshCookie(res);
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  },
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const rt = req.cookies?.rt;

      if (!rt) {
        throw new AppError(ERROR_MESSAGES.MISSING_REFRESH_TOKEN, 400);
      }

      const { token, person, refresh_token } =
        await AuthService.refreshAccessToken(rt);

      if (refresh_token) {
        setRefreshCookie(res, refresh_token);
      }

      res.status(200).json({ token, person });
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
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);
      }
      const person = await PersonService.getById(Number(userId));

      if (!person) {
        throw new AppError(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
      }

      res.status(200).json(person);
    } catch (error) {
      next(error);
    }
  },

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);
      }
      const { currentPassword, newPassword } = req.body;

      const { token, refresh_token, person } = await AuthService.changePassword(
        Number(userId),
        currentPassword,
        newPassword
      );

      if (refresh_token) {
        setRefreshCookie(res, refresh_token);
      }
      res.status(200).json({ token, person });
    } catch (error) {
      next(error);
    }
  },
};
