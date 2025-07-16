import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Loader } from "lucide-react";

import { useDialog } from "@/hooks/use-dialog";

import { useOrder } from "@/api/order/use-order";

import ActionsMenu from "../shared/actions-menu";
import Modal from "../shared/modal/modal";

import { Dialog } from "../ui/dialog";

import OrderInfo from "./order-info";

const OrderActionsMenu = ({ id }: { id: number }) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { dialogOpen: isViewDialogOpen, setDialogOpen: setIsViewDialogOpen } =
    useDialog();

  const {
    dialogOpen: isDeleteDialogOpen,
    setDialogOpen: setIsDeleteDialogOpen,
    closeDialog: closeDeleteDialog,
  } = useDialog();

  const { deleteOrderMutation } = useOrder.delete({
    queryClient,
    handleSuccess: closeDeleteDialog,
    t,
  });

  const {
    data: order,
    isLoading,
    error,
  } = useOrder.getById({ id, enabled: isViewDialogOpen });

  return (
    <>
      <ActionsMenu
        editItemLink={`orders/${id}`}
        viewItemTitle={t("order.buttons.view")}
        viewItemDialogOpen={() => setIsViewDialogOpen(true)}
        editItemTitle={t("order.buttons.edit")}
        deleteItemDialogOpen={() => setIsDeleteDialogOpen(true)}
        deleteItemTitle={t("order.buttons.delete")}
        // extraItems={
        //   <DropdownMenuItem asChild>
        //     <Link href={`persons/${id}?tab=orders_history`}>
        //       <GalleryVerticalEndIcon className="text-text-regular" />{" "}
        //       {t("person.actions.orders_history")}
        //     </Link>
        //   </DropdownMenuItem>
        // }
      />
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <Modal
          destructive
          header={{
            title: t("order.modal.delete.title"),
            descriptionFirst: t("messages.info.confirm_delete"),
            descriptionSecond: t("messages.info.action_undone"),
          }}
          footer={{
            buttonActionTitleContinuous: t("buttons.delete.delete_continuous"),
            buttonActionTitle: t("buttons.delete"),
            actionId: id,
            isPending: deleteOrderMutation.isPending,
            action: () => deleteOrderMutation.mutate(id),
          }}
        />
      </Dialog>
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <Modal hideClose dialogContentClassname="p-0 lg:p-0 lg:pr-0">
          {error && <p>{error.message}</p>}
          {isLoading && <Loader />}
          {!isLoading && order && (
            <div className="flex flex-col gap-2">
             
              <OrderInfo order={order} />
            </div>
          )}
        </Modal>
      </Dialog>
    </>
  );
};

export default OrderActionsMenu;
