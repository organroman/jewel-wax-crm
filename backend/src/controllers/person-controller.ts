import { Request, Response, NextFunction } from "express";

import { PersonService } from "../services/person-service";

import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";

export const PersonController = {
  async getAllPersons(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await PersonService.getAll();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },

  async getPersonById(req: Request, res: Response, next: NextFunction) {
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
      const currentUser = req.user?.id;
      const newUser = await PersonService.create(req.body, currentUser);
      res.status(201).json(newUser);
    } catch (error: any) {
      next(error);
    }
  },

  async updatePerson(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUser = req.user?.id;
      const updatedPerson = await PersonService.update(
        Number(req.params.id),
        req.body,
        currentUser
      );

      if (!updatedPerson) {
        throw new AppError(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
      }
      res.status(200).json(updatedPerson);
    } catch (error) {
      next(error);
    }
  },

  async deletePerson(req: Request, res: Response, next: NextFunction) {
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
