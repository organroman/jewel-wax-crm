import { Params } from "next/dist/server/request/params";
import PersonClient from "./person-client";

const PersonPage = async ({ params }: { params: Params }) => {
  const { id } = await params;
  return <PersonClient id={Number(id)} />;
};

export default PersonPage;
