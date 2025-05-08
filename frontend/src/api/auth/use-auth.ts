import { useMutation } from "@tanstack/react-query";
import { AuthService } from "./auth-service";

export const UseAuth = {
  login() {
    return useMutation({
      mutationFn: AuthService.login,
    });
  },
};
