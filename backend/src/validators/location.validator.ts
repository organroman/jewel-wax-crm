import { z } from "zod";

export const createCountrySchema = z.object({
  name: z.string(),
});

export const createCitySchema = z.object({
  name: z.string(),
  country: z.object({
    value: z.number(),
    label: z.string(),
  }),
});
