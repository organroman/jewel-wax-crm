import { Router } from "express";
import { verifyToken } from "../middlewares/auth-middleware";
import { checkPermission } from "../middlewares/permission-middleware";
import { DashboardController } from "../controllers/dashboard-controller";

const router = Router();

router.get(
  "/",
  verifyToken,
  checkPermission("DASHBOARD", "VIEW"),
  DashboardController.getDashboardData
);

export default router;
