import React from "react";

const RequestPage = ({ params }: { params: { id: string } }) => {
  return <div>RequestPage. request ID - {params.id}</div>;
};

export default RequestPage;
