import { ExpenseCategory } from "../types/finance.type";
import { FinanceReportDataType } from "../types/report.types";
import { StageStatus } from "../types/order.types";

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

      const data = await ReportService.getOrdersReport({
        page: Number(page),
        limit: Number(limit),
        filters: {
          person_id: Number(person_id),
          from: from as string,
          to: to as string,
        },
      });
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },
  async getOrdersReport(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);

      const { page, limit, active_stage_status, from, to } = req.query;

      const clients = await ReportService.getOrdersReport({
        page: Number(page),
        limit: Number(limit),
        filters: {
          active_stage_status: active_stage_status as StageStatus,
          from: from as string,
          to: to as string,
        },
      });
      res.status(200).json(clients);
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
  async getFinanceReport(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);

      const { page, limit, data_type, from, to } = req.query;

      const expenses = await ReportService.getFinanceReport({
        page: Number(page),
        limit: Number(limit),
        filters: {
          data_type: data_type as FinanceReportDataType,
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
