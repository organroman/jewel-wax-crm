import jwt from "jsonwebtoken";
import { PersonModel } from "../models/person/person-model";
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
    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(token, secret) as JwtPayload;
    } catch (err) {
      return next(new Error("Unauthorized: Invalid or expired token"));
    }

    const user = await PersonModel.findById(+decoded.id);
    if (!user) {
      return next(new Error(ERROR_MESSAGES.UNAUTHORIZED));
    }

    socket.data.user = {
      id: decoded.id,
      role: decoded.role,
    };

    return next();
  } catch (err) {
    // fallback (дуже рідко сюди дійде, але хай буде)
    return next(new Error("Internal authentication error"));
  }
}
