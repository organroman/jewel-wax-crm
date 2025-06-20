import { z } from "zod";

import { PersonRole } from "../types/person.types";

import { DELIVERY_TYPE, PERSON_ROLES } from "../constants/enums";
import VALIDATION_MESSAGES from "../constants/validation-messages";

const roleEnum = z.enum(PERSON_ROLES);
const deliveryTypeSchema = z.enum(DELIVERY_TYPE);

const phoneSchema = z.object({
  number: z.string().min(5),
  is_main: z.boolean(),
});

const deliveryAddressSchema = z.object({
  id: z.number().optional(),
  is_main: z.boolean(),
  type: deliveryTypeSchema,
  np_city_ref: z.string({ required_error: "City is required" }).min(1),
  np_warehouse_ref: z.string().optional().nullable(),
  np_warehouse: z.string().optional().nullable(),
  np_warehouse_siteKey: z.string().optional().nullable(),
  street: z.string().optional().nullable(),
  street_ref: z.string().optional().nullable(),
  house_number: z.string().optional().nullable(),
  flat_number: z.string().optional().nullable(),
});

const deliveryAddressesSchema = z
  .array(deliveryAddressSchema)

  .superRefine((addresses, ctx) => {
    if (addresses.length > 0) {
      addresses.forEach((address, index) => {
        if (address.type === "warehouse") {
          if (!address.np_warehouse_ref) {
            ctx.addIssue({
              path: [index, "np_warehouse_ref"],
              code: z.ZodIssueCode.custom,
              message: VALIDATION_MESSAGES.WAREHOUSE_REQUIRED,
            });
          }
        }

        if (address.type === "door") {
          if (!address.street_ref || !address.house_number) {
            if (!address.street_ref) {
              ctx.addIssue({
                path: [index, "street"],
                code: z.ZodIssueCode.custom,
                message: VALIDATION_MESSAGES.STREET_REQUIRED,
              });
            }

            if (!address.house_number) {
              ctx.addIssue({
                path: [index, "house_number"],
                code: z.ZodIssueCode.custom,
                message: VALIDATION_MESSAGES.HOUSE_REQUIRED,
              });
            }
          }
        }
      });
    }
  })
  .optional();

const baseSchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  patronymic: z.string().optional(),
  email: z.string().email().optional(),
  city: z.string().optional(),
  role: roleEnum,
  password: z.string().optional(),
  phones: z
    .array(phoneSchema)
    .min(1, VALIDATION_MESSAGES.MIN_ONE_PHONE)
    .refine((phones) => phones.some((p) => p.is_main), {
      message: VALIDATION_MESSAGES.MIN_ONE_MAIN_PHONE,
    }),
  delivery_addresses: deliveryAddressesSchema,
});

export const createPersonSchema = baseSchema.refine(
  (data) => {
    const crmRoles: PersonRole[] = ["super_admin", "miller", "modeller"];
    return !crmRoles.includes(data.role) || !!data.password;
  },
  {
    path: ["password"],
    message: "Пароль обов'язковий для цієї ролі",
  }
);

export const updatePersonSchema = baseSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: VALIDATION_MESSAGES.FIELD_REQUIRED,
  });
