import { Request, Response, NextFunction } from "express";

import { FinanceService } from "../services/finance-service";

import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";

export const FinanceController = {
  async createInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);
      }

      const invoice = await FinanceService.createInvoice({
        data: req.body,
        userId: Number(userId),
      });

      if (!invoice) {
        throw new AppError(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
      }
      res.status(200).json(invoice);
    } catch (error) {
      next(error);
    }
  },
  async getInvoicesByOrderId(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.orderId;

      if (!orderId) {
        throw new AppError(ERROR_MESSAGES.MISSING_ORDER_ID, 400);
      }
      const invoices = await FinanceService.getInvoicesByOrderId(
        Number(orderId)
      );

      res.status(200).json(invoices);
    } catch (error) {
      next(error);
    }
  },
};
