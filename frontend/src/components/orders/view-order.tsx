import { Loader } from "lucide-react";

import { useOrder } from "@/api/order/use-order";
import { useDialog } from "@/hooks/use-dialog";

import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import Modal from "../shared/modal/modal";
import OrderInfo from "./order-info";
import { Badge } from "../ui/badge";

interface ViewOrderProps {
  orderId: number;
  orderNumber: number;
  badge?: number;
}

const ViewOrder = ({ orderId, orderNumber, badge }: ViewOrderProps) => {
  const { dialogOpen, setDialogOpen } = useDialog();
  const {
    data: order,
    isLoading,
    error,
  } = useOrder.getById({ id: orderId, enabled: dialogOpen });

  return (
    <div>
      <div className="flex flex-row items-center gap-1">
        <Button
          variant="ghost"
          onClick={() => setDialogOpen(true)}
          className="flex pr-2 underline text-action-plus hover:bg-transparent hover:text-indigo-400 font-medium  text-xs cursor-pointer"
        >
          {orderNumber}
        </Button>
        {badge && (
          <Badge className="bg-brand-default rounded-full w-5 h-5 text-[10px] font-bold">
            {badge}
          </Badge>
        )}
      </div>
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
