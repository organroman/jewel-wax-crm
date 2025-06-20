import { z } from "zod";

import { ORDER_STAGE, ORDER_STAGE_STATUS } from "../constants/enums";
import ERROR_MESSAGES from "../constants/error-messages";

export const toggleIsImportantSchema = z.object({
  is_important: z.boolean(),
});
const stageEnum = z.enum(ORDER_STAGE);
const stageStatusEnum = z.enum(ORDER_STAGE_STATUS);

const personSchema = z.object({
  id: z.number(),
  fullname: z.string(),
});

const customerDeliverySchema = z.object({
  delivery_address_id: z.number(),
  address_line: z.string(),
});

const customerSchema = z.object({
  id: z.number(),
  fullname: z.string(),
  delivery_addresses: z.array(customerDeliverySchema).optional(),
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
  order_id: z.number().optional(),
  delivery_address_id: z.number({
    message: ERROR_MESSAGES.DELIVERY_ADDRESS_REQUIRED,
  }),
  delivery_service: z.string().optional(),
  cost: z.number().default(0.0),
  declaration_number: z.number().optional().nullable(),
  address_line: z.string().optional(),
});

const baseSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  amount: z.number(),
  notes: z.string().optional(),
  modeling_cost: z.number().optional(),
  milling_cost: z.number().optional(),
  printing_cost: z.number().optional(),
  modeller: personSchema.optional().nullable(),
  miller: personSchema.optional().nullable(),
  printer: personSchema.optional().nullable(),
  customer: customerSchema,
  stages: z.array(stageSchema),
  delivery: deliverySchema.optional().nullable(),
});

export const updateOrderSchema = baseSchema.partial();
