import { Router } from "express";
import { verifyToken } from "../middlewares/auth-middleware";
import { checkPermission } from "../middlewares/permission-middleware";
import { StatisticController } from "../controllers/statistic-controller";

const router = Router();

router.get(
  "/",
  verifyToken,
  checkPermission("STATISTIC", "VIEW"),
  StatisticController.getStatistic
);

export default router;
