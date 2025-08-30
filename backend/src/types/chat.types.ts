import { Contact } from "./contact.types";
import { PersonBase } from "./person.types";

export type Provider =
  | "telegram"
  | "whatsapp"
  | "instagram"
  | "facebook"
  | "viber";

export type ConversationStatus = "open" | "pending" | "snoozed" | "closed";
export type MessageDirection = "inbound" | "outbound";
export type SenderType = "contact" | "agent" | "system";
export type DeliveryState = "queued" | "sent" | "delivered" | "read" | "failed";
export type ContentKind =
  | "text"
  | "image"
  | "file"
  | "audio"
  | "video"
  | "location"
  | "other";

export interface Channel {
  id: number;
  provider: Provider | string;
  account_label: string;
  external_account_id: string;
  is_active: boolean;
  settings: Record<string, unknown>;
}

export interface Conversation {
  id: number;
  channel_id: number;
  external_conversation_id: string;
  status: ConversationStatus;
  subject?: string | null;
  last_message_at?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface Message {
  id: string;
  conversation_id: number;
  direction: MessageDirection;
  sender: SenderType;
  sender_contact_id?: number | null;
  sender_person_id?: number | null;
  external_message_id?: string | null;
  content_kind: ContentKind;
  body?: string | null;
  metadata: Record<string, unknown>;
  sent_at?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface MessageAttachment {
  id: string;
  message_id: string;
  url: string;
  mime?: string | null;
  file_name?: string | null;
  byte_size?: number | null;
  width?: number | null;
  height?: number | null;
  duration_ms?: number | null;
  extra: Record<string, unknown>;
}

export type InboundEvent = {
  provider: Provider;
  channelExternalId: string; // e.g. bot id / phone / page id
  conversationExternalId: string; // e.g. telegram chat_id, WA phone-thread, etc.
  contactExternalId: string; // user id/phone/handle
  contactUsername?: string | null;
  contactFullName?: string | null;
  text?: string | null;
  attachments?: Array<{
    url: string;
    mime?: string;
    file_name?: string;
    byte_size?: number;
    width?: number;
    height?: number;
    duration_ms?: number;
    extra?: Record<string, unknown>;
  }>;
  externalMessageId?: string; // provider message id (for idempotency)
  sentAt?: Date | null;
  raw?: Record<string, unknown>; // trimmed provider payload
};

export interface ConversationParticipant {
  id: number;
  conversation_id: number;
  contact_id: number | null;
  person_id: number | null;
  added_at?: Date;
  role: string;
}

export interface ConversationWithContact extends Conversation {
  contact: Contact | null;
  person: PersonBase | null;
}

export interface MessageWithAttachment extends Message {
  attachments: MessageAttachment[];
}

export type OutAttachment = {
  url: string; // https URL to file (Cloudinary/DO Spaces)
  mime?: string | null; // e.g. "image/jpeg", "video/mp4", "application/pdf"
  name: string;
  size?: number | null;
  type?: "file" | "image" | "video" | "audio";
  width?: number | null;
  height?: number | null;
  duration_ms?: number | null;
};

export type SendParams = {
  channel: { provider: Provider; external_id: string; secret_ref: string }; // external_id = bot id / phone id / page id
  to: { external_id: string }; // contact external id (e.g., Telegram user id)
  text?: string;
  attachments?: OutAttachment[]; // OutAttachment?
  // optional per-provider metadata if needed later
};

export type SendResult = {
  externalMessageId?: string | null;
  parts?: Array<{ externalMessageId: string; kind?: string }>;
  raw?: any;
};

export interface ProviderAdapter {
  send(params: SendParams): Promise<SendResult>;
}

export type ChannelSettings = {
  secret_ref?: string;
  verify_header_secret?: string;
};
