import { Request, Response, NextFunction } from "express";

import { ChatService } from "../services/chat-service";

import ERROR_MESSAGES from "../constants/error-messages";
import AppError from "../utils/AppError";

export const WebhookController = {
  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { provider } = req.params;
      const adapter = req.app.locals.adapters?.[provider];

      if (!adapter) {
        throw new AppError(ERROR_MESSAGES.UNKNOWN_PROVIDER, 404);
      }

      if (provider === "telegram") {
        const secret = req.get("X-Telegram-Bot-Api-Secret-Token");
        if (secret !== process.env.TG_SECRET) res.sendStatus(403);
      }
      const events = await adapter.parseWebhook(req);

      await ChatService.ingestInboundEvents(events);
      res.status(200).send("ok");
    } catch (error) {
      next(error);
    }
  },
};
