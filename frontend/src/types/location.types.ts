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
  country_id?: number;
  name: string;
  ref: string;
  area_ref: string;
  area: string;
  settlementType_ref: string;
  settlementType: string;
}

export interface Street {
  street: string;
  street_ref: string;
}

export interface Warehouse {
  np_warehouse_ref: string;
  np_warehouse: string;
  np_warehouse_siteKey: string;
}

export type CreateCitySchema = z.infer<typeof createCitySchema>;
export type CreateCountrySchema = z.infer<typeof createCountrySchema>;
