import PersonClient from "./person-client";

const PersonPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <PersonClient id={Number(id)} />;
};

export default PersonPage;
