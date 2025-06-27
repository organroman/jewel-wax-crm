import { PAYER_TYPE, PAYMENT_METHOD } from "@/constants/novaposhta.constants";
import { createDeclarationSchema } from "@/validators/order.validator";
import { z } from "zod";

export type PayerType = (typeof PAYER_TYPE)[number];
export type PaymentMethod = (typeof PAYMENT_METHOD)[number];
export type CargoType = {
  label: string;
  value: string;
};

export type CreateDeclarationSchema = z.infer<typeof createDeclarationSchema>;

export interface DeliveryDeclaration {
  costOnSite: string;
  estimatedDeliveryDate: string;
  number: string;
}
