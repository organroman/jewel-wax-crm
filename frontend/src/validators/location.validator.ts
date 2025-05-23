import { VALIDATION_MESSAGES } from "@/constants/validation-messages.constants";
import { z } from "zod";

export const createCitySchema = z.object({
  country: z.object(
    {
      value: z.number(),
      label: z.string(),
    },
    { message: VALIDATION_MESSAGES.SELECT_COUNTRY }
  ),
  name: z
    .string({ message: VALIDATION_MESSAGES.REQUIRED_NAME })
    .min(3, VALIDATION_MESSAGES.MIN_THREE_CHARACTERS),
});

export const createCountrySchema = z.object({
  name: z
    .string({ message: VALIDATION_MESSAGES.REQUIRED_NAME })
    .min(3, VALIDATION_MESSAGES.MIN_THREE_CHARACTERS),
});
