import { Request, Response, NextFunction } from "express";
import { StatisticService } from "../services/statistic-service";

export const StatisticController = {
  async getStatistic(req: Request, res: Response, next: NextFunction) {
    try {
      const { from, to, customer_id, performer_id } = req.query;

      const statistic = await StatisticService.getStatistic({
        from: from as string,
        to: to as string,
        customer_id: Number(customer_id),
        performer_id: Number(performer_id),
      });

      res.status(200).json(statistic);
    } catch (error) {
      next(error);
    }
  },
};
