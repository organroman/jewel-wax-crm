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

router.post(
  "/expenses",
  verifyToken,
  checkPermission("EXPENSES", "CREATE"),
  FinanceController.createExpense
);

router.get(
  "/invoices/:orderId",
  verifyToken,
  checkPermission("INVOICES", "VIEW"),
  FinanceController.getInvoicesByOrderId
);

router.get(
  "/all-finance",
  verifyToken,
  checkPermission("EXPENSES", "VIEW"),
  checkPermission("INVOICES", "VIEW"),
  FinanceController.getAllFinance
);

router.get(
  "/client-payments",
  verifyToken,
  checkPermission("INVOICES", "VIEW"),
  FinanceController.getAllClientPayments
);

router.get(
  "/modeller-payments",
  verifyToken,
  checkPermission("EXPENSES", "VIEW"),
  FinanceController.getAllModellerPayments
);

router.get(
  "/printer-payments",
  verifyToken,
  checkPermission("EXPENSES", "VIEW"),
  FinanceController.getAllPrinterPayments
);

router.get(
  "/expenses",
  verifyToken,
  checkPermission("EXPENSES", "VIEW"),
  FinanceController.getAllExpenses
);

router.get(
  "/transactions",
  verifyToken,
  checkPermission("EXPENSES", "VIEW"),
  checkPermission("INVOICES", "VIEW"),
  FinanceController.getTransactions
);

export default router;
