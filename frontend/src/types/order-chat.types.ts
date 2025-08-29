import { PersonRole } from "./person.types";

export interface ChatMessage {
  id: number;
  sender_id: number;
  message: string;
  media: ChatMedia[];
  created_at: string;
}

export interface ChatParticipant {
  id: number;
  chat_id: number;
  person_id: number;
  joined_at: string;
  first_name: string;
  last_name: string;
  patronymic?: string;
  phone: string;
  role: PersonRole;
  avatar_url: string | null;
}

export interface ChatDetails {
  messages: ChatMessage[];
  media: ChatMedia[];
}

export interface ChatMedia {
  id?: number | string;
  type: "file" | "image" | "video" | "audio";
  url: string;
  name: string;
  size: number;
  public_id?: string;
}
