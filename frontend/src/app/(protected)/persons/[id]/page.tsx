import PersonClient from "./person-client";

const PersonPage = async ({ params }: { params: { id: string } }) => {
  return <PersonClient id={+params.id} />;
};

export default PersonPage;
