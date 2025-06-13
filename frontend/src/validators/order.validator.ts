import z from "zod";

import { ORDER_STAGE, ORDER_STAGE_STATUS } from "@/constants/enums.constants";

const costField = z
  .union([
    z.number(),
    z.string().regex(/^\d+(\.\d+)?$/, "Must be a valid number string"),
  ])
  .transform((val) => (typeof val === "string" ? parseFloat(val) : val));

const numberField = z
  .union([z.number(), z.string().regex(/^\d+$/, "Must be a numeric string")])
  .optional()
  .nullable()
  .transform((val) => (typeof val === "string" ? val.padStart(4, "0") : val));

const orderPersonSchema = z.object({
  id: z.number(),
  fullname: z.string(),
});

const orderCustomerSchema = z.object({
  id: z.number(),
  fullname: z.string(),
  delivery_addresses: z
    .array(
      z.object({ delivery_address_id: z.number(), address_line: z.string() })
    )
    .optional(),
});

const orderDeliveryAddressSchema = z.object({
  id: z.number().optional(),
  order_id: z.number().optional(),
  delivery_address_id: z.number().optional(),
  address_line: z.string().optional(),
  cost: costField.nullable().default(0.0),
  declaration_number: z.string().optional().nullable(),
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
  created_at: z.string().optional(),
  completed_at: z.string().optional().nullable(),
});

const linkedOrderSchema = z.object({
  id: z.number().optional(),
  order_id: z.number().optional(),
  linked_order_id: z.number(),
  linked_order_number: numberField,
  comment: z.string().optional(),
  is_common_delivery: z.boolean().default(false),
});

export const updateOrderSchema = z.object({
  id: z.number().optional(),
  number: numberField,
  customer: orderCustomerSchema.nullable(),
  name: z.string(),
  processing_days: z.number().readonly().optional(),
  description: z.string().optional(),
  amount: costField,
  modeller: orderPersonSchema.nullable().optional(),
  modeling_cost: costField,
  miller: orderPersonSchema.nullable().optional(),
  milling_cost: costField,
  printer: orderPersonSchema.nullable().optional(),
  printing_cost: costField,
  delivery: orderDeliveryAddressSchema.nullable().optional(),
  notes: z.string().optional(),
  stages: z.array(orderStageSchema),
  active_stage: stageSchema,
  linked_orders: z.array(linkedOrderSchema).optional(),
});
