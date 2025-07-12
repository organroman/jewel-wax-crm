import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useOrder } from "@/api/order/use-order";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

import Modal from "@/components/shared/modal/modal";

import { useDialog } from "@/hooks/use-dialog";

interface DeleteOrderProps {
  orderId: number;
}

const DeleteOrder = ({ orderId }: DeleteOrderProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    dialogOpen: isDeleteDialogOpen,
    setDialogOpen,
    closeDialog,
  } = useDialog();

  const handleDeleteSuccess = () => {
    closeDialog();
    router.replace("/orders");
  };
  const { deleteOrderMutation } = useOrder.delete({
    queryClient,
    t,
    handleSuccess: handleDeleteSuccess,
  });

  return (
    <div className="border-t border-ui-border flex justify-end">
      <Button
        variant="link"
        type="button"
        size="sm"
        className="text-action-minus text-xs mt-4"
        onClick={() => setDialogOpen(true)}
      >
        {t("order.buttons.delete")}
      </Button>
      {deleteOrderMutation && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setDialogOpen}>
          <Modal
            destructive
            header={{
              title: t("order.modal.delete.title"),
              descriptionFirst: t("messages.info.confirm_delete"),
              descriptionSecond: t("messages.info.action_undone"),
            }}
            footer={{
              buttonActionTitleContinuous: t("buttons.delete_continuous"),
              buttonActionTitle: t("buttons.delete"),
              actionId: orderId,
              isPending: deleteOrderMutation.isPending,
              action: () => deleteOrderMutation.mutate(orderId),
            }}
          />
        </Dialog>
      )}
    </div>
  );
};

export default DeleteOrder;
