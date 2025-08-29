import { CONTACT_SOURCE } from "../constants/enums";
import { Provider } from "./chat.types";
import { GetAllOptions } from "./shared.types";

export type ContactSource = (typeof CONTACT_SOURCE)[number];

export interface Contact {
  id: number;
  source: Provider | string;
  external_id: string;
  username?: string | null;
  full_name?: string | null;
  phone?: string | null;
  person_id?: number | null;
  avatar_url?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateContactInput {
  source: ContactSource;
  external_id: string;
  username?: string | null;
  full_name?: string | null;
  phone?: string | null;
  person_id?: number | null;
}

export type GetAllContactsOptions = GetAllOptions<{
  source?: ContactSource;
}>;

export interface UpdateContactInput {
  username?: string;
  full_name?: string;
  phone?: string;
}
