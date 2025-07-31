import { orderPermissions } from "@/permissions/order.permissions";
import { Order, Stage } from "@/types/order.types";
import { Action } from "@/types/permission.types";
import { PersonRoleValue } from "@/types/person.types";
import { useMemo } from "react";

export const useOrderPermissions = (
  role: PersonRoleValue,
  userId: number,
  order?: Order
) => {
  return useMemo(() => {
    return {
      hasExtraAccess: (action: Action, entity: string) => {
        return orderPermissions.canExtraAccess({ role, order, action, entity });
      },
      canViewField: (field: string) =>
        orderPermissions.canViewField({ field, role }),
      canEditField: (field: string) =>
        orderPermissions.canEditField({ field, role }),
      canViewStage: (stage: Stage) =>
        orderPermissions.canViewStage({ stage, role }),
      canEditStage: (stage: Stage) =>
        orderPermissions.canEditStage({ stage, role }),
      canDeleteField: (field: string) =>
        orderPermissions.canDeleteField({ field, role }),
    };
  }, [role, userId, order]);
};
