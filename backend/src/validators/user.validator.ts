import { z } from "zod";

import { USER_ROLES } from "../constants/user-roles";
import VALIDATION_MESSAGES from "../constants/validation-messages";

export const createUserSchema = z.object({
  full_name: z.string().min(2, VALIDATION_MESSAGES.FULL_NAME),
  email: z.string().email(VALIDATION_MESSAGES.EMAIL),
  password: z.string().min(6, VALIDATION_MESSAGES.PASSWORD),
  role: z.enum(USER_ROLES),
});
