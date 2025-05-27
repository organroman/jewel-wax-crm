import { z } from "zod";

export const createCitySchema = z.object({
  country: z.object(
    {
      value: z.number(),
      label: z.string(),
    },
    { message: "messages.validation.required_country" }
  ),
  name: z
    .string({ message: "messages.validation.required_name" })
    .min(3, "messages.validation.min_three_characters"),
});

export const createCountrySchema = z.object({
  name: z
    .string({ message: "messages.validation.required_name" })
    .min(3, "messages.validation.min_three_characters"),
});
