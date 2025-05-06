import { SortOrder } from "../types/shared.types";
import { RequestSource, RequestStatus } from "../types/request.types";

import { Request, Response, NextFunction } from "express";

import { RequestService } from "../services/request-service";

import { parseSortParams } from "../utils/helpers";
import AppError from "../utils/AppError";
import { REQUEST_SORT_FIELDS } from "../constants/sortable-fields";
import ERROR_MESSAGES from "../constants/error-messages";

export const RequestController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, status, source, search } = req.query;
      const { sortBy, order } = parseSortParams(
        req.query.sortBy as string,
        req.query.order as string,
        REQUEST_SORT_FIELDS,
        "created_at"
      );

      const requests = await RequestService.getAll({
        page: Number(page),
        limit: Number(limit),
        filters: {
          source: source as RequestSource,
          status: status as RequestStatus,
        },
        search: search as string,
        sortBy: sortBy as string,
        order: (order as SortOrder) || "desc",
      });
      res.status(200).json(requests);
    } catch (error) {
      next(error);
    }
  },
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const request = await RequestService.getById(Number(req.params.id));

      if (!request) {
        throw new AppError(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
      }
      res.status(200).json(request);
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUser = req.user?.id;
      const newRequest = await RequestService.create(req.body, currentUser);
      res.status(201).json(newRequest);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUser = req.user?.id;
      const updatedRequest = await RequestService.update(
        Number(req.params.id),
        req.body,
        currentUser
      );

      if (!updatedRequest) {
        throw new AppError(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
      }
      res.status(200).json(updatedRequest);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUser = req.user?.id;
      const deletedCount = await RequestService.delete(
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
