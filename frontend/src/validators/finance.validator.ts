import { PAYMENT_METHOD } from "@/constants/enums.constants";
import { z } from "zod";

const costField: z.ZodType<number, z.ZodTypeDef, unknown> = z.preprocess(
  (val) => (typeof val === "string" ? parseFloat(val) : val),
  z.number()
);

const paymentMethodSchema = z.object({
  value: z.enum(PAYMENT_METHOD),
  label: z.string(),
});

export const createInvoiceSchema = z.object({
  order_id: z.number().nullable(),
  payment_method: paymentMethodSchema,
  amount: costField,
  description: z
    .string({ message: "messages.validation.required_name" })
    .optional(),
});
