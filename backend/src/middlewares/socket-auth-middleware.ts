import jwt from "jsonwebtoken";
import { PersonModel } from "../models/person-model";
import { JwtPayload } from "../types/jwt.types";
import { ExtendedError, Socket } from "socket.io";

import ERROR_MESSAGES from "../constants/error-messages";

export async function socketAuthMiddleware(
  socket: Socket,
  next: (err?: ExtendedError) => void
) {
  try {
    const token = socket.handshake.auth?.token;

    if (!token || typeof token !== "string") {
      return next(new Error(ERROR_MESSAGES.UNAUTHORIZED));
    }

    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as JwtPayload;

    const isUserExist = await PersonModel.findById(+decoded.id);
    if (!isUserExist) return next(new Error(ERROR_MESSAGES.UNAUTHORIZED));

    socket.data.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    next(new Error("Unauthorized: Invalid token"));
  }
}
