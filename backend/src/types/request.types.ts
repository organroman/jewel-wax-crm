import { REQUEST_STATUS, REQUEST_SOURCE } from "../constants/enums";
import { GetAllOptions } from "./shared.types";

export type RequestSource = (typeof REQUEST_SOURCE)[number];
export type RequestStatus = (typeof REQUEST_STATUS)[number];

export type GetAllRequestOptions = GetAllOptions<{
  source?: RequestSource;
  status?: RequestStatus;
}>;

export interface Request {
  id: number;
  message: string;
  source: RequestSource;
  status: RequestStatus;
  contact_id?: number;
  created_at: Date;
  updated_at: Date;
}

export interface RequestWithContact {
  id: number;
  message: string;
  source: RequestSource;
  status: RequestStatus;
  contact_id: number | null;
  created_at: string;
  updated_at: string;
  contact_full_name: string | null;
  contact_username: string | null;
  contact_phone: string | null;
}

export interface CreateRequestInput {
  message: string;
  source: RequestSource;
  contact_id?: number;
  status?: RequestStatus;
}

export interface UpdateRequestInput {
  message?: string;
  source?: RequestSource;
  contact_id?: number;
  status?: RequestStatus;
}
