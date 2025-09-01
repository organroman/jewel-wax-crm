import { OrderBase } from "../types/order.types";
import { PersonRole } from "../types/person.types";

import db from "../db/db";

export const DashboardModel = {
  async getOrders({
    user_id,
    user_role,
  }: {
    user_id: number;
    user_role: PersonRole;
  }): Promise<OrderBase[]> {
    const orders = await db<OrderBase>("orders")
      .whereNot("active_stage", "done")
      .modify((qb) => {
        qb.leftJoin("order_favorites", function () {
          this.on("order_favorites.order_id", "=", "orders.id").andOn(
            "order_favorites.person_id",
            "=",
            db.raw("?", [user_id])
          );
        });

        qb.select(
          db.raw(
            `CASE WHEN order_favorites.person_id IS NOT NULL THEN true ELSE false END as is_favorite`
          )
        );
        qb.leftJoin(
          db.raw(`LATERAL (
            SELECT status, started_at
            FROM order_stage_statuses
            WHERE order_stage_statuses.order_id = orders.id
              AND order_stage_statuses.stage = orders.active_stage::order_stage
            ORDER BY created_at DESC
            LIMIT 1
          ) as stage_statuses`),
          db.raw("true")
        );
        qb.select(
          "stage_statuses.status as active_stage_status",
          "stage_statuses.started_at as active_stage_status_started_at "
        );
        const joins = ["modeller"];
        joins.forEach((role) => {
          qb.leftJoin(
            `persons as ${role}s`,
            `${role}s.id`,
            `orders.${role}_id`
          ).select(
            `${role}s.id as ${role}_id`,
            `${role}s.last_name as ${role}_last_name`,
            `${role}s.first_name as ${role}_first_name`,
            `${role}s.patronymic as ${role}_patronymic`
          );
        });

        if (user_role === "modeller")
          qb.where("modeller_id", user_id).andWhere("active_stage", "modeling");
        qb.select("orders.*");
      });

    return orders;
  },
};
