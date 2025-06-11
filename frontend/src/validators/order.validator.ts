import z from "zod";

import { ORDER_STAGE, ORDER_STAGE_STATUS } from "@/constants/enums.constants";

const orderPersonSchema = z.object({
  id: z.number(),
  fullname: z.string(),
});

const orderCustomerSchema = z.object({
  id: z.number(),
  fullname: z.string(),
  delivery_addresses: z.array(
    z.object({ delivery_address_id: z.number(), address_line: z.string() })
  ),
});

const orderDeliveryAddressSchema = z.object({
  id: z.number(),
  order_id: z.number().optional(),
  address_delivery_id: z.number(),
  address_line: z.string(),
  cost: z.number().optional(),
  declaration_number: z.number().optional().nullable(),
});

const stageSchema = z.enum(ORDER_STAGE);
const stageStatusSchema = z
  .object({
    value: z.enum(ORDER_STAGE_STATUS),
    label: z.string(),
  })
  .optional();

const orderStageSchema = z.object({
  id: z.number().optional(),
  order_id: z.number().optional(),
  stage: stageSchema,
  status: stageStatusSchema,
  started_at: z.string().optional(),
  created_at: z.string(),
  completed_at: z.string().optional().nullable(),
});

export const updateOrderSchema = z.object({
  id: z.number().optional(),
  number: z.number().nullable(),
  customer: orderCustomerSchema,
  name: z.string(),
  processing_days: z.number().readonly().optional(),
  description: z.string().optional(),
  amount: z.number(),
  modeller: orderPersonSchema.nullable().optional(),
  modeling_cost: z.number().optional().default(0.0),
  miller: orderPersonSchema.nullable().optional(),
  milling_cost: z.number().optional().default(0.0),
  printer: orderPersonSchema.nullable().optional(),
  printing_cost: z.number().optional().default(0.0),
  delivery: orderDeliveryAddressSchema.nullable(),
  delivery_cost: z.number().optional().default(0.0),
  declaration_number: z.number().optional().nullable(),
  notes: z.string().optional(),
  stages: z.array(orderStageSchema),
});
