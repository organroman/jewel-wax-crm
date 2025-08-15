import { useMutation } from "@tanstack/react-query";
import { AuthService } from "./auth-service";

export const UseAuth = {
  login() {
    return useMutation({
      mutationFn: AuthService.login,
    });
  },
  changePassword() {
    return useMutation({
      mutationFn: AuthService.changePassword,
    });
  },
  logout () {
    return useMutation({
      mutationFn: AuthService.logout
    })
  }
};
