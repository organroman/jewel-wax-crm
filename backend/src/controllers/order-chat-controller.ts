import { Request, Response, NextFunction } from "express";
import { OrderChatService } from "../services/order-chat-service";

export const OrderChatController = {
  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.params;

      const messages = await OrderChatService.getMessages(Number(chatId));
      res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  },
  async getLatestMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.params;
      const limit = Number(req.query.limit || 50);
      const messages = await OrderChatService.getLatestMessages({
        chatId: Number(chatId),
        limit,
      });
      res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  },
  async getChatDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.params;
      const limit = Number(req.query.limit || 50);

      const chat = await OrderChatService.getChatDetails({
        chatId: Number(chatId),
        limit,
      });

      res.status(200).json(chat);
    } catch (error) {
      next(error);
    }
  },

  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.params;
      const { message, media } = req.body;
      const senderId = req.user?.id;
      const newMessage = await OrderChatService.sendMessage({
        chatId: Number(chatId),
        senderId: Number(senderId),
        media,
        message,
      });

      const io = req.app.get("io");
      io.to(chatId).emit("chat:newMessage", newMessage);

      res.status(201).json(newMessage);
    } catch (error) {
      next(error);
    }
  },

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { messageId } = req.params;
      const readerId = req.user?.id;
      await OrderChatService.markMessageAsRead(
        Number(messageId),
        Number(readerId)
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  async reactToMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { messageId } = req.params;
      const { reaction = "like", mode = "toggle" } = req.body;
      const personId = req.user?.id;

      await OrderChatService.toggleReaction({
        messageId: Number(messageId),
        personId: Number(personId),
        reaction,
        mode,
      });

      //   const io = req.app.get("io");
      //   const chatId = await OrderChatService.getChatIdByMessageId(Number(messageId));
      //   const reactions = await OrderChatService.getReactionsForMessage(
      //     messageId
      //   );
      //   io.to(chatId).emit("chat:reactionsUpdated", { messageId, reactions });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
