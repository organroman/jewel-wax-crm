import Router from "express";
import { verifyToken } from "../middlewares/auth-middleware";
import { validateBody } from "../middlewares/validation-middleware";
import { checkPermission } from "../middlewares/permission-middleware";

import { OrderController } from "../controllers/order-controller";
import { updateOrderSchema } from "../validators/order.validator";

const router = Router();

router.get(
  "/",
  verifyToken,
  checkPermission("ORDERS", "VIEW"),
  OrderController.getAllOrders
);

router.get(
  "/numbers",
  verifyToken,
  checkPermission("ORDERS", "VIEW"),
  OrderController.getOrderNumbers
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

router.post(
  "/",
  verifyToken,
  checkPermission("ORDERS", "CREATE"),
  // validateBody(create),
  OrderController.create
);

router.patch(
  "/:id",
  verifyToken,
  checkPermission("ORDERS", "UPDATE"),
  validateBody(updateOrderSchema),
  OrderController.update
);

router.delete(
  "/:id",
  verifyToken,
  checkPermission("ORDERS", "DELETE"),
  OrderController.delete
);

export default router;
