import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";

import { PersonModel } from "../models/person-model";

import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";
import { stripPassword } from "../utils/helpers";
import { SafePerson } from "../types/person.types";
import { AuthModel } from "../models/auth-model";

export const AuthService = {
  async login(email: string, password: string) {
    const jwtSecret = process.env.JWT_SECRET as string;

    const person = await PersonModel.findByEmail(email);

    if (!person) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
    }

    if (!person.password) {
      throw new AppError(ERROR_MESSAGES.ACCESS_DENIED, 403);
    }

    const isMatch = await bcryptjs.compare(password, person.password);

    if (!isMatch) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
    }

    const refreshToken = randomBytes(40).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const token = jwt.sign({ id: person.id, role: person.role }, jwtSecret, {
      expiresIn: "30d",
    });

    await AuthModel.createRefreshToken(
      person.id.toString(),
      refreshToken,
      expiresAt
    );

    return {
      token,
      refresh_token: refreshToken,
      person: stripPassword(person) as SafePerson,
    };
  },

  async refreshAccessToken(refreshToken: string) {
    const tokenRecord = await AuthModel.findValidRefreshToken(refreshToken);

    if (!tokenRecord) {
      throw new AppError(ERROR_MESSAGES.INVALID_REFRESH_TOKEN, 403);
    }

    const person = await PersonModel.findById(tokenRecord.person_id);

    if (!person) {
      throw new AppError(ERROR_MESSAGES.PERSON_NOT_FOUND, 404);
    }

    const newAccessToken = jwt.sign(
      { id: person.id, role: person.role },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    return {
      token: newAccessToken,
      person,
    };
  },
};
