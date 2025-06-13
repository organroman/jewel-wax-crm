import { Params } from "next/dist/server/request/params";
import OrderClient from "./order-client";

const OrderPage = async ({ params }: { params: Params }) => {
  const { id } = await params;
  return <OrderClient id={Number(id)} />;
};

export default OrderPage;
