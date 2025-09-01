import { PersonRoleValue } from "@/types/person.types";

import { cookies } from "next/headers";
import DashboardClient from "./dashboard-client";
import { getRoleAndUserFromToken } from "@/lib/utils";

const DashboardPage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const { role } = getRoleAndUserFromToken(token as PersonRoleValue);
  return <DashboardClient role={role} />;
};

export default DashboardPage;
