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
export default router;
