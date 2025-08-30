import { PersonRoleValue } from "@/types/person.types";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import RequestsClient from "./requests-client";

import { getRoleAndUserFromToken, hasPermission } from "@/lib/utils";
import { PERMISSIONS } from "@/constants/permissions.constants";

const RequestsPage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const { role, id } = getRoleAndUserFromToken(token as PersonRoleValue);

  const permission = hasPermission(PERMISSIONS.REQUESTS.VIEW, role);

  if (!permission) {
    redirect("/dashboard");
  }
  return <RequestsClient userId={id} />;
};

export default RequestsPage;
