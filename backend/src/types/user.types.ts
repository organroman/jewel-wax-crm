export type UserRole = "super_admin" | "admin" | "modeller" | "miller";

export interface User {
  id: number;
  full_name: string;
  email: string;
  password: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserInput {
  full_name: string;
  email: string;
  role: UserRole;
  password: string;
}

export interface UpdateUserInput {
  full_name?: string;
  email?: string;
  role?: UserRole;
  is_active?: boolean;
}

export interface SafeUser {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
}
