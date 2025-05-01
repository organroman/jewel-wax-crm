import db from "../db/db";

import {
  CreateUserInput,
  SafeUser,
  UpdateUserInput,
} from "../types/user.types";

export const UserModel = {
  async getAll() {
    return await db("users").select("*");
  },

  async findById(userId: string) {
    return {};
  },

  async create(user: CreateUserInput): Promise<SafeUser> {
    const [newUser] = await db("users")
      .insert(user)
      .returning<SafeUser[]>([
        "id",
        "full_name",
        "email",
        "role",
        "is_active",
        "created_at",
      ]);
    return newUser;
  },

  async update(userId: number, user: UpdateUserInput) {
    const [updatedUser] = await db("users")
      .where("id", userId)
      .update(user)
      .returning<SafeUser[]>([
        "id",
        "full_name",
        "email",
        "role",
        "is_active",
        "created_at",
      ]);

    return updatedUser;
  },
  async delete(userId: string) {},
};
