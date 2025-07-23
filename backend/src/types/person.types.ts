import { PERSON_SORT_FIELDS } from "../constants/sortable-fields";
import { DELIVERY_TYPE, PERSON_ROLES } from "../constants/enums";
import { GetAllOptions } from "./shared.types";
import { Contact, ContactSource } from "./contact.types";

export type PersonRole = (typeof PERSON_ROLES)[number];

export type DeliveryType = (typeof DELIVERY_TYPE)[number];

export type PersonSortField = (typeof PERSON_SORT_FIELDS)[number];

export interface PersonContact
  extends Omit<Contact, "created_at" | "updated_at"> {}

export interface PersonMessenger {
  id: number;
  person_id: number;
  platform: ContactSource;
}
export interface BankDetails {
  id: number;
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
  id: number;
  address_line?: string;
  type: DeliveryType;
  city_id: string;
  np_warehouse_ref: string;
  np_warehouse: string;
  np_warehouse_siteKey: string;
  street: string;
  street_ref: string;
  house_number: string;
  flat_number: string;
  is_main: boolean;
  created_at?: Date;
  updated_at?: Date;
  person_id: number | null;
  np_recipient_ref: string | null;
  np_contact_recipient_ref: string | null;
}

export interface Location {
  country_id: number;
  country_name: string;
  city_id: number;
  city_name: string;
  is_main: boolean;
  id: number;
  person_id?: number;
}

export interface Phone {
  id: number;
  person_id?: number;
  number: string;
  is_main: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface Email {
  id: number;
  person_id: number;
  email: string;
  is_main: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface PersonBase {
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

export interface UpdatePersonInput extends Partial<CreatePersonInput> {}

export interface SafePerson extends Omit<Person, "password" | "role"> {}
export interface SafePerson extends Omit<Person, "password"> {}
// export interface SafePersonWithRole extends SafePerson {
//   role: EnrichedRole;
// }

export type GetAllPersonsOptions = GetAllOptions<{
  role?: string;
  city?: number[];
  country?: number[];
  is_active?: boolean[];
}>;
