import { Router } from "express";

import { verifyToken } from "../middlewares/auth-middleware";
import { isChatParticipant } from "../middlewares/is-chat-participant-middleware";
import { OrderChatController } from "../controllers/order-chat-controller";
import { checkPermission } from "../middlewares/permission-middleware";

const router = Router();

router.get(
  "/:chatId/messages",
  verifyToken,
  isChatParticipant,
  OrderChatController.getLatestMessages
);

router.get(
  "/:chatId/details",
  verifyToken,
  isChatParticipant,
  OrderChatController.getChatDetails
);

router.post(
  "/:chatId/messages",
  verifyToken,
  isChatParticipant,
  OrderChatController.sendMessage
);
router.delete(
  "/:chatId",
  verifyToken,
  checkPermission("CHAT", "DELETE"),
  OrderChatController.deleteChat
);

export default router;
