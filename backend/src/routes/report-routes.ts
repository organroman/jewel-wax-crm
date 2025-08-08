import { Router } from "express";
import { verifyToken } from "../middlewares/auth-middleware";
import { checkPermission } from "../middlewares/permission-middleware";
import { ReportController } from "../controllers/report-controller";

const router = Router();

router.get(
  "/clients",
  verifyToken,
  checkPermission("CLIENT_REPORT", "VIEW"),
  ReportController.getClientsReport
);

router.get(
  "/modeling",
  verifyToken,
  checkPermission("MODELING_REPORT", "VIEW"),
  ReportController.getModelingReport
);

router.get(
  "/expenses",
  verifyToken,
  checkPermission("EXPENSES_REPORT", "VIEW"),
  ReportController.getExpensesReport
);
export default router;
