import { SortOrder } from "../types/shared.types";
import { PersonRole } from "../types/person.types";
import { PaymentStatus, Stage } from "../types/order.types";

import { Request, Response, NextFunction } from "express";

import { OrderService } from "../services/order-service";

import { ORDERS_SORT_FIELDS } from "../constants/sortable-fields";

import ERROR_MESSAGES from "../constants/error-messages";

import AppError from "../utils/AppError";
import { parseStringArray, parseSortParams } from "../utils/parse-query-params";

export const OrderController = {
  async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (!userId || !userRole)
        throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);

      const { page, limit, search, active_stage, payment_status } = req.query;

      const parsedPaymentStatus =
        parseStringArray<PaymentStatus>(payment_status);

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
          active_stage: active_stage as Stage,
          payment_status: parsedPaymentStatus,
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
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.id;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (!userId || !userRole)
        throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);

      const order = await OrderService.getById({
        orderId: Number(orderId),
        role: userRole as PersonRole,
        userId: Number(userId),
      });

      if (!order) {
        throw new AppError(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
      }

      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUserId = req.user?.id;
      const currentUserRole = req.user?.role;

      const updatedOrder = await OrderService.update({
        role: currentUserRole as PersonRole,
        userId: Number(currentUserId),
        data: req.body,
        orderId: Number(req.params.id),
      });

      if (!updatedOrder) {
        throw new AppError(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
      }
      res.status(200).json(updatedOrder);
    } catch (error) {
      next(error);
    }
  },
  async getOrderNumbers(req: Request, res: Response, next: NextFunction) {
    try {
      const { search } = req.query;

      const orders = await OrderService.getOrdersNumbers({
        search: search as string,
      });
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  },
};
