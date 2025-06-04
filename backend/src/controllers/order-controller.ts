import { SortOrder } from "../types/shared.types";
import { PersonRole } from "../types/person.types";

import { Request, Response, NextFunction } from "express";

import { OrderService } from "../services/order-service";

import { ORDERS_SORT_FIELDS } from "../constants/sortable-fields";
import ERROR_MESSAGES from "../constants/error-messages";

import AppError from "../utils/AppError";
import { parseSortParams } from "../utils/helpers";

export const OrderController = {
  async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (!userId || !userRole)
        throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);

      const { page, limit, search, is_favorite, is_important } = req.query;

      const { sortBy, order } = parseSortParams(
        req.query.sortBy as string,
        req.query.order as string,
        ORDERS_SORT_FIELDS,
        "created_at"
      );

      const orders = await OrderService.getAll({
        page: Number(page),
        limit: Number(limit),
        filters: {
          is_important:
            is_important === "true"
              ? true
              : is_favorite === "false"
              ? false
              : undefined,
        },
        search: search as string,
        sortBy: sortBy as string,
        order: (order as SortOrder) || "desc",
        user_id: Number(userId),
        user_role: userRole as PersonRole,
      });
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  },

  async toggleFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const orderId = req.params.id;

      if (!userId) throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);

      const result = await OrderService.toggleFavorite({
        orderId: Number(orderId),
        personId: Number(userId),
      });
      res.status(200).json({ message: result.status });
    } catch (error) {
      next(error);
    }
  },

  async toggleImportant(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.id;
      const isImportant = req.body.isImportant;
      console.log("🚀 ~ isImportant:", isImportant);

      const updatedOrder = await OrderService.toggleImportant({
        orderId: Number(orderId),
        isImportant,
      });

      if (!updatedOrder) {
        throw new AppError(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
      }
      res.status(200).json(updatedOrder);
    } catch (error) {
      next(error);
    }
  },
};
