import { PERSON_ROLE_VALUES } from "@/constants/enums.constants";
import { PERSON_SORT_FIELDS } from "@/constants/sortable-fields";
import { ChanelSource, GetAllOptions } from "./shared.types";
import { Contact } from "./contact.types";
import { z } from "zod";
import {
  createPersonSchema,
  updatePersonSchema,
} from "@/validators/person.validator";

export type PersonRoleValue = (typeof PERSON_ROLE_VALUES)[number];

export type PersonRole = {
  value: PersonRoleValue;
  label: string;
  type?: string
};

export type PersonSortField = (typeof PERSON_SORT_FIELDS)[number];

export interface PersonContact
  extends Omit<Contact, "created_at" | "updated_at"> {}

export interface PersonMessenger {
  id: number;
  phone_id: number;
  person_id: number;
  platform: ChanelSource;
}
export interface BankDetails {
  id?: number;
  person_id?: number;
  bank_name?: string;
  bank_code?: string;
  tax_id?: string;
  iban?: string;
  card_number?: string;
  is_main: boolean;
  created_at?: Date;
}
export interface DeliveryAddress {
  id?: number;
  is_main: boolean;
  address_line: string;
}

export interface Location {
  city_id: number;
  city_name: string;
  country_id: number;
  country_name: string;
  is_main: boolean;
  id?: number;
}

export interface Phone {
  id?: number;
  person_id?: number;
  number: string;
  is_main: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface Email {
  id?: number;
  person_id: number;
  email: string;
  is_main: boolean;
  created_at?: Date;
  updated_at?: Date;
}
export interface Person {
  id?: number;
  role: PersonRole;
  first_name: string;
  last_name: string;
  patronymic?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
  emails?: Email[];
  phones: Phone[];
  locations?: Location[];
  delivery_addresses?: DeliveryAddress[];
  contacts?: PersonContact[];
  messengers?: PersonMessenger[];
  bank_details?: BankDetails[];
}

export type UpdatePersonSchema = z.infer<typeof updatePersonSchema>;
export type CreatePersonSchema = z.infer<typeof createPersonSchema>;

export type GetAllPersonsOptions = GetAllOptions<{
  role?: string;
  city?: string;
  is_active?: boolean;
}>;
