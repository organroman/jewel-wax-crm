import {
  createCitySchema,
  createCountrySchema,
} from "@/validators/location.validator";
import { z } from "zod";

export interface Country {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  country_id: number;
}

export type CreateCitySchema = z.infer<typeof createCitySchema>;
export type CreateCountrySchema = z.infer<typeof createCountrySchema>;
