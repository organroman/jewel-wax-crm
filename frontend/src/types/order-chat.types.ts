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
  participants: ChatParticipant[];
  media: ChatMedia[];
}

export interface ChatMedia {
  id?: number;
  type: "file" | "image";
  url: string;
  name: string;
  size: number;
  public_id?: string;
}
