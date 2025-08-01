import { EXPENSE_CATEGORY, PAYMENT_METHOD } from "@/constants/enums.constants";
import { z } from "zod";

const costField: z.ZodType<number, z.ZodTypeDef, unknown> = z.preprocess(
  (val) => (typeof val === "string" ? parseFloat(val) : val),
  z.number()
);

const paymentMethodSchema = z.object({
  value: z.enum(PAYMENT_METHOD),
  label: z.string(),
});
const expenseCategorySchema = z.object({
  value: z.enum(EXPENSE_CATEGORY),
  label: z.string(),
});
const minimalOrderSchema = z.object({
  id: z.number(),
  number: z.string(),
});

const minimalPersonSchema = z.object({
  id: z.number(),
  fullname: z.string().optional(),
});

const minimalInvoiceOrderSchema = z.object({
  id: z.number().optional(),
  number: z.string().optional(),
  customer: z.object({
    id: z.number().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    patronymic: z.string().optional().nullable(),
  }),
});

export const createInvoiceSchema = z.object({
  order: minimalInvoiceOrderSchema.optional(),
  payment_method: paymentMethodSchema,
  amount: costField,
  description: z
    .string({ message: "messages.validation.required_name" })
    .optional(),
});

export const createExpenseSchema = z.object({
  order: minimalOrderSchema.optional(),
  person: minimalPersonSchema.optional(),
  payment_method: paymentMethodSchema,
  category: expenseCategorySchema,
  amount: costField,
  description: z.string().optional().nullable(),
});
