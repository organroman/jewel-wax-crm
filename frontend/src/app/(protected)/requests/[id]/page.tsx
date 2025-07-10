import React from "react";

const RequestPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <div>RequestPage. request ID - {id}</div>;
};

export default RequestPage;
