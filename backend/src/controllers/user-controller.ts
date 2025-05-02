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

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUserById(Number(req.params.id));
      if (!user) {
        throw new AppError(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
      }

      res.status(200).json(user);
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

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedUser = await UserService.updateUser(
        Number(req.params.id),
        req.body
      );

      if (!updatedUser) {
        throw new AppError(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedCount = await UserService.deleteUser(Number(req.params.id));
      if (!deletedCount) {
        throw new AppError(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
