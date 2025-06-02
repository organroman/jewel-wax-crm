import Router from "express";
import { verifyToken } from "../middlewares/auth-middleware";
import { checkPermission } from "../middlewares/permission-middleware";
import { OrderController } from "../controllers/order-controller";

const router = Router();

router.get(
  "/",
  verifyToken,
  checkPermission("ORDERS", "VIEW"),
  OrderController.getAllOrders
);

export default router;
