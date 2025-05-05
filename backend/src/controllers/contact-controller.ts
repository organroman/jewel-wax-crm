import { ContactSource } from "../types/contact.types";
import { SortOrder } from "../types/shared.types";

import { Request, Response, NextFunction } from "express";

import { ContactService } from "../services/contact-service";

import { parseSortParams } from "../utils/helpers";
import AppError from "../utils/AppError";

import { CONTACT_SORT_FIELDS } from "../constants/sortable-fields";
import ERROR_MESSAGES from "../constants/error-messages";

export const ContactController = {
  async getAllContacts(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, source, search } = req.query;

      const { sortBy, order } = parseSortParams(
        req.query.sortBy as string,
        req.query.order as string,
        CONTACT_SORT_FIELDS,
        "created_at"
      );

      const contacts = await ContactService.getAll({
        page: Number(page),
        limit: Number(limit),
        filters: {
          source: source as ContactSource,
        },
        search: search as string,
        sortBy: sortBy as string,
        order: (order as SortOrder) || "desc",
      });
      res.status(200).json(contacts);
    } catch (error) {
      next(error);
    }
  },
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const contact = await ContactService.getById(Number(req.params.id));

      if (!contact) {
        throw new AppError(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
      }

      res.status(200).json(contact);
    } catch (error) {
      next(error);
    }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUser = req.user?.id;
      const newContact = await ContactService.findOrCreate(
        req.body,
        currentUser
      );
      res.status(201).json(newContact);
    } catch (error) {
      next(error);
    }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUser = req.user?.id;
      const updatedContact = await ContactService.update(
        Number(req.params.id),
        req.body,
        currentUser
      );
      if (!updatedContact) {
        throw new AppError(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
      }
      res.status(200).json(updatedContact);
    } catch (error) {
      next(error);
    }
  },
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUser = req.user?.id;
      const deletedCount = await ContactService.delete(
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
