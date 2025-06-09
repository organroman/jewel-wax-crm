import Router from "express";
import { verifyToken } from "../middlewares/auth-middleware";
import { validateBody } from "../middlewares/validation-middleware";
import { checkPermission } from "../middlewares/permission-middleware";

import { OrderController } from "../controllers/order-controller";
import { toggleIsImportantSchema } from "../validators/order.validator";

const router = Router();

router.get(
  "/",
  verifyToken,
  checkPermission("ORDERS", "VIEW"),
  OrderController.getAllOrders
);

router.get(
  "/:id",
  verifyToken,
  checkPermission("ORDERS", "VIEW"),
  OrderController.getById
);

router.post(
  "/:id/favorite",
  verifyToken,
  checkPermission("ORDERS", "UPDATE"),
  OrderController.toggleFavorite
);

router.patch(
  "/:id/important",
  verifyToken,
  checkPermission("ORDERS", "UPDATE"),
  OrderController.toggleImportant
);

export default router;
