import { cookies } from "next/headers";
import OrdersClient from "./orders-client";
import { getRoleAndUserFromToken } from "@/lib/utils";
import { PersonRoleValue } from "@/types/person.types";
import { redirect } from "next/navigation";

const OrdersPage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const searchParamsRes = await searchParams;

  const page = searchParamsRes.page ?? "1";
  const limit = searchParamsRes.limit ?? "10";
  if (!searchParamsRes.page || !searchParamsRes.limit) {
    const params = new URLSearchParams(searchParamsRes);
    params.set("page", page);
    params.set("limit", limit);

    redirect(`/orders?${params.toString()}`);
  }

  const { role } = getRoleAndUserFromToken(token as PersonRoleValue);

  return <OrdersClient userRole={role} />;
};

export default OrdersPage;
