import { PersonRoleValue } from "@/types/person.types";
import { VALIDATION_MESSAGES } from "@/constants/validation-messages.constants";
import { z } from "zod";
import { CHANEL_SOURCE, PERSON_ROLE_VALUES } from "@/constants/enums.constants";

const chanelSchema = z.enum(CHANEL_SOURCE);
const locationSchema = z.object({
  city_id: z.number().nullable().optional(),
  city_name: z.string().optional(),
  country_id: z.number().nullable().optional(),
  country_name: z.string().optional(),
  is_main: z.boolean(),
  id: z.number().optional(),
});

const locationsSchema = z
  .array(locationSchema)
  .superRefine((addresses, ctx) => {
    if (addresses.length > 0) {
      const hasMain = addresses.some((a) => a?.is_main);
      if (!hasMain) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: VALIDATION_MESSAGES.MIN_ONE_MAIN_DELIVERY_ADDRESS,
          path: [0, "country_id"],
        });
      }

      addresses.forEach((address, index) => {
        if (!address?.country_id) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [index, "country_id"],
            message: VALIDATION_MESSAGES.REQUIRED_COUNTRY,
          });
        }
      });

      addresses.forEach((address, index) => {
        if (!address?.city_name) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [index, "city_id"],
            message: VALIDATION_MESSAGES.REQUIRED_CITY,
          });
        }
      });
    }
  })
  .optional();

const messengerSchema = z.object({
  id: z.number(),
  phone_id: z.number(),
  person_id: z.number(),
  platform: chanelSchema,
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
  person_id: z.number().optional(),
  email: z
    .string({ message: VALIDATION_MESSAGES.REQUIRED_EMAIL })
    .email(VALIDATION_MESSAGES.INVALID_EMAIL),
  is_main: z.boolean(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

const emailsSchema = z
  .array(emailSchema)

  .superRefine((emails, ctx) => {
    if (emails.length > 0) {
      const hasMain = emails.some((e) => e.is_main);
      if (!hasMain) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: VALIDATION_MESSAGES.MIN_ONE_MAIN_EMAIL,
          path: [0, "email"],
        });
      }

      emails.forEach((email, index) => {
        if (!email.email) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [index, "email"],
          });
        }
      });
    }
  })
  .optional();

const deliveryAddressSchema = z.object({
  id: z.number().optional(),
  is_main: z.boolean(),
  address_line: z.string().min(3, VALIDATION_MESSAGES.MIN_THREE_CHARACTERS),
});

const deliveryAddressesSchema = z
  .array(deliveryAddressSchema)

  .superRefine((addresses, ctx) => {
    if (addresses.length > 0) {
      const hasMain = addresses.some((a) => a.is_main);
      if (!hasMain) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: VALIDATION_MESSAGES.MIN_ONE_MAIN_DELIVERY_ADDRESS,
          path: [0, "address_line"],
        });
      }

      addresses.forEach((address, index) => {
        if (!address.address_line || address.address_line.length < 3) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_small,
            minimum: 3,
            type: "string",
            inclusive: true,
            path: [index, "address_line"],
            message: VALIDATION_MESSAGES.MIN_THREE_CHARACTERS,
          });
        }
      });
    }
  })
  .optional();

const roleSchema = z.object({
  value: z.enum(PERSON_ROLE_VALUES),
  label: z.string(),
});

const personContactSchema = z.object({
  id: z.number().optional(),
  source: z.enum(CHANEL_SOURCE).optional(),
  external_id: z.string().optional(),
  username: z.string().optional(),
  full_name: z.string().optional(),
  phone: z.string().optional(),
  person_id: z.number().optional(),
  avatar_url: z.string().optional(),
});

const personContactsSchema = z
  .array(personContactSchema)
  .superRefine((contact, ctx) => {
    contact.forEach((c, index) => {
      if (!c.id && !c.full_name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [index],
          message: VALIDATION_MESSAGES.REQUIRED_CONTACT,
        });
      }
    });
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
  emails: emailsSchema,
  locations: locationsSchema,
  delivery_addresses: deliveryAddressesSchema,
  contacts: personContactsSchema,
  bank_details: z.array(bankDetailsSchema).optional(),
  messengers: z.array(messengerSchema).optional(),
});

export const createPersonSchema = updatePersonSchema
  .extend({
    password: z.string().optional(),
  })
  .refine(
    (data) => {
      const crmRoles: PersonRoleValue[] = ["super_admin", "miller", "modeller"];
      const requiresPassword = crmRoles.includes(data.role.value);
      return requiresPassword ? !!data.password : true;
    },
    {
      message: VALIDATION_MESSAGES.PASSWORD_REQUIRED,
      path: ["password"],
    }
  );
