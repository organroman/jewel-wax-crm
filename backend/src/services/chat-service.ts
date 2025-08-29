import {
  ChannelSettings,
  ConversationStatus,
  ConversationWithContact,
  MessageWithAttachment,
  Provider,
} from "./../types/chat.types";
import { InboundEvent } from "../types/chat.types";
import { PersonBase } from "../types/person.types";
import { Contact } from "../types/contact.types";

import { Server } from "socket.io";

import app from "../index";

import { ContactService } from "./contact-service";
import { UploadService } from "./upload-service";

import { ChannelModel } from "../models/chat/channel-model";
import { ConversationModel } from "../models/chat/conversation-model";
import { MessageModel } from "../models/chat/message-model";
import { PersonModel } from "../models/person-model";
import { ContactModel } from "../models/contact-model";

import { getAdapter } from "../providers";

import { resolveAttachmentsForEvent } from "../utils/resolver-telegram-attachments";
import AppError from "../utils/AppError";
import { makeMulterFile } from "../utils/helpers";
import { emitBadges, getViewerUserIds } from "../utils/real-time";

import ERROR_MESSAGES from "../constants/error-messages";

async function ensureConversation(
  channelId: number,
  externalConversationId: string,
  contactId: number
) {
  let convo = await ConversationModel.findByChannelAndExternalId(
    channelId,
    externalConversationId
  );

  if (!convo) {
    const c = await ConversationModel.create({
      channel_id: channelId,
      external_conversation_id: externalConversationId,
      status: "open",
      created_at: new Date(),
    });
    convo = c;

    await ConversationModel.createParticipant({
      conversation_id: c.id,
      contact_id: contactId,
      person_id: null,
      role: "member",
      added_at: new Date(),
    });
  } else {
    const participants =
      await ConversationModel.getParticipantsByConversationsIds([convo.id]);

    const existing = participants.find((p) => p.contact_id === contactId);

    if (!existing) {
      await ConversationModel.createParticipant({
        conversation_id: convo.id,
        contact_id: contactId,
        person_id: null,
        role: "member",
        added_at: new Date(),
      });
    }
  }

  return convo!;
}

export const ChatService = {
  async ingestInboundEvents(events: InboundEvent[]) {
    const io: Server = app.get("io");

    for (const ev of events) {
      const channel = await ChannelModel.getByProviderAndExternalId(
        ev.provider,
        ev.channelExternalId
      );
      if (!channel) {
        console.warn("Unknown channel", ev.provider, ev.channelExternalId);
        continue;
      }

      const contact = await ContactService.findOrCreate({
        source: ev.provider,
        external_id: ev.contactExternalId,
        username: ev.contactUsername ?? null,
        full_name: ev.contactFullName ?? null,
      });

      const convo = await ensureConversation(
        channel.id,
        ev.conversationExternalId,
        contact.id
      );

      if (ev.externalMessageId) {
        const exists = await MessageModel.getByExternalId(
          convo.id,
          ev.externalMessageId
        );
        if (exists) continue;
      }

      const msg = await MessageModel.insertMessage({
        conversation_id: convo.id,
        direction: "inbound",
        sender: "contact",
        sender_contact_id: contact.id,
        external_message_id: ev.externalMessageId ?? null,
        content_kind: ev.attachments?.length ? "other" : "text",
        body: ev.text ?? null,
        metadata: ev.raw || {},
        sent_at: ev.sentAt ? ev.sentAt.toISOString() : null,
      });

      if (ev.attachments?.length) {
        try {
          const resolved = await resolveAttachmentsForEvent(ev);

          if (resolved.length) {
            const files: Express.Multer.File[] = resolved.map((r) =>
              makeMulterFile({
                buffer: r.buffer,
                mimetype: r.mimetype,
                originalname: r.filename,
              })
            );
            const uploaded = await UploadService.upload(files, 0);
            await MessageModel.insertAttachments(
              String(msg.id),
              uploaded.map((u, i) => {
                const src = resolved[i];
                const image = (u.format || "").startsWith("image");
                const video = (u.format || "").startsWith("video");
                const audio = (u.format || "").startsWith("audio");

                return {
                  url: u.url,
                  type: image
                    ? "image"
                    : video
                    ? "video"
                    : audio
                    ? "audio"
                    : "file",

                  name: u.name || src.filename,
                  size: u.size ?? src.byteSize,
                  public_id: u.public_id,
                  extra: src.extra || {},
                };
              })
            );
          }
        } catch (error) {
          console.log(error);
        }
      }
      await ConversationModel.updateLastMessageAt(convo.id);

      const room = `conversation:${convo.id}`;
      const payload = await MessageModel.getMessageById(msg.id);
      io.to(room).emit("chat:newMessage", payload);

      const participants =
        await ConversationModel.getParticipantsByConversationsIds([convo.id]);

      const participantIds = participants
        ?.map((p) => p.person_id)
        .filter((p) => p !== null);
      const viewers = await getViewerUserIds(io, room);

      for (const uid of viewers) {
        await MessageModel.markRead(convo.id, uid, Number(msg.id));
        const isViewerParticipant = participantIds.find((p) => p === uid);
        if (!isViewerParticipant) {
          await ConversationModel.createParticipant({
            conversation_id: convo.id,
            contact_id: null,
            person_id: uid,
            added_at: new Date(),
            role: "member",
          });
        }
      }

      if (participantIds.length) {
        const audience = [...new Set(participantIds)];
        for (const uid of audience) {
          await emitBadges(io, uid);
        }
      }
    }
  },
  async sendMessage(args: {
    conversation_id: number;
    agent_person_id: number;
    text?: string;
    attachments?: Array<{ url: string; mime?: string; file_name?: string }>;
  }) {
    const convo = await ConversationModel.findById(args.conversation_id);

    if (!convo) throw new AppError(ERROR_MESSAGES.CONVERSATION_NOT_FOUND, 404);

    const channel = await ChannelModel.getById(convo.channel_id);

    if (!channel) throw new AppError(ERROR_MESSAGES.CHANNEL_NOT_FOUND, 404);
    const participants =
      await ConversationModel.getParticipantsByConversationsIds([convo.id]);

    const provider = channel.provider as Provider;
    const settings = (channel.settings ?? {}) as ChannelSettings;
    const secretRef = settings.secret_ref;

    const message = await MessageModel.insertMessage({
      conversation_id: args.conversation_id,
      direction: "outbound",
      sender: "agent",
      sender_person_id: args.agent_person_id,
      content_kind: args.attachments?.length ? "other" : "text",
      body: args.text ?? null,
      metadata: {},
    });

    if (args.attachments?.length) {
      await MessageModel.insertAttachments(message.id, args.attachments);
    }

    await MessageModel.addDelivery(String(message.id), "queued");

    const isParticipant = participants.find(
      (p) => p.person_id === args.agent_person_id
    );

    if (!isParticipant) {
      await ConversationModel.createParticipant({
        conversation_id: args.conversation_id,
        person_id: args.agent_person_id,
        contact_id: null,
        added_at: new Date(),
        role: "member",
      });
    }

    const adapter = getAdapter(provider);

    try {
      const result = await adapter.sendMessage({
        channel: {
          provider,
          external_id: channel.external_account_id,
          secret_ref: secretRef || "",
        },
        to: { external_id: convo.external_conversation_id },
        text: args.text,
        attachments: args.attachments,
      });

      // 4) update message with external id + delivery transitions
      await MessageModel.updateMessage(
        {
          external_message_id: result.externalMessageId ?? null,
          updated_at: new Date(),
        },
        message.id
      );

      await MessageModel.addDelivery(String(message.id), "sent");
      await ConversationModel.updateLastMessageAt(convo.id);

      // return { messageId: message.id, externalMessageId };
    } catch (err: any) {
      await MessageModel.addDelivery(
        String(message.id),
        "failed",
        err?.code ?? null,
        err?.message ?? "send failed"
      );
      throw err;
    }
    return await MessageModel.getMessageById(message.id);
  },
  async listConversations({
    status,
    channel_id,
    limit,
    offset,
  }: {
    status: ConversationStatus;
    channel_id?: number;
    limit: number;
    offset: number;
  }): Promise<ConversationWithContact[]> {
    const conversations = await ConversationModel.list({
      status,
      channel_id,
      limit,
      offset,
    });

    const conversationIds = conversations.map((c) => c.id);

    const participants =
      await ConversationModel.getParticipantsByConversationsIds(
        conversationIds
      );

    const contactIds = participants
      .map((p) => p.contact_id)
      .filter((c) => c !== null);
    const personIds = participants
      .map((p) => p.person_id)
      .filter((p) => p !== null);

    let persons: PersonBase[] = [];
    let contacts: Contact[] = [];

    if (personIds.length) {
      persons = await PersonModel.getPersonsBaseByIds(personIds);
    }

    if (contactIds.length) {
      contacts = await ContactModel.getContactsByIds(contactIds);
    }

    const enriched = conversations.map((conversation) => {
      const participant = participants.find(
        (p) => p.conversation_id === conversation.id
      );
      const contact = contacts.find((c) => c.id === participant?.contact_id);
      const person = persons.find(
        (person) => person.id === participant?.person_id
      );

      return {
        ...conversation,
        contact: contact ? contact : null,
        person: person ? person : null,
      };
    });
    return enriched;
  },
  async getMessages(
    id: number,
    limit: number,
    before: string
  ): Promise<MessageWithAttachment[]> {
    const messages = await MessageModel.getByConversation(id, limit, before);

    const messagesIds = messages.map((m) => m.id);

    const attachments = await MessageModel.getAttachmentsByMessageIds(
      messagesIds
    );

    const enriched = messages.map((m) => {
      const messageAttachments = attachments.filter(
        (a) => a.message_id === m.id
      );

      return {
        ...m,
        attachments: messageAttachments,
      };
    });

    return enriched;
  },
};
