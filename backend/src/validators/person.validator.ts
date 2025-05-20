import { z } from "zod";

import { PERSON_ROLES } from "../constants/enums";
import VALIDATION_MESSAGES from "../constants/validation-messages";

const roleEnum = z.enum(PERSON_ROLES);

const phoneSchema = z.object({
  number: z.string().min(5),
  is_main: z.boolean(),
});

const deliveryAddressSchema = z.object({
  address_line: z.string().min(5, VALIDATION_MESSAGES.ADDRESS),
});

export const createPersonSchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  patronymic: z.string().optional(),
  email: z.string().email().optional(),
  city: z.string().optional(),
  role: roleEnum,
  password: z.string().min(6, VALIDATION_MESSAGES.PASSWORD).optional(),
  phones: z
    .array(phoneSchema)
    .min(1, VALIDATION_MESSAGES.MIN_ONE_PHONE)
    .refine((phones) => phones.some((p) => p.is_main), {
      message: VALIDATION_MESSAGES.MIN_ONE_MAIN_PHONE,
    }),

  delivery_addresses: z.array(deliveryAddressSchema).optional(),
});

export const updatePersonSchema = createPersonSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: VALIDATION_MESSAGES.FIELD_REQUIRED,
  });
