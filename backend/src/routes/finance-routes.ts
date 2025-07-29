import { Router } from "express";
import { verifyToken } from "../middlewares/auth-middleware";
import { checkPermission } from "../middlewares/permission-middleware";

import { FinanceController } from "../controllers/finance-controller";

const router = Router();

router.post(
  "/invoices",
  verifyToken,
  checkPermission("INVOICES", "CREATE"),
  FinanceController.createInvoice
);

export default router;
