import { useQueryClient } from "@tanstack/react-query";
import {
  GalleryVerticalEndIcon,
  Loader,
  MoreHorizontalIcon,
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { usePerson } from "@/api/person/use-person";

import { useDialog } from "@/hooks/use-dialog";

import { DropdownMenuItem } from "@components/ui/dropdown-menu";
import { Dialog } from "@components/ui/dialog";

import ActionsMenu from "@components/shared/actions-menu";
import Modal from "@components/shared/modal/modal";

import { translateKeyValueList } from "@/lib/translate-constant-labels";
import { PERSON_CARD_TABS_LIST } from "@/constants/persons.constants";
import { Button } from "@/components/ui/button";

const ClientPaymentsActionsMenu = ({ id }: { id: number }) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { dialogOpen: isViewDialogOpen, setDialogOpen: setIsViewDialogOpen } =
    useDialog();

  const {
    dialogOpen: isDeleteDialogOpen,
    setDialogOpen: setIsDeleteDialogOpen,
    closeDialog: closeDeleteDialog,
  } = useDialog();

  const tabs = translateKeyValueList(
    PERSON_CARD_TABS_LIST,
    t,
    "person.tabs"
  ).filter((t) => t.value === "general_info");

  return (
    <>
      <Button variant="ghost" className="h-8 w-8 p-0">
        <span className="sr-only">Open menu</span>
        <MoreHorizontalIcon className="h-4 w-4 text-text-regular" />
      </Button>
      {/* <ActionsMenu
        editItemLink={`persons/${id}`}
        viewItemTitle={t("person.actions.view")}
        viewItemDialogOpen={() => setIsViewDialogOpen(true)}
        editItemTitle={t("person.actions.edit")}
        deleteItemDialogOpen={() => setIsDeleteDialogOpen(true)}
        deleteItemTitle={t("person.actions.delete")}
        extraItems={
          <DropdownMenuItem asChild>
            <Link href={`persons/${id}?tab=orders_history`}>
              <GalleryVerticalEndIcon className="text-text-regular" />{" "}
              {t("person.actions.orders_history")}
            </Link>
          </DropdownMenuItem>
        }
      /> */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <Modal
          destructive
          header={{
            title: t("person.modal.delete.title"),
            descriptionFirst: t("messages.info.confirm_delete"),
            descriptionSecond: t("messages.info.action_undone"),
          }}
          footer={{
            buttonActionTitleContinuous: t("buttons.delete.delete_continuous"),
            buttonActionTitle: t("buttons.delete"),
            actionId: id,
            // isPending: deletePersonMutation.isPending,
            // action: () => deletePersonMutation.mutate(id),
          }}
        />
      </Dialog>
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <Modal></Modal>
      </Dialog>
    </>
  );
};

export default ClientPaymentsActionsMenu;
