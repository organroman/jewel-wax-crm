import { PersonRole } from "../types/person.types";
import { ExpenseCategory } from "../types/finance.type";

import { Request, Response, NextFunction } from "express";

import { ReportService } from "../services/report-service";

import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";

export const ReportController = {
  async getClientsReport(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);

      const { page, limit, person_id, from, to } = req.query;

      const clients = await ReportService.getClientsReport({
        page: Number(page),
        limit: Number(limit),
        filters: {
          person_id: Number(person_id),
          from: from as string,
          to: to as string,
        },
      });
      res.status(200).json(clients);
    } catch (error) {
      next(error);
    }
  },
  async getModelingReport(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const role = req.user?.role;

      if (!userId) throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);

      const { page, limit, person_id, from, to } = req.query;

      const orders = await ReportService.getModellingReport({
        page: Number(page),
        limit: Number(limit),
        filters: {
          person_id: Number(person_id),
          from: from as string,
          to: to as string,
        },
        user_id: Number(userId),
        user_role: role as PersonRole,
      });
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  },
  async getExpensesReport(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);

      const { page, limit, expenses_category, from, to } = req.query;

      const expenses = await ReportService.getExpensesReport({
        page: Number(page),
        limit: Number(limit),
        filters: {
          expense_category: expenses_category as ExpenseCategory,
          from: from as string,
          to: to as string,
        },
      });
      res.status(200).json(expenses);
    } catch (error) {
      next(error);
    }
  },
};
