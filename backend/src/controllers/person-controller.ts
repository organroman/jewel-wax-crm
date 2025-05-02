import { Request, Response, NextFunction } from "express";

import { PersonService } from "../services/person-service";

import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";

export const PersonController = {
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await PersonService.getAll();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await PersonService.getById(Number(req.params.id));
      if (!user) {
        throw new AppError(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },

  async createPerson(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser = await PersonService.create(req.body);
      res.status(201).json(newUser);
    } catch (error: any) {
      if (error.code === "23505") {
        return next(new AppError(ERROR_MESSAGES.EMAIL_EXISTS, 409));
      }

      next(error);
    }
  },

  async updatePerson(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedPerson = await PersonService.update(
        Number(req.params.id),
        req.body
      );

      if (!updatedPerson) {
        throw new AppError(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
      }
      res.status(200).json(updatedPerson);
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedCount = await PersonService.delete(Number(req.params.id));
      if (!deletedCount) {
        throw new AppError(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
