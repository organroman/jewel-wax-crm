import {
  AdminOrder,
  GetAllOrdersOptions,
  PaginatedOrdersResult,
  UpdateOrderInput,
  UserOrder,
} from "../types/orders.types";
import { PersonRole } from "../types/person.types";

import cloudinary from "../cloudinary/config";

import { OrderModel } from "../models/order-model";
import { ActivityLogModel } from "../models/activity-log-model";
import { PersonModel } from "../models/person-model";

import {
  formatPerson,
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

    const stageMap = await OrderModel.getOrderStagesForOrders(
      orders.data.map((o) => o.id),
      user_role
    );

    const enriched = orders.data.map((order) => {
      const base = {
        ...order,
        stages: stageMap[order.id] ?? [],
        processing_days:
          order.processing_days ??
          Math.ceil(
            (Date.now() - new Date(order.created_at).getTime()) /
              (1000 * 60 * 60 * 24)
          ),
        customer: formatPerson(order, "customer"),
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

    const media = await OrderModel.getOrderImages({ orderId });
    const customerFull = await PersonModel.findById(order.customer_id);

    const customer = customerFull
      ? {
          id: customerFull?.id,
          fullname: getFullName(
            customerFull?.first_name,
            customerFull?.last_name,
            customerFull?.patronymic
          ),
          delivery_addresses: customerFull.delivery_addresses
            ? customerFull.delivery_addresses?.map((i) => ({
                delivery_address_id: i.id,
                address_line: i.address_line,
              }))
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

    const linked_orders = await OrderModel.getLinkedOrders(orderId);

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
      media,
      customer: customer,
      modeller,
      miller,
      printer,
      stages,
      active_stage_status: activeStageStatus || null,
      processing_days:
        order.processing_days ??
        Math.ceil(
          (Date.now() - new Date(order.created_at).getTime()) /
            (1000 * 60 * 60 * 24)
        ),
      delivery,
      linked_orders,
      createdBy,
    };

    return enrichedOrder;
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
      await Promise.all(
        toDelete.map((m) => cloudinary.uploader.destroy(m.public_id))
      );
    }

    if (toUpdate.length) {
      await OrderModel.updateMediaFlags(toUpdate, incoming);
    }

    if (newMedia.length) {
      await OrderModel.insertMedia(orderId, newMedia);
    }

    if (delivery) {
      const isNew = delivery.hasOwnProperty(delivery.id);
      if (isNew) {
        await OrderModel.insertDelivery({
          cost: delivery.cost,
          declaration_number: delivery.declaration_number,
          delivery_address_id: delivery.delivery_address_id,
          order_id: orderId,
        });
      } else
        await OrderModel.updateDelivery(orderId, {
          delivery_address_id: delivery.delivery_address_id,
          cost: delivery.cost,
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
};
