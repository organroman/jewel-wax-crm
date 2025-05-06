import { CONTACT_SOURCE } from "../constants/enums";
import { GetAllOptions } from "./shared.types";

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

export type GetAllContactsOptions = GetAllOptions<{
  source?: ContactSource;
}>;

export interface UpdateContactInput {
  username?: string;
  full_name?: string;
  phone?: string;
}
