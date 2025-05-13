import { PERSON_SORT_FIELDS } from "../constants/sortable-fields";
import { PERSON_ROLES } from "../constants/enums";
import { GetAllOptions } from "./shared.types";
import { Contact, ContactSource } from "./contact.types";

export type PersonRole = (typeof PERSON_ROLES)[number];
export interface EnrichedRole {
  type: PersonRole;
  label: string;
}

export type PersonSortField = (typeof PERSON_SORT_FIELDS)[number];

export interface Country {
  id: number;
  name: string;
}

export interface City {
  id: number;
  country_id: number;
  name: string;
}

export interface PersonContact
  extends Omit<Contact, "created_at" | "updated_at"> {}

export interface PersonMessenger {
  id: number;
  person_id: number;
  platform: ContactSource;
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
  address_line: string;
}

export interface Location {
  country: Country;
  city: City;
  is_main: boolean;
  id: number;
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
  id: number;
  role: PersonRole;
  first_name: string;
  last_name: string;
  patronymic?: string;
  avatar_url?: string;
  password?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  emails?: Email[];
  phones: Phone[];
  locations?: Location[];
  delivery_addresses?: DeliveryAddress[];
  contacts?: PersonContact[];
  messengers?: PersonMessenger[];
  bank_details?: BankDetails[];
}

export interface CreatePersonInput {
  first_name: string;
  last_name: string;
  patronymic?: string;
  emails?: Email[];
  locations?: Location[];
  role: PersonRole;
  password?: string;
  phones: Phone[];
  delivery_addresses?: DeliveryAddress[];
  contacts?: Contact[];
  bank_details?: BankDetails[];
}

const omitPersonFields = ["role", "password"];
export interface UpdatePersonInput extends Partial<CreatePersonInput> {}

export interface SafePerson extends Omit<Person, "password" | "role"> {}
export interface SafePersonWithRole extends SafePerson {
  role: EnrichedRole;
}

export type GetAllPersonsOptions = GetAllOptions<{
  role?: string;
  city?: string;
  is_active?: boolean;
}>;
