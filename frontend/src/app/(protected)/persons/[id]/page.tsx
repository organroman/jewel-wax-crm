import React from "react";

const PersonPage = ({ params }: { params: { id: string } }) => {
  return <div>PersonPage. Person ID- {params.id}</div>;
};

export default PersonPage;
