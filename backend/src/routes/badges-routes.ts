import { Router } from "express";
import { verifyToken } from "../middlewares/auth-middleware";
import { BadgesController } from "../controllers/badges-controller";

const router = Router();

router.get("/unread", verifyToken, BadgesController.getUnread);

export default router;
