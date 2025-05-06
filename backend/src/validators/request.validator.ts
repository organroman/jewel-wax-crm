import { z } from "zod";

import { REQUEST_SOURCE, REQUEST_STATUS } from "../constants/enums";
import VALIDATION_MESSAGES from "../constants/validation-messages";

const sourceEnum = z.enum(REQUEST_SOURCE);
const statusEnum = z.enum(REQUEST_STATUS);

export const createRequestSchema = z.object({
  message: z.string().min(1),
  source: sourceEnum,
  contact_id: z.number().optional(),
  status: statusEnum.optional(),
});

export const updateRequestSchema = createRequestSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: VALIDATION_MESSAGES.FIELD_REQUIRED,
  });
