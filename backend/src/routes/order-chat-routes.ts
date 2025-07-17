import { Router } from "express";

import { verifyToken } from "../middlewares/auth-middleware";
import { isChatParticipant } from "../middlewares/is-chat-participant-middleware";
import { OrderChatController } from "../controllers/order-chat-controller";

const router = Router();

router.get(
  "/:chatId/messages",
  verifyToken,
  isChatParticipant,
  OrderChatController.getLatestMessages
);

router.post(
  "/:chatId/messages",
  verifyToken,
  isChatParticipant,
  OrderChatController.sendMessage
);

export default router;
