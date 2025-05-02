import db from "../db/db";

import {
  CreateUserInput,
  SafeUser,
  UpdateUserInput,
} from "../types/user.types";

export const UserModel = {
  async getAll(): Promise<SafeUser[]> {
    return await db("users").select([
      "id",
      "full_name",
      "email",
      "role",
      "is_active",
      "created_at",
    ]);
  },

  async findById(userId: number): Promise<SafeUser | null> {
    const [user] = await db("users")
      .where("id", userId)
      .select(["id", "full_name", "email", "role", "is_active", "created_at"]);
    return user || null;
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

  async update(userId: number, user: UpdateUserInput): Promise<SafeUser> {
    const [updatedUser] = await db("users")
      .where("id", userId)
      .update({ ...user, updated_at: new Date() })
      .returning<SafeUser[]>([
        "id",
        "full_name",
        "email",
        "role",
        "is_active",
        "created_at",
      ]);

    return updatedUser || null;
  },
  async delete(userId: number): Promise<number> {
    return await db("users").where("id", userId).del();
  },
};
