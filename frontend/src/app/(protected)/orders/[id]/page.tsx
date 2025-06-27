import { PersonRoleValue } from "@/types/person.types";

import OrderClient from "./order-client";
import { cookies } from "next/headers";

import { Params } from "next/dist/server/request/params";
import { getRoleAndUserFromToken } from "@/lib/utils";

const OrderPage = async ({ params }: { params: Params }) => {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const { id: userId } = getRoleAndUserFromToken(token as PersonRoleValue);

  return <OrderClient id={Number(id)} userId={userId} />;
};

export default OrderPage;
