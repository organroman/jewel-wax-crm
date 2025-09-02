import { ChanelSource, MessageAttachment } from "./shared.types";
import { Contact } from "./contact.types";
import { Person } from "./person.types";

export type ConversationStatus = "open" | "pending" | "snoozed" | "closed";
export type MessageDirection = "inbound" | "outbound";
export type SenderType = "contact" | "agent" | "system";
export type ContentKind =
  | "text"
  | "image"
  | "file"
  | "audio"
  | "video"
  | "location"
  | "other";

export interface Participant {
  contact: Contact | null;
  person: Person | null;
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
  participants: Participant[];
  provider: ChanelSource;
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
  sent_at: Date;
  created_at: Date;
  updated_at?: Date;
  attachments: MessageAttachment[];
}
