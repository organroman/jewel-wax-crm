import { PersonRoleValue } from "@/types/person.types";

import OrderClient from "./order-client";
import { cookies } from "next/headers";

import { getRoleAndUserFromToken } from "@/lib/utils";

const OrderPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const { id: userId, role } = getRoleAndUserFromToken(
    token as PersonRoleValue
  );

  return <OrderClient id={Number(id)} userId={userId} role={role} />;
};

export default OrderPage;
