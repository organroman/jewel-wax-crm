import { SafePerson } from "@/types/person.types";
import apiService from "../api-service";

export const AuthService = {
  login: (data: { email: string; password: string }) =>
    apiService.post<{
      token: string;
      refreshToken: string;
      person: SafePerson;
    }>("auth/login", data),
};
