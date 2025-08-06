import { PersonRoleValue } from "@/types/person.types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import ReportsClient from "./reports-client";

import { getRoleAndUserFromToken } from "@/lib/utils";

const ReportsPage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const { role } = getRoleAndUserFromToken(token as PersonRoleValue);

  const searchParamsRes = await searchParams;
  const page = searchParamsRes.page ?? "1";
  const limit = searchParamsRes.limit ?? "10";

  if (!searchParamsRes.page || !searchParamsRes.limit) {
    const params = new URLSearchParams(searchParamsRes);
    params.set("page", page);
    params.set("limit", limit);

    redirect(`/reports?${params.toString()}`);
  }

  return <ReportsClient role={role} />;
};

export default ReportsPage;
