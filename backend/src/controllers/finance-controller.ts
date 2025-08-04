import { Request, Response, NextFunction } from "express";

import { FinanceService } from "../services/finance-service";

import AppError from "../utils/AppError";
import { parseSortParams } from "../utils/parse-query-params";
import ERROR_MESSAGES from "../constants/error-messages";
import { FINANCE_SORT_FIELDS } from "../constants/sortable-fields";
import { SortOrder } from "../types/shared.types";

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
  async createExpense(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);
      }

      const expense = await FinanceService.createExpense(
        req.body,
        Number(userId)
      );

      if (!expense) {
        throw new AppError(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
      }
      res.status(200).json(expense);
    } catch (error) {
      next(error);
    }
  },
  async getAllFinance(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);

      const { page, limit, search } = req.query;

      const { sortBy, order } = parseSortParams(
        req.query.sortBy as string,
        req.query.order as string,
        FINANCE_SORT_FIELDS,
        "created_at"
      );

      const finance = await FinanceService.GetAllFinance({
        page: Number(page),
        limit: Number(limit),
        filters: {}, //todo: add filters
        search: search as string,
        sortBy: sortBy as string,
        order: (order as SortOrder) || "desc",
      });
      res.status(200).json(finance);
    } catch (error) {
      next(error);
    }
  },
  async getAllClientPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);

      const { page, limit, search } = req.query;

      const { sortBy, order } = parseSortParams(
        req.query.sortBy as string,
        req.query.order as string,
        FINANCE_SORT_FIELDS,
        "created_at"
      );

      const finance = await FinanceService.getAllClientPayments({
        page: Number(page),
        limit: Number(limit),
        filters: {}, //todo: add filters
        search: search as string,
        sortBy: sortBy as string,
        order: (order as SortOrder) || "desc",
      });
      res.status(200).json(finance);
    } catch (error) {
      next(error);
    }
  },
  async getAllModellerPayments(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;

      if (!userId) throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);

      const { page, limit, search } = req.query;

      const { sortBy, order } = parseSortParams(
        req.query.sortBy as string,
        req.query.order as string,
        FINANCE_SORT_FIELDS,
        "created_at"
      );

      const finance = await FinanceService.getAllPaymentToModeller({
        page: Number(page),
        limit: Number(limit),
        filters: {}, //todo: add filters
        search: search as string,
        sortBy: sortBy as string,
        order: (order as SortOrder) || "desc",
      });
      res.status(200).json(finance);
    } catch (error) {
      next(error);
    }
  },
  async getAllPrinterPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);

      const { page, limit, search } = req.query;

      const { sortBy, order } = parseSortParams(
        req.query.sortBy as string,
        req.query.order as string,
        FINANCE_SORT_FIELDS,
        "created_at"
      );

      const finance = await FinanceService.getAllPaymentToPrinter({
        page: Number(page),
        limit: Number(limit),
        filters: {}, //todo: add filters
        search: search as string,
        sortBy: sortBy as string,
        order: (order as SortOrder) || "desc",
      });
      res.status(200).json(finance);
    } catch (error) {
      next(error);
    }
  },
};
