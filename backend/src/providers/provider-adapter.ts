import { InboundEvent, SendParams, SendResult } from "../types/chat.types";

export interface ProviderAdapter {
  parseWebhook(req: any): Promise<InboundEvent[]>;
  sendMessage(params: SendParams): Promise<SendResult>;
}
