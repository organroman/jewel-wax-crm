import { SortOrder } from "../types/shared.types";

import { Request, Response, NextFunction } from "express";

import { PersonService } from "../services/person-service";

import AppError from "../utils/AppError";
import {
  parseBooleanArray,
  parseNumberArray,
  parseSortParams,
} from "../utils/parse-query-params";
import ERROR_MESSAGES from "../constants/error-messages";
import { PERSON_SORT_FIELDS } from "../constants/sortable-fields";

export const PersonController = {
  async getAllPersons(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, role, city, country, is_active, search } = req.query;

      const parsedCity = parseNumberArray(city);
      const parsedCountry = parseNumberArray(country);
      const parsedIsActive = parseBooleanArray(is_active);

      const { sortBy, order } = parseSortParams(
        req.query.sortBy as string,
        req.query.order as string,
        PERSON_SORT_FIELDS,
        "created_at"
      );

      const users = await PersonService.getAll({
        page: Number(page),
        limit: Number(limit),
        filters: {
          role: role as string,
          city: parsedCity as number[],
          country: parsedCountry as number[],
          is_active: parsedIsActive as boolean[],
        },
        search: search as string,
        sortBy: sortBy as string,
        order: (order as SortOrder) || "desc",
      });
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
    } catch (error) {
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
      const currentUser = req.user?.id;
      const deletedCount = await PersonService.delete(
        Number(req.params.id),
        currentUser
      );
      if (!deletedCount) {
        throw new AppError(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
