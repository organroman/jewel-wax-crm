import { Person } from "@/types/person.types";
import apiService from "../api-service";

interface Auth {
  token: string;
  person: Person;
}

export const AuthService = {
  login: (data: { email: string; password: string }) =>
    apiService.post<Auth>("auth/login", data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiService.post<Auth>("auth/change-password", data),

  logout: () => apiService.post("auth/logout", {}),
};
