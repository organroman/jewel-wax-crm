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

router.get(
  "/invoices/:orderId",
  verifyToken,
  checkPermission("INVOICES", "VIEW"),
  FinanceController.getInvoicesByOrderId
);

export default router;
