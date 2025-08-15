import {
  ALLOWED_ROLES_FOR_CRM_USER,
  DELIVERY_TYPE,
  PERSON_ROLE_VALUES,
} from "@/constants/enums.constants";
import { PERSON_SORT_FIELDS } from "@/constants/sortable-fields";
import { ChanelSource, GetAllOptions } from "./shared.types";
import { Contact } from "./contact.types";
import { z } from "zod";
import {
  createPersonSchema,
  updatePersonSchema,
} from "@/validators/person.validator";

export type PersonRoleValue = (typeof PERSON_ROLE_VALUES)[number];
export type DeliveryType = (typeof DELIVERY_TYPE)[number];

export type AllowedRolesForCrmUser =
  (typeof ALLOWED_ROLES_FOR_CRM_USER)[number];

export type PersonRole = {
  value: PersonRoleValue;
  label: string;
  type?: string;
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
  created_at?: string;
}
export interface DeliveryAddress {
  id?: number;
  is_main: boolean;
  // address_line: string; TODO: DELETE
  type: DeliveryType;
  street?: string;
  street_ref?: string;
  city_id?: number;
  np_warehouse_ref?: string;
  np_warehouse?: string;
  np_warehouse_siteKey?: string;
  house_number?: string;
  flat_number?: string;
}

export interface Location {
  city_id: number;
  city_name: string;
  country_id: number;
  country_name: string;
  is_main: boolean;
  id: number;
}

export interface Phone {
  id?: number;
  person_id?: number;
  number: string;
  is_main: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Email {
  id?: number;
  person_id: number;
  email: string;
  is_main: boolean;
  created_at?: string;
  updated_at?: string;
}
export interface Person {
  id: number;
  role: PersonRoleValue;
  first_name: string;
  last_name: string;
  patronymic: string;
  avatar_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  emails: Email[];
  phones: Phone[];
  locations: Location[];
  delivery_addresses: DeliveryAddress[];
  contacts: PersonContact[];
  messengers: PersonMessenger[];
  bank_details: BankDetails[];
}

export interface PersonCreateInput {
  role: PersonRole;
  first_name: string;
  last_name: string;
  patronymic?: string;
  is_active: boolean;
  phones: Phone[];
  emails: Email[];
  locations: Location[];
  delivery_addresses: DeliveryAddress[];
  contacts: PersonContact[];
  bank_details: BankDetails[];
  messengers: PersonMessenger[];
  password?: string;
}

export type UpdatePersonSchema = z.infer<typeof updatePersonSchema>;
export type CreatePersonSchema = z.infer<typeof createPersonSchema>;

export type GetAllPersonsOptions = GetAllOptions<{
  role?: string;
  city?: string;
  is_active?: boolean;
}>;

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  patronymic?: string;
  location?: Location | null;
  phone?: Phone | null;
  email?: Email | null;
  avatar_url: string | null;
}
