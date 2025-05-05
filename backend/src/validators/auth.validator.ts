import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const refreshTokenSchema = z.object({
  token: z.string().min(10),
});

export const emailSchema = z.object({
    email: z.string().email() 
})

export const resetPasswordSchema = z.object({
    token: z.string().min(10),
    new_password: z.string().min(6)
})