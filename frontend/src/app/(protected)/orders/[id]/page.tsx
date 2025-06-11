import OrderClient from "./order-client";

const OrderPage = ({ params }: { params: { id: string } }) => {
  return <OrderClient id={Number(params.id)} />;
};

export default OrderPage;
