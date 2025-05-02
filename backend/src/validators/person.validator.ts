import { z } from "zod";

import { PERSON_ROLES } from "../constants/person-roles";
import VALIDATION_MESSAGES from "../constants/validation-messages";

const roleEnum = z.enum(PERSON_ROLES);

const deliveryAddressSchema = z.object({
  label: z.string().optional(),
  city: z.string().min(2, "City is required"),
  address_line: z.string().min(5, "Address line is required"),
});

export const createPersonSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email").optional(),
  phone: z.string(),
  city: z.string().optional(),
  role: roleEnum,
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  delivery_addresses: z.array(deliveryAddressSchema).optional(),
});

export const updatePersonSchema = createPersonSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: VALIDATION_MESSAGES.FIELD_REQUIRED,
  });
