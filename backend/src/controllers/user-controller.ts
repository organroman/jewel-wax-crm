import { Request, Response, NextFunction } from "express";

import { UserService } from "../services/user-service";

import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";

export const UserController = {
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { full_name, password, email, role } = req.body;

      if (!full_name || !email || !password || !role) {
        throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS, 400);
      }

      const newUser = await UserService.createUser({
        full_name,
        password,
        email,
        role,
      });
      res.status(201).json(newUser);
    } catch (error: any) {
      if (error.code === "23505") {
        return next(new AppError(ERROR_MESSAGES.EMAIL_EXISTS, 409));
      }

      next(error);
    }
  },
};
