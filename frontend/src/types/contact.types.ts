import { ChanelSource } from "./shared.types";

export interface Contact {
  id: number;
  source: ChanelSource;
  external_id: string;
  username?: string;
  full_name?: string;
  phone?: string;
  person_id?: number;
  created_at: Date;
  updated_at: Date;
  avatar_url: string;
}
