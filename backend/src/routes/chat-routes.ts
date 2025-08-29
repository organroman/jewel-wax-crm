import { Router } from "express";
import { verifyToken } from "../middlewares/auth-middleware";
import { checkPermission } from "../middlewares/permission-middleware";
import { ChatController } from "../controllers/chat-controller";
import { WebhookController } from "../controllers/webhook-controller";

const router = Router();

router.get(
  "/conversations",
  verifyToken,
  checkPermission("REQUESTS", "VIEW"),
  ChatController.listConversations
);

router.get(
  "/conversations/:id/messages",
  verifyToken,
  checkPermission("REQUESTS", "VIEW"),
  ChatController.getMessages
);

router.post("/webhooks/:provider", WebhookController.handle);

export default router;
