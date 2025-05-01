import { CreateUserInput } from "../types/user.types";

import bcryptjs from "bcryptjs";

import { UserModel } from "../models/user-model";

export const UserService = {
  async getAllUsers() {
    return await UserModel.getAll();
  },

  async createUser(data: CreateUserInput) {
    const hashedPassword = await bcryptjs.hash(data.password, 10);
    return await UserModel.create({
      full_name: data.full_name.trim(),
      email: data.email.trim(),
      role: data.role,
      password: hashedPassword,
    });
  },
};
