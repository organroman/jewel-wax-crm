import { PersonRole } from "./person.types";

import {
  ORDER_CHAT_MEDIA_TYPE,
  ORDER_PERFORMER_TYPE,
} from "../constants/enums";

export type OrderPerformer = (typeof ORDER_PERFORMER_TYPE)[number];
export type OrderChatMediaType = (typeof ORDER_CHAT_MEDIA_TYPE)[number];

export interface OrderChat {
  id: number;
  order_id: number;
  type: OrderPerformer;
  created_at: string;
  updated_at: string;
}

export interface ChatParticipant {
  id: number;
  person_id: number;
  chat_id: number;
  joined_at: number;
}

export interface ChatParticipantInput {
  person_id: number;
  chat_id: number;
}

export interface ChatParticipantFull {
  id: number;
  person_id: number;
  chat_id: number;
  joined_at: number;
  first_name: string;
  last_name: string;
  patronymic?: string;
  phone: string;
  role: PersonRole;
}

export interface OrderChatInput {
  order_id: number;
  type: OrderPerformer;
}

export interface OrderChatMessage {
  id: number;
  chat_id: number;
  sender_id: number;
  message: string | null;
  media_id: number;
  reply_to_message_id: number | null;
  is_edited: boolean;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface OrderChatMessageInput {
  chat_id: number;
  sender_id: number;
  message?: string;
  media_id?: number;
  reply_to_message_id?: number;
}

export interface OrderChatMedia {
  id: number;
  uploader_id: number;
  type: OrderChatMediaType;
  url: string;
  name: string;
  size: number;
  created_at: string;
}

export interface OrderChatMediaInput {
  uploader_id: number;
  type: OrderChatMediaType;
  url: string;
  name: string;
  size: number;
}
