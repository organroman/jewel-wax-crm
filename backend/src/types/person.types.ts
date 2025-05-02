import { PersonRole } from "../constants/person-roles";

export interface DeliveryAddress {
  id?: number;
  address_line: string;
}

export interface Person {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  role: PersonRole;
  city?: string;
  password?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  delivery_addresses?: DeliveryAddress[];
}

export interface CreatePersonInput {
  full_name: string;
  email?: string;
  phone: string;
  city?: string;
  role: PersonRole;
  password?: string;
  delivery_addresses?: DeliveryAddress[];
}

export interface UpdatePersonInput {
  full_name?: string;
  email?: string;
  phone?: string;
  city?: string;
  role?: PersonRole;
  is_active?: boolean;
  delivery_addresses?: DeliveryAddress[];
}

export interface SafePerson {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  city?: string;
  role: PersonRole;
  is_active: boolean;
  created_at: Date;
  delivery_addresses?: DeliveryAddress[];
}
