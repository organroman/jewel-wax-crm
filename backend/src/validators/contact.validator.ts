import { CONTACT_SOURCE } from "../constants/enums";
import { z } from "zod";

const sourceEnum = z.enum(CONTACT_SOURCE);

export const createContactSchema = z.object({
  source: sourceEnum,
  external_id: z.string(),
  username: z.string().min(2).optional(),
  full_name: z.string().min(2).optional(),
  phone: z.string().min(2).optional(),
  person_id: z.number().optional(),
});

export const updateContactSchema = z.object({
  username: z.string().min(2).optional(),
  full_name: z.string().min(2).optional(),
  phone: z.string().min(2).optional(),
});
