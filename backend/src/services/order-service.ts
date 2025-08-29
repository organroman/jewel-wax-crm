import {
  AdminOrder,
  CreateOrderInput,
  GetAllOrdersOptions,
  PaginatedOrdersResult,
  UpdateOrderInput,
  UserOrder,
} from "../types/order.types";
import { ChatParticipantFull } from "../types/order-chat.types";
import { PersonRole } from "../types/person.types";

import cloudinary from "../cloudinary/config";
import { s3 } from "../digital-ocean/spaces-client";

import { OrderModel } from "../models/order-model";
import { OrderChatModel } from "../models/order-chat-model";
import { ActivityLogModel } from "../models/activity-log-model";
import { PersonModel } from "../models/person-model";

import { OrderChatService } from "./order-chat-service";

import {
  formatPerson,
  getDoorAddress,
  getFullName,
  stripPrivateFields,
} from "../utils/helpers";
import { LOG_ACTIONS, LOG_TARGETS } from "../constants/activity-log";

export const OrderService = {
  async getAll({
    page,
    limit,
    filters,
    search,
    sortBy,
    order,
    user_id,
    user_role,
  }: GetAllOrdersOptions): Promise<
    PaginatedOrdersResult<AdminOrder | UserOrder>
  > {
    const [orders, stageCounts] = await Promise.all([
      OrderModel.getAll({
        page,
        limit,
        filters,
        search,
        sortBy,
        order,
        user_id,
        user_role,
      }),
      OrderModel.countByStage("done"),
    ]);

    const orderIds = orders.data.map((o) => o.id);
    const stageMap = await OrderModel.getOrderStagesForOrders(
      orderIds,
      user_role
    );

    const chats = await OrderChatModel.getChatIdsByOrderIds(orderIds);

    const enriched = orders.data.map((order) => {
      const chat = chats.find((chat) => chat.order_id === order.id);
      const base = {
        ...order,
        stages: stageMap[order.id] ?? [],
        chat_id: chat ? chat.chat_id : null,
        processing_days:
          order.processing_days ??
          Math.ceil(
            (Date.now() - new Date(order.created_at).getTime()) /
              (1000 * 60 * 60 * 24)
          ),
        customer: {
          id: order.customer_id,
          first_name: order.customer_first_name,
          last_name: order.customer_last_name,
          patronymic: order.customer_patronymic,
        },
        modeller: formatPerson(order, "modeller"),
        miller: formatPerson(order, "miller"),
        printer: formatPerson(order, "printer"),
      };

      const result = stripPrivateFields(base, user_role);

      return result as AdminOrder | UserOrder;
    });
    return {
      ...orders,
      data: enriched,
      stage_counts: stageCounts,
    };
  },
  async toggleFavorite({
    orderId,
    personId,
  }: {
    orderId: number;
    personId: number;
  }): Promise<{ status: string; orderId: number }> {
    return await OrderModel.toggleFavorite({ orderId, personId });
  },

  async toggleImportant({
    orderId,
    isImportant,
  }: {
    orderId: number;
    isImportant: boolean;
  }): Promise<AdminOrder> {
    return await OrderModel.toggleImportant({ orderId, isImportant });
  },
  async getById({
    userId,
    orderId,
    role,
  }: {
    userId: number;
    orderId: number;
    role: PersonRole;
  }): Promise<AdminOrder | UserOrder | null> {
    const order = await OrderModel.getOrderBaseById(orderId);

    if (!order) return null;

    const favorite = await OrderModel.getFavoriteOrderByIdAndUserId(
      userId,
      orderId
    );
    const is_favorite = favorite ? true : false;

    const media = await OrderModel.getOrderMedia({ orderId });

    const enrichedMedia = await Promise.all(
      media.map(async (f) => {
        const uploadedByRole = await PersonModel.getRoleById(f.uploaded_by);

        return {
          ...f,
          is_uploaded_by_modeller: uploadedByRole.role === "modeller",
        };
      })
    );

    const customerFull = await PersonModel.findById(order?.customer_id);

    const customer = customerFull
      ? {
          id: customerFull?.id,
          first_name: customerFull.first_name,
          last_name: customerFull.last_name,
          patronymic: customerFull.patronymic,
          phones: customerFull.phones,
          delivery_addresses: customerFull.delivery_addresses
            ? customerFull.delivery_addresses?.map((i) => {
                const { id, ...rest } = i;
                return {
                  ...rest,
                  delivery_address_id: i.id,
                  address_line: i.type
                    ? i.type === "door"
                      ? getDoorAddress(i.street, i.house_number, i.flat_number)
                      : i.np_warehouse
                    : "",
                };
              })
            : [],
        }
      : null;

    const modellerFull =
      order.modeller_id && (await PersonModel.findById(order.modeller_id));

    const modeller = modellerFull
      ? {
          id: modellerFull?.id,
          fullname: getFullName(
            modellerFull?.first_name,
            modellerFull?.last_name,
            modellerFull?.patronymic
          ),
        }
      : null;

    const millerFull =
      order.miller_id && (await PersonModel.findById(order.miller_id));

    const miller = millerFull
      ? {
          id: millerFull?.id,
          fullname: getFullName(
            millerFull?.first_name,
            millerFull?.last_name,
            millerFull?.patronymic
          ),
        }
      : null;

    const printerFull =
      order.printer_id && (await PersonModel.findById(order.printer_id));

    const printer = printerFull
      ? {
          id: printerFull?.id,
          fullname: getFullName(
            printerFull?.first_name,
            printerFull?.last_name,
            printerFull?.patronymic
          ),
        }
      : null;

    const createdByFull = await PersonModel.findById(order.created_by);
    const createdBy = getFullName(
      createdByFull?.first_name,
      createdByFull?.last_name,
      createdByFull?.patronymic
    );

    const stages = await OrderModel.getOrderStagesByOrderId(orderId);

    const activeStageStatus = stages.find(
      (stage) => stage.stage === order.active_stage
    )?.status;

    const delivery = await OrderModel.getDelivery(orderId);

    const enrichedDelivery = delivery
      ? {
          ...delivery,
          address_line:
            delivery?.type === "warehouse"
              ? delivery.np_warehouse
              : getDoorAddress(
                  delivery.street,
                  delivery.house_number,
                  delivery.flat_number
                ),
        }
      : null;

    const linked_orders = await OrderModel.getLinkedOrders(orderId);

    const order_chat = await OrderChatModel.getChatByOrderId({
      orderId: orderId,
      type: "modeller",
    });

    let chatParticipants: ChatParticipantFull[] = [];

    if (order_chat) {
      chatParticipants = await OrderChatService.getChatParticipants(
        order_chat.id
      );
    }

    const {
      customer_id,
      miller_id,
      printer_id,
      created_by,
      modeller_id,
      ...rest
    } = order;

    const enrichedOrder = {
      ...rest,
      is_favorite,
      media: enrichedMedia,
      customer: customer,
      modeller,
      miller,
      printer,
      stages,
      active_stage_status: activeStageStatus || null,
      processing_days:
        order.processing_days ??
        (order?.created_at &&
          Math.ceil(
            (Date.now() - new Date(order?.created_at).getTime()) /
              (1000 * 60 * 60 * 24)
          )),
      delivery: enrichedDelivery,
      linked_orders,
      createdBy,
      chat: {
        chat_id: order_chat?.id ?? null,
        participants: chatParticipants,
      },
    };

    return enrichedOrder;
  },
  async create({
    userId,
    role,
    data,
  }: {
    userId: number;
    role: PersonRole;
    data: CreateOrderInput;
  }) {
    const {
      customer,
      delivery,
      miller,
      stages,
      linked_orders,
      media,
      modeller,
      printer,
      ...baseOrder
    } = data;

    const newOrder = await OrderModel.createBaseOrder({
      ...baseOrder,
      customer_id: customer.id,
      created_by: userId,
      miller_id: miller?.id ?? null,
      modeller_id: modeller?.id ?? null,
      printer_id: printer?.id ?? null,
      processing_days: null,
      is_important: false,
      created_at: new Date(),
    });

    if (!newOrder) {
      return null;
    }

    if (modeller) {
      await OrderChatService.getOrCreateChat({
        orderId: newOrder.id,
        currentUser: userId,
        opponentId: modeller.id,
        type: "modeller",
      });
    }

    if (linked_orders?.length) {
      await OrderModel.createLinkedOrders(newOrder.id, linked_orders);
    }
    if (media?.length) {
      await OrderModel.insertMedia(newOrder.id, media);
    }

    if (delivery) {
      await OrderModel.insertDelivery({
        cost: delivery.cost,
        declaration_number: delivery.declaration_number,
        delivery_address_id: delivery.delivery_address_id,
        order_id: newOrder.id,
        is_third_party: delivery.is_third_party,
        delivery_service: "nova_poshta",
      });
    }
    if (stages?.length) {
      await Promise.all(
        stages.map(async (s) => {
          const isStageStarted =
            !s.started_at &&
            s.status &&
            [
              "clarification",
              "in_process",
              "negotiation",
              "pending",
              "processed",
            ].includes(s.status);

          const isStageCompleted = s.status === "done" && !s.completed_at;

          await OrderModel.insertStage({
            stage: s.stage,
            status: s.status,
            order_id: newOrder.id,
            started_at: s.started_at ?? (isStageStarted ? new Date() : null),
            completed_at:
              s.completed_at ?? (isStageCompleted ? new Date() : null),
          });
        })
      );
    }
    await ActivityLogModel.logAction({
      actor_id: userId || null,
      action: LOG_ACTIONS.CREATE_ORDER,
      target_type: LOG_TARGETS.ORDER,
      target_id: newOrder.id,
      details: {
        data,
      },
    });

    return await OrderService.getById({ orderId: newOrder.id, userId, role });
  },

  async update({
    userId,
    orderId,
    role,
    data,
  }: {
    userId: number;
    orderId: number;
    role: PersonRole;
    data: UpdateOrderInput;
  }) {
    const {
      customer,
      created_by,
      processing_days,
      miller,
      modeller,
      printer,
      stages,
      delivery,
      linked_orders,
      media,
      ...orderFields
    } = data;

    const isOrderCompleted =
      stages?.find((stage) => stage.stage === "done")?.status === "done";

    const updatedOrder = await OrderModel.updateBaseOrder(orderId, {
      ...orderFields,
      updated_at: new Date(),
      customer_id: customer?.id,
      created_by: userId,
      miller_id: miller?.id ?? null,
      modeller_id: modeller?.id ?? null,
      printer_id: printer?.id ?? null,
      processing_days: isOrderCompleted
        ? Math.ceil(
            (Date.now() - new Date(data.created_at).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : null,
    });

    if (!updatedOrder) {
      return null;
    }

    if (modeller) {
      await OrderChatService.getOrCreateChat({
        orderId,
        type: "modeller",
        currentUser: userId,
        opponentId: modeller.id,
      });
    }

    if (linked_orders?.length) {
      await OrderModel.replaceLinkedOrders(orderId, linked_orders);
    }

    const existingMedia = await OrderModel.getMediaByOrderId(orderId);

    const newMedia = media?.filter((m) => !m.id) ?? [];
    const incoming = media?.filter((m) => m.id) ?? [];

    const toDelete = existingMedia.filter(
      (dbMedia) => !incoming.find((m) => m.id === dbMedia.id)
    );

    const toUpdate = existingMedia.filter((dbMedia) => {
      const incomingMatch = incoming?.find((m) => m.id === dbMedia.id);
      return incomingMatch && incomingMatch.is_main !== dbMedia.is_main;
    });

    if (toDelete.length) {
      await OrderModel.deleteMediaByIds(toDelete.map((m) => m.id));
      const imagesToDelete = toDelete.filter((file) => file.type === "image");
      const otherFilesToDelete = toDelete.filter(
        (file) => file.type === "other"
      );

      if (imagesToDelete.length) {
        await Promise.all(
          imagesToDelete.map((m) => cloudinary.uploader.destroy(m.public_id))
        );
      }

      if (otherFilesToDelete.length) {
        await Promise.all(
          otherFilesToDelete.map((file) =>
            s3
              .deleteObject({
                Bucket: process.env.DO_SPACES_BUCKET!,
                Key: file.public_id,
              })
              .promise()
          )
        );
      }
    }

    if (toUpdate.length) {
      await OrderModel.updateMediaFlags(toUpdate, incoming);
    }

    if (newMedia.length) {
      await OrderModel.insertMedia(orderId, newMedia);
    }

    if (delivery) {
      if (!delivery.id) {
        await OrderModel.insertDelivery({
          cost: delivery.cost,
          declaration_number: delivery.declaration_number,
          delivery_address_id: delivery.delivery_address_id,
          order_id: orderId,
          is_third_party: delivery.is_third_party,
          delivery_service: "nova_poshta",
        });
      } else
        await OrderModel.updateDelivery(orderId, {
          delivery_address_id: delivery.delivery_address_id,
          cost: delivery.cost,
          is_third_party: delivery.is_third_party,
          updated_at: new Date(),
          declaration_number: delivery.declaration_number,
        });
    }

    if (stages?.length) {
      const toInsert = stages.filter((s) => !s.id);
      const toUpdate = stages.filter((s) => s.id);

      if (toInsert?.length) {
        await Promise.all(
          toInsert.map(async (s) => {
            const isStageStarted =
              !s.started_at &&
              s.status &&
              [
                "clarification",
                "in_process",
                "negotiation",
                "pending",
                "processed",
              ].includes(s.status);

            const isStageCompleted = s.status === "done" && !s.completed_at;

            await OrderModel.insertStage({
              stage: s.stage,
              status: s.status,
              order_id: orderId,
              started_at: s.started_at ?? (isStageStarted ? new Date() : null),
              completed_at:
                s.completed_at ?? (isStageCompleted ? new Date() : null),
            });
          })
        );
      }
      if (toUpdate.length) {
        await Promise.all(
          toUpdate.map(async (s) => {
            const isStageStarted =
              !s.started_at &&
              s.status &&
              [
                "clarification",
                "in_process",
                "negotiation",
                "pending",
                "processed",
              ].includes(s.status);

            const isStageCompleted = s.status === "done" && !s.completed_at;
            await OrderModel.updateStage(s.order_id, s.stage, {
              status: s.status,
              updated_at: new Date(),
              started_at: s.started_at ?? (isStageStarted ? new Date() : null),
              completed_at:
                s.completed_at ?? (isStageCompleted ? new Date() : null),
            });
          })
        );
      }
    }

    await ActivityLogModel.logAction({
      actor_id: userId || null,
      action: LOG_ACTIONS.UPDATE_ORDER,
      target_type: LOG_TARGETS.ORDER,
      target_id: orderId,
      details: {
        data,
      },
    });

    return await OrderService.getById({ orderId, userId, role });
  },

  async getOrdersNumbers({ search }: { search: string }) {
    const orders = await OrderModel.getOrdersNumbers({ search });
    return orders;
  },

  async delete(orderId: number, authorId?: number): Promise<number> {
    const result = await OrderModel.deleteOrder(orderId);

    await ActivityLogModel.logAction({
      actor_id: authorId ?? null,
      action: LOG_ACTIONS.DELETE_ORDER,
      target_id: orderId,
      target_type: LOG_TARGETS.ORDER,
    });

    return result;
  },
};
