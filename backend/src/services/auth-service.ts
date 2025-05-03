import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import { PersonModel } from "../models/person-model";

import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";
import { stripPassword } from "../utils/helpers";
import { SafePerson } from "../types/person.types";

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


    const token = jwt.sign({ id: person.id, role: person.role }, jwtSecret, {
      expiresIn: "30d",
    });

    return {
      token,
      person: stripPassword(person) as SafePerson,
    };
  },
};
