import { Request, Response, NextFunction } from "express";
import { parseSortParams } from "../utils/helpers";
import { ORDERS_SORT_FIELDS } from "../constants/sortable-fields";
import { OrderService } from "../services/order-service";
import { SortOrder } from "../types/shared.types";

export const OrderController = {
  async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
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
          is_favorite:
            is_favorite === "true"
              ? true
              : is_favorite === "false"
              ? false
              : undefined,
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
      });
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  },
};
