import Router from "express";
import { EnumController } from "../controllers/enum-controller";

const router = Router();

router.get("/", EnumController.getAllEnumsGrouped);
router.get("/roles", EnumController.getUserRoles);
router.get("/request-sources", EnumController.getRequestSources);
router.get("/contact-sources", EnumController.getRequestSources);
router.get("/request-statuses", EnumController.getRequestStatuses);

export default router;
