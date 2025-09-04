import { PersonRoleValue } from "@/types/person.types";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import StatisticClient from "./statistic-client";

import { getRoleAndUserFromToken, hasPermission } from "@/lib/utils";
import { PERMISSIONS } from "@/constants/permissions.constants";

const StatisticPage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const { role } = getRoleAndUserFromToken(token as PersonRoleValue);
  const permission = hasPermission(PERMISSIONS.STATISTIC.VIEW, role);

  if (!permission) {
    redirect("/dashboard");
  }
  return <StatisticClient />;
};

export default StatisticPage;
