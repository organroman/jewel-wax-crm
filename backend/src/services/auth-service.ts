import { Person, SafePerson } from "../types/person.types";

import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";

import { PersonModel } from "../models/person-model";
import { AuthModel } from "../models/auth-model";
import { ActivityLogModel } from "../models/activity-log-model";

import AppError from "../utils/AppError";
import { stripPassword } from "../utils/helpers";
import ERROR_MESSAGES from "../constants/error-messages";
import { LOG_ACTIONS } from "../constants/activity-log";
import { LOG_TARGETS } from "../constants/activity-log";

export const AuthService = {
  async login(email: string, password: string) {
    const jwtSecret = process.env.JWT_SECRET as string;

    const person = await PersonModel.findByEmail([email]);

    if (!person) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
    }

    if (!person.password) {
      throw new AppError(ERROR_MESSAGES.ACCESS_DENIED, 403);
    }

    if (!person.is_active) {
      throw new AppError(ERROR_MESSAGES.ACCOUNT_INACTIVE, 403);
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

    await ActivityLogModel.logAction({
      actor_id: person.id,
      action: LOG_ACTIONS.LOGIN,
      target_type: LOG_TARGETS.PERSON,
      target_id: person.id,
    });

    return {
      token,
      refresh_token: refreshToken,
      person: stripPassword(person) as SafePerson,
    };
  },

  async logout(refreshToken: string): Promise<void> {
    const tokenRecord = await AuthModel.findValidRefreshToken(refreshToken);

    if (!tokenRecord) {
      throw new AppError(ERROR_MESSAGES.INVALID_REFRESH_TOKEN, 403);
    }
    await AuthModel.invalidateRefreshToken(refreshToken);
  },

  async refreshAccessToken(
    refreshToken: string,
    opts: { rotate?: boolean } = { rotate: true }
  ) {
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

    if (!opts.rotate) {
      return {
        token: newAccessToken,
        person,
      };
    }

    const newRt = randomBytes(40).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await AuthModel.invalidateRefreshToken(refreshToken);
    await AuthModel.createRefreshToken(String(person.id), newRt, expiresAt);

    return {
      token: newAccessToken,
      refresh_token: newRt, // <-- controller will set cookie
      person,
    };
  },

  async createResetPasswordRequest(
    email: string
  ): Promise<{ reset_token: string }> {
    const person = await PersonModel.findByEmail([email]);
    if (!person) {
      throw new AppError(ERROR_MESSAGES.PERSON_NOT_FOUND, 404);
    }

    const resetToken = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    await AuthModel.createResetPasswordToken(person.id, resetToken, expiresAt);
    //TODO: send email to user with token
    return { reset_token: resetToken };
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenRecord = await AuthModel.findValidResetPasswordToken(token);
    if (!tokenRecord) {
      throw new AppError(ERROR_MESSAGES.INVALID_RESET_TOKEN, 400);
    }

    const hashedPassword = await bcryptjs.hash(String(newPassword), 10);
    await PersonModel.updatePassword(tokenRecord.person_id, hashedPassword);

    await ActivityLogModel.logAction({
      actor_id: tokenRecord.person_id,
      action: LOG_ACTIONS.PASSWORD_RESET,
      target_type: LOG_TARGETS.PERSON,
      target_id: tokenRecord.id,
    });

    await AuthModel.markResetPasswordTokenAsUsed(token);
    await AuthModel.invalidateAllTokensForUser(tokenRecord.person_id);
  },
  async changePassword(
    personId: number,
    currentPassword: string,
    newPassword: string,
    opts: { rotateTokens?: boolean } = { rotateTokens: true }
  ): Promise<{
    token: string;
    refresh_token: string;
    person: Person;
  }> {
    const jwtSecret = process.env.JWT_SECRET as string;

    if (!jwtSecret) {
      throw new AppError(ERROR_MESSAGES.MISSING_JWT_SECRET, 500);
    }

    const [person] = await PersonModel.getPersonsBaseByIds([personId]);

    if (!person) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
    }

    if (!person.password) {
      throw new AppError(ERROR_MESSAGES.ACCESS_DENIED, 403);
    }

    const ok = await bcryptjs.compare(currentPassword, person.password);

    if (!ok) {
      throw new AppError(ERROR_MESSAGES.INVALID_CURRENT_PASSWORD, 400);
    }
    const sameAsOld = await bcryptjs.compare(newPassword, person.password);
    if (sameAsOld) {
      throw new AppError(ERROR_MESSAGES.NEW_PASSWORD_SAME_AS_OLD, 400);
    }

    const hashed = await bcryptjs.hash(String(newPassword), 10);
    await PersonModel.updatePassword(person.id, hashed);

    await AuthModel.invalidateAllTokensForUser(person.id);

    await ActivityLogModel.logAction({
      actor_id: person.id,
      action: LOG_ACTIONS.PASSWORD_CHANGE,
      target_type: LOG_TARGETS.PERSON,
      target_id: person.id,
    });

    const refreshToken = randomBytes(40).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const accessToken = jwt.sign(
      { id: person.id, role: person.role },
      jwtSecret,
      { expiresIn: "30d" }
    );

    await AuthModel.createRefreshToken(
      String(person.id),
      refreshToken,
      expiresAt
    );

    return {
      token: accessToken,
      refresh_token: refreshToken,
      person: stripPassword(person) as SafePerson,
    };
  },
};
