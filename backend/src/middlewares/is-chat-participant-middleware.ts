import { Request, Response, NextFunction } from "express";
import db from "../db/db";
import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";
import { OrderBase } from "../types/order.types";

export async function isChatParticipant(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;
    const chatId = req.params.chatId || req.body.chatId || req.query.chatId;

    if (!user) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 403);
    }

    if (!chatId) {
      throw new AppError(ERROR_MESSAGES.CHAT_ID_REQUIRED, 400);
    }

    if (user.role === "super_admin") {
      next();
      return;
    }

    const chat = await db("order_chats").where("id", chatId).first();
    if (!chat) {

      throw new AppError(ERROR_MESSAGES.CHAT_NOT_FOUND, 404);
    }

    const order = await db<OrderBase>("orders")
      .where("id", chat.order_id)
      .first();

    if (!order) {
      throw new AppError(ERROR_MESSAGES.ORDER_NOT_FOUND, 404);
    }

    let performerId: number | null;

    switch (chat.type) {
      case "modeller":
      default:
        performerId = order.modeller_id;
        break;

      // Future cases
      // case "miller":
      //   performerId = order.miller_id;
      //   break;
      // case "printer":
      //   performerId = order.printer_id;
      //   break;
    }

    if (user.id !== performerId) {
      throw new AppError(ERROR_MESSAGES.FORBIDDEN, 403);
    }

    return next();
  } catch (error) {
    next(new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401));
  }
}
