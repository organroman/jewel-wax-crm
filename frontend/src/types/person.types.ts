import { PERSON_ROLES } from "@/constants/enums";
import { PERSON_SORT_FIELDS } from "@/constants/sortable-fields";
import { GetAllOptions } from "./shared.types";


export type PersonRole = (typeof PERSON_ROLES)[number];

export type PersonSortField = (typeof PERSON_SORT_FIELDS)[number];

export interface DeliveryAddress {
  id?: number;
  address_line: string;
}

export interface Phone {
  id?: number;
  person_id?: number;
  number: string;
  is_main: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface Person {
  id: number;
  first_name: string;
  last_name: string;
  patronymic?: string;
  email?: string;
  phones: Phone[];
  role: PersonRole;
  city?: string;
  password?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  delivery_addresses?: DeliveryAddress[];
}

export interface CreatePersonInput {
  first_name: string;
  last_name: string;
  patronymic?: string;
  email?: string;
  city?: string;
  role: PersonRole;
  password?: string;
  phones: Phone[];
  delivery_addresses?: DeliveryAddress[];
}

export interface UpdatePersonInput extends Partial<CreatePersonInput> {}

export interface SafePerson {
  id: number;
  first_name: string;
  last_name: string;
  patronymic?: string;
  email?: string;
  city?: string;
  role: PersonRole;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  phones: Phone[];
  delivery_addresses?: DeliveryAddress[];
}

export type GetAllPersonsOptions = GetAllOptions<{
  role?: string;
  city?: string;
  is_active?: boolean;
}>;
