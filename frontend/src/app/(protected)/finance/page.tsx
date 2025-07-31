import { PersonRoleValue } from "@/types/person.types";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import FinanceClient from "./finance-client";

import { PERMISSIONS } from "@/constants/permissions.constants";
import { getRoleAndUserFromToken, hasPermission } from "@/lib/utils";

const FinancePage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const { role } = getRoleAndUserFromToken(token as PersonRoleValue);
  const permission = hasPermission(PERMISSIONS.FINANCE.VIEW, role);

  const searchParamsRes = await searchParams;
  const page = searchParamsRes.page ?? "1";
  const limit = searchParamsRes.limit ?? "10";

  if (!searchParamsRes.page || !searchParamsRes.limit) {
    const params = new URLSearchParams(searchParamsRes);
    params.set("page", page);
    params.set("limit", limit);

    redirect(`/finance?${params.toString()}`);
  }

  if (!permission) {
    redirect("/dashboard");
  }

  return <FinanceClient />;
};

export default FinancePage;
