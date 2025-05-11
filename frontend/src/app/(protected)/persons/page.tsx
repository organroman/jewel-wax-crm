import { cookies } from "next/headers";
import PersonsClient from "./PersonsClient";

const PersonsPage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";

  return <PersonsClient token={token} />;
};

export default PersonsPage;
