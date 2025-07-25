import { useTranslation } from "react-i18next";
import { Loader } from "lucide-react";

import { useOrder } from "@/api/order/use-order";
import { useDialog } from "@/hooks/use-dialog";

import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import Modal from "../shared/modal/modal";
import OrderInfo from "./order-info";

interface ViewOrderProps {
  orderId: number;
  orderNumber: number;
}

const ViewOrder = ({ orderId, orderNumber }: ViewOrderProps) => {
  const { t } = useTranslation();
  const { dialogOpen, setDialogOpen } = useDialog();
  const {
    data: order,
    isLoading,
    error,
  } = useOrder.getById({ id: orderId, enabled: dialogOpen });

  return (
    <div>
      <Button
        variant="ghost"
        onClick={() => setDialogOpen(true)}
        className="underline text-action-plus hover:bg-transparent hover:text-indigo-400 font-medium  text-xs cursor-pointer"
      >
        {orderNumber}
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Modal hideClose dialogContentClassname="p-0 lg:p-0 lg:pr-0">
          {error && <p>{error.message}</p>}
          {isLoading && <Loader />}
          {!isLoading && order && <OrderInfo order={order} />}
        </Modal>
      </Dialog>
    </div>
  );
};

export default ViewOrder;
