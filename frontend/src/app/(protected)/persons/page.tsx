import { PersonRoleValue } from "@/types/person.types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import PersonsClient from "./persons-client";

import { getRoleAndUserFromToken, hasPermission } from "@/lib/utils";
import { PERMISSIONS } from "@/constants/permissions.constants";

const PersonsPage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const role = getRoleAndUserFromToken(token as PersonRoleValue);

  const permission = hasPermission(PERMISSIONS.PERSONS.VIEW, role);

  if (!permission) {
    redirect("/dashboard");
  }
  return <PersonsClient />;
};

export default PersonsPage;
