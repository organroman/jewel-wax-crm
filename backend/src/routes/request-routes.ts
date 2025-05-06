import { Router } from "express";
import { verifyToken } from "../middlewares/auth-middleware";
import { checkPermission } from "../middlewares/permission-middleware";

import { RequestController } from "../controllers/request-controller";
import { validateBody } from "../middlewares/validation-middleware";
import {
  createRequestSchema,
  updateRequestSchema,
} from "../validators/request.validator";

const router = Router();

router.get(
  "/",
  verifyToken,
  checkPermission("REQUESTS", "VIEW"),
  RequestController.getAll
);

router.get(
  "/:id",
  verifyToken,
  checkPermission("REQUESTS", "VIEW"),
  RequestController.getById
);

router.post(
  "/",
  verifyToken,
  checkPermission("REQUESTS", "CREATE"),
  validateBody(createRequestSchema),
  RequestController.create
);

router.patch(
  "/:id",
  verifyToken,
  checkPermission("REQUESTS", "UPDATE"),
  validateBody(updateRequestSchema),
  RequestController.update
);

router.patch(
  "/:id",
  verifyToken,
  checkPermission("REQUESTS", "DELETE"),
  RequestController.delete
);

export default router;
