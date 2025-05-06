import React from "react";

const OrderPage = ({ params }: { params: { orderId: string } }) => {
  return <div>OrderPage {params.orderId}</div>;
};

export default OrderPage;
