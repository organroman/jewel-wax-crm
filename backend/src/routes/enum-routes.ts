import Router from "express";
import { EnumController } from "../controllers/enum-controller";

const router = Router();

router.get("/roles", EnumController.getUserRoles);

export default router;
