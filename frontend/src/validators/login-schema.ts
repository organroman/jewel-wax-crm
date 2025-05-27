import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ message: "messages.validation.required" })
    .email("messages.validation.invalid_email"),
  password: z.string().min(6, "messages.validation.min_six_characters"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
