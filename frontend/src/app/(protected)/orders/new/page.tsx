import { cookies } from "next/headers";
import NewOrderClient from "./new-order-client";
import { getRoleAndUserFromToken } from "@/lib/utils";
import { PersonRoleValue } from "@/types/person.types";

const NewOrder = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const { id: userId } = getRoleAndUserFromToken(token as PersonRoleValue);

  return <NewOrderClient userId={userId} />;
};

export default NewOrder;
