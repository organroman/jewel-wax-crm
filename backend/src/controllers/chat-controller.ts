import { NextFunction, Request, Response } from "express";
import { ConversationStatus } from "../types/chat.types";

import { ChatService } from "../services/chat-service";

export const ChatController = {
  async listConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, channel_id, limit = 50, offset = 0 } = req.query;
      const data = await ChatService.listConversations({
        status: status as ConversationStatus,
        channel_id: channel_id ? Number(channel_id) : undefined,
        limit: Number(limit),
        offset: Number(offset),
      });

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },
  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { limit = 100, before } = req.query;

      const data = await ChatService.getMessages(
        Number(id),
        Number(limit),
        before as string
      );

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },
};
