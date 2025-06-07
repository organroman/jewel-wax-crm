import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { GalleryVerticalEndIcon, Loader } from "lucide-react";
import Link from "next/link";

import { useDialog } from "@/hooks/use-dialog";

import { useOrder } from "@/api/orders/use-order";

import ActionsMenu from "../shared/actions-menu";
import Modal from "../shared/modal/modal";
import CustomTabs from "../shared/custom-tabs";

import { Dialog } from "../ui/dialog";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";

import { translateKeyValueList } from "@/lib/translate-constant-labels";
import { ORDER_CARD_TABS_LIST } from "@/constants/orders.constants";

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

  const tabs = translateKeyValueList(
    ORDER_CARD_TABS_LIST,
    t,
    "order.tabs"
  ).filter((t) => t.value === "general_info");

  return (
    <>
      <ActionsMenu
        editItemLink={`orders/${id}`}
        viewItemTitle={t("order.actions.view")}
        viewItemDialogOpen={() => setIsViewDialogOpen(true)}
        editItemTitle={t("order.actions.edit")}
        deleteItemDialogOpen={() => setIsDeleteDialogOpen(true)}
        deleteItemTitle={t("order.actions.delete")}
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
            descriptionFirst: t("order.modal.delete.desc_first"),
            descriptionSecond: t("order.modal.delete.desc_second"),
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
        <Modal>
          {error && <p>{error.message}</p>}
          {isLoading && <Loader />}
          {!isLoading && order && (
            <>
              <CustomTabs
                isModal={true}
                tabsOptions={tabs}
                selectedTab={tabs[0]}
              />
              <Separator className="bg-ui-border h-0.5 data-[orientation=horizontal]:h-0.5" />
              {/* TODO:  ORDER VIEW */}
            </>
          )}
        </Modal>
      </Dialog>
    </>
  );
};

export default OrderActionsMenu;
