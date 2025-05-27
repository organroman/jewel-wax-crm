import Router from "express";
import { verifyToken } from "../middlewares/auth-middleware";
import { checkPermission } from "../middlewares/permission-middleware";
import { ActivityLogController } from "../controllers/activity-log-controller";

const router = Router();

router.get(
  "/",
  verifyToken,
  checkPermission("PERSONS", "VIEW"),
  ActivityLogController.getLogsByTargetAndTargetId
);

export default router;
