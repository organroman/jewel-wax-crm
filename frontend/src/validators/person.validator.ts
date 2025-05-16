import { PersonRoleValue } from "@/types/person.types";
import { VALIDATION_MESSAGES } from "@/constants/validation-messages.constants";
import { z } from "zod";
import { CHANEL_SOURCE, PERSON_ROLE_VALUES } from "@/constants/enums.constants";

const locationSchema = z.object({
  city_id: z.number(),
  city_name: z.string().min(2, VALIDATION_MESSAGES.MIN_TWO_CHARACTERS),
  country_id: z.number(),
  country_name: z.string().min(2, VALIDATION_MESSAGES.MIN_TWO_CHARACTERS),
  is_main: z.boolean(),
  id: z.number().optional(),
});

const phoneSchema = z.object({
  id: z.number().optional(),
  person_id: z.number().optional(),
  number: z.string().min(5, VALIDATION_MESSAGES.INVALID_PHONE),
  is_main: z.boolean(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

const emailSchema = z.object({
  id: z.number().optional(),
  person_id: z.number(),
  email: z.string().email(VALIDATION_MESSAGES.INVALID_EMAIL),
  is_main: z.boolean(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

const deliveryAddressSchema = z.object({
  id: z.number().optional(),
  is_main: z.boolean(),
  address_line: z.string().min(3, VALIDATION_MESSAGES.MIN_THREE_CHARACTERS),
});

const roleSchema = z.object({
  value: z.enum(PERSON_ROLE_VALUES),
  label: z.string(),
});

const personContactSchema = z.object({
  id: z.number(),
  source: z.enum(CHANEL_SOURCE),
  external_id: z.string(),
  username: z.string().optional(),
  full_name: z.string().optional(),
  phone: z.string().optional(),
  person_id: z.number().optional(),
  avatar_url: z.string().optional(),
});

const bankDetailsSchema = z.object({
  id: z.number().optional(),
  person_id: z.number().optional(),
  bank_name: z.string().optional(),
  bank_code: z.string().optional(),
  tax_id: z.string().optional(),
  iban: z.string().optional(),
  card_number: z.string().optional(),
  is_main: z.boolean(),
  created_at: z.date().optional(),
});

export const updatePersonSchema = z.object({
  id: z.number().optional(),
  first_name: z.string().min(2, VALIDATION_MESSAGES.MIN_TWO_CHARACTERS),
  last_name: z.string().min(2, VALIDATION_MESSAGES.MIN_TWO_CHARACTERS),
  patronymic: z.string().optional(),
  role: roleSchema,
  is_active: z.boolean(),
  phones: z
    .array(phoneSchema)
    .min(1, VALIDATION_MESSAGES.MIN_ONE_PHONE)
    .refine((phones) => phones.some((p) => p.is_main), {
      message: VALIDATION_MESSAGES.MIN_ONE_MAIN_PHONE,
    }),
  emails: z
    .array(emailSchema)
    .optional()
    .refine(
      (emails) =>
        !emails || emails.length === 0 || emails.some((e) => e.is_main),
      {
        message: VALIDATION_MESSAGES.MIN_ONE_MAIN_EMAIL,
      }
    ),

  locations: z
    .array(locationSchema)
    .optional()
    .refine((locations) => !locations || locations.some((l) => l.is_main), {
      message: VALIDATION_MESSAGES.MIN_ONE_MAIN_LOCATION,
    }),

  delivery_addresses: z
    .array(deliveryAddressSchema)
    .optional()
    .refine((address) => !address || address.some((a) => a.is_main), {
      message: VALIDATION_MESSAGES.MIN_ONE_MAIN_DELIVERY_ADDRESS,
    }),
  contacts: z.array(personContactSchema).optional(),
  bank_details: z.array(bankDetailsSchema).optional(),
  // password: z.string().min(6).optional(),
});

export const createPersonSchema = updatePersonSchema.extend({
  password: z.string().min(6, VALIDATION_MESSAGES.MIN_SIX_CHARACTERS),
});
