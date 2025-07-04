import { z } from "zod";

import { ORDER_STAGE, ORDER_STAGE_STATUS } from "../constants/enums";
import ERROR_MESSAGES from "../constants/error-messages";

export const toggleIsImportantSchema = z.object({
  is_important: z.boolean(),
});
const stageEnum = z.enum(ORDER_STAGE, {
  required_error: ERROR_MESSAGES.STAGE_REQUIRED,
});
const stageStatusEnum = z.enum(ORDER_STAGE_STATUS);

const personSchema = z.object({
  id: z.number(),
  fullname: z.string(),
});

const customerSchema = z.object({
  id: z.number({ required_error: ERROR_MESSAGES.CUSTOMER_REQUIRED }),
});

const stageSchema = z.object({
  id: z.number().optional(),
  order_id: z.number().optional(),
  stage: stageEnum,
  status: stageStatusEnum.optional(),
  started_at: z.string().nullable().optional(),
  completed_at: z.string().nullable().optional(),
  created_at: z.string().optional(),
});

const deliverySchema = z.object({
  id: z.number().optional(),
  order_id: z
    .number({ message: `Order id ${ERROR_MESSAGES.NUMBER}` })
    .optional(),
  delivery_address_id: z
    .number({
      required_error: ERROR_MESSAGES.DELIVERY_ADDRESS_REQUIRED,
    })
    .nullable(),
  delivery_service: z.string().optional(),
  cost: z.number({ message: `Cost ${ERROR_MESSAGES.NUMBER}` }).default(0.0),
  declaration_number: z.string().optional().nullable(),
  address_line: z.string().optional(),
  is_third_party: z.boolean(),
});

const baseSchema = z.object({
  name: z.string({ required_error: ERROR_MESSAGES.NAME_REQUIRED }),
  description: z.string().optional(),
  amount: z.number({
    required_error: ERROR_MESSAGES.AMOUNT_REQUIRED,
    invalid_type_error: ERROR_MESSAGES.AMOUNT_SHOULD_BE_NUMBER,
  }),
  notes: z.string().optional(),
  modeling_cost: z
    .number({ message: `Modeling cost ${ERROR_MESSAGES.NUMBER}` })
    .optional(),
  milling_cost: z
    .number({ message: `Milling cost  ${ERROR_MESSAGES.NUMBER}` })
    .optional(),
  printing_cost: z
    .number({ message: `Printing cost ${ERROR_MESSAGES.NUMBER}` })
    .optional(),
  modeller: personSchema.optional().nullable(),
  miller: personSchema.optional().nullable(),
  printer: personSchema.optional().nullable(),
  customer: customerSchema,
  stages: z.array(stageSchema),
  delivery: deliverySchema.optional().nullable(),
});

export const updateOrderSchema = baseSchema.partial();
