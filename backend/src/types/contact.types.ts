import { CONTACT_SOURCE } from "../constants/enums";

export type ContactSource = (typeof CONTACT_SOURCE)[number];

export interface Contact {
  id: number;
  source: ContactSource;
  external_id: string;
  username?: string;
  full_name?: string;
  phone?: string;
  person_id?: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateContactInput {
  source: ContactSource;
  external_id: string;
  username?: string;
  full_name?: string;
  phone?: string;
  person_id?: number;
}

export interface GetAllContactsOptions {
  page?: number;
  limit?: number;
  filters?: {
    source?: ContactSource;
  };
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface UpdateContactInput {
  username?: string;
  full_name?: string;
  phone?: string;
}
