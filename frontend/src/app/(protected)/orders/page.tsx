import { cookies } from "next/headers";
import OrdersClient from "./orders-client";
import { getRoleAndUserFromToken } from "@/lib/utils";
import { PersonRoleValue } from "@/types/person.types";

const OrdersPage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const role = getRoleAndUserFromToken(token as PersonRoleValue);

  return <OrdersClient userRole={role} />;
};

export default OrdersPage;
