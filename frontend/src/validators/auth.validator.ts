import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ message: "messages.validation.required" })
    .email("messages.validation.invalid_email"),
  password: z.string().min(6, "messages.validation.min_six_characters"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ message: "messages.validation.required" })
      .min(6, "messages.validation.min_six_characters"),
    newPassword: z
      .string({ message: "messages.validation.required" })
      .min(6, "messages.validation.min_six_characters"),
    confirmPassword: z
      .string({ message: "messages.validation.required" })
      .min(6, "messages.validation.min_six_characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "messages.validation.passwords_must_match",
    path: ["confirmPassword"],
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: "messages.validation.password_same_as_current",
    path: ["newPassword"],
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
