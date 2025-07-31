import { Order, Stage } from "@/types/order.types";
import { Action } from "@/types/permission.types";
import { PersonRoleValue } from "@/types/person.types";

import {
  ORDER_EXTRA_PERMISSIONS,
  ORDER_FIELD_PERMISSIONS,
  ORDER_STAGE_PERMISSIONS,
} from "@/constants/permissions.constants";

export const orderPermissions = {
  canExtraAccess: ({
    role,
    userId,
    order,
    action,
    entity,
  }: {
    role: PersonRoleValue;
    userId?: number;
    order?: Order;
    action: Action;
    entity: string;
  }): boolean => {
    const entityRules = ORDER_EXTRA_PERMISSIONS[entity];

    if (!entityRules) return true;

    const allowedRoles = entityRules[action];
    if (!allowedRoles) return true;

    if (entity === "order" && action === "VIEW" && order && userId) {
      const { miller, modeller, printer } = order;
      const performersIds = [miller?.id, modeller?.id, printer?.id];
      if (performersIds.includes(userId)) return true;
    }

    if (entity === "chat" && userId && order) {
      const { chat } = order;
      if (!chat) return true;
      return (
        allowedRoles.includes("super_admin") ||
        chat?.participants.some((p) => p.person_id === userId)
      );
    }

    return allowedRoles.includes(role);
  },
  canViewStage: ({ stage, role }: { role: PersonRoleValue; stage: Stage }) => {
    const stagePermission = ORDER_STAGE_PERMISSIONS[stage];
    return stagePermission ? stagePermission.VIEW.includes(role) : true;
  },
  canEditStage: ({ stage, role }: { role: PersonRoleValue; stage: Stage }) => {
    const stagePermission = ORDER_STAGE_PERMISSIONS[stage];
    return stagePermission ? stagePermission.UPDATE.includes(role) : true;
  },
  canViewField: ({ field, role }: { field: string; role: PersonRoleValue }) => {
    const fieldPermission = ORDER_FIELD_PERMISSIONS[field];
    return fieldPermission ? fieldPermission.VIEW.includes(role) : true;
  },
  canEditField: ({ field, role }: { field: string; role: PersonRoleValue }) => {
    const fieldPermission = ORDER_FIELD_PERMISSIONS[field];
    return fieldPermission ? fieldPermission.UPDATE.includes(role) : true;
  },
  canDeleteField: ({
    field,
    role,
  }: {
    field: string;
    role: PersonRoleValue;
  }) => {
    const fieldPermission = ORDER_FIELD_PERMISSIONS[field];
    return fieldPermission && fieldPermission.DELETE
      ? fieldPermission.DELETE?.includes(role)
      : true;
  },
} as const;

export const getColumnVisibilityByRole = (
  role: PersonRoleValue,
  query: string
) => {
  const includesModeling = query.includes("modeling");
  const includesMilling = query.includes("milling");
  const includesPrinting = query.includes("printing");

  return {
    is_favorite: true,
    is_important: true,
    created_at: true,
    number: true,
    image: true,
    name: true,
    customer: role === "super_admin",
    modeller: includesModeling,
    miller: includesMilling,
    printer: includesPrinting,
    amount: role === "super_admin",
    modeling_cost: role === "modeller",
    payment_status: role === "super_admin",
    active_stage: role === "super_admin",
    active_stage_status: role === "super_admin",
    specific_stage: role === "modeller" || role === "miller",
    specific_stage_status: role === "modeller" || role === "miller",
    processing_days: role === "super_admin",
    notes: role === "super_admin",
    actions: true,
  };
};
