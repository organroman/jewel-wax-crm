import z from "zod";

import { ORDER_STAGE, ORDER_STAGE_STATUS } from "@/constants/enums.constants";
import { PAYER_TYPE, PAYMENT_METHOD } from "@/constants/novaposhta.constants";
import { deliveryTypeSchema } from "./person.validator";

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

const phoneSchema = z.object({
  id: z.number(),
  is_main: z.boolean(),

  number: z.string(),
  person_id: z.number(),
});

const orderCustomerSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  patronymic: z.string().optional().nullable(),
  phones: z.array(phoneSchema),
  delivery_addresses: z
    .array(
      z.object({ delivery_address_id: z.number(), address_line: z.string() })
    )
    .optional(),
});

const orderDeliveryAddressSchema = z.object({
  id: z.number(),
  cost: costField,
  order_id: z.number().optional(),
  delivery_address_id: z.number().optional(),
  address_line: z.string().optional(),
  city_ref: z.string().nullable(),
  np_warehouse_ref: z.string().nullable(),
  np_warehouse: z.string().nullable(),
  np_warehouse_siteKey: z.string().nullable(),
  np_recipient_ref: z.string().nullable(),
  np_contact_recipient_ref: z.string().nullable(),
  street: z.string().nullable(),
  street_ref: z.string().nullable(),
  house_number: z.string().nullable(),
  flat_number: z.string().nullable(),
  declaration_number: z.string().nullable(),
  type: deliveryTypeSchema,
  estimated_delivery_date: z.string().nullable().optional(),
  actual_delivery_date: z.string().nullable().optional(),
  delivery_service: z.string().optional(),
  settlement_type: z.string(),
  city_name: z.string().nullable(),
  area: z.string().nullable().optional(),
  region: z.string().nullable(),
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

const orderMediaSchema = z.object({
  id: z.number().optional(),
  order_id: z.number().optional(),
  type: z.string().optional(),
  url: z.string().optional(),
  mime_type: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  public_id: z.string().optional(),
  is_main: z.boolean().default(false).optional(),
  uploaded_by: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
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
  media: z.array(orderMediaSchema),
});

const payerTypeSchema = z.enum(PAYER_TYPE);

const paymentMethodSchema = z.enum(PAYMENT_METHOD);

const cargoTypeSchema = z.object(
  { label: z.string(), value: z.string() },
  { required_error: "messages.validation.cargo_type_required" }
);

export const createDeclarationSchema = z.object({
  payerType: z.object(
    { value: payerTypeSchema, label: z.string() },
    { required_error: "messages.validation.payer_type" }
  ),
  paymentMethod: z.object(
    { value: paymentMethodSchema, label: z.string() },
    { required_error: "messages.validation.payment_method" }
  ),
  cargoType: cargoTypeSchema,
  dateTime: z.date({ required_error: "messages.validation.send_date" }),
  weight: z.string({ required_error: "messages.validation.order_weight" }),
  seatsAmount: z.string({ required_error: "messages.validation.seats_amount" }),
  description: z.string({
    required_error: "messages.validation.delivery_description",
  }),
  goodCost: z.string({ required_error: "messages.validation.good_cost" }),
  volumetricWidth: z
    .string({ required_error: "messages.validation.width_required" })
    .optional(),
  volumetricLength: z
    .string({ required_error: "messages.validation.length_required" })
    .optional(),
  volumetricHeight: z
    .string({ required_error: "messages.validation.height_required" })
    .optional(),
});
