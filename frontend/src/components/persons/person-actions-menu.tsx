import { useQueryClient } from "@tanstack/react-query";
import { GalleryVerticalEndIcon, Loader } from "lucide-react";
import Link from "next/link";

import { usePerson } from "@/api/persons/use-person";

import { useDialog } from "@/hooks/use-dialog";

import { DropdownMenuItem } from "@components/ui/dropdown-menu";
import { Dialog } from "@components/ui/dialog";

import ActionsMenu from "@components/shared/actions-menu";
import Modal from "@components/shared/modal/modal";
import PersonInfo from "./person-info";
import { useTranslation } from "react-i18next";
import CustomTabs from "../shared/custom-tabs";
import { Separator } from "../ui/separator";
import { translateKeyValueList } from "@/lib/translate-constant-labels";
import { PERSON_CARD_TABS_LIST } from "@/constants/persons.constants";

const PersonActionsMenu = ({ id }: { id: number }) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { dialogOpen: isViewDialogOpen, setDialogOpen: setIsViewDialogOpen } =
    useDialog();

  const {
    dialogOpen: isDeleteDialogOpen,
    setDialogOpen: setIsDeleteDialogOpen,
    closeDialog: closeDeleteDialog,
  } = useDialog();

  const { deletePersonMutation } = usePerson.deletePerson({
    queryClient,
    handleSuccess: closeDeleteDialog,
    t,
  });

  const {
    data: person,
    isLoading,
    error,
  } = usePerson.getPersonById({ id, enabled: isViewDialogOpen });

  const tabs = translateKeyValueList(
    PERSON_CARD_TABS_LIST,
    t,
    "person.tabs"
  ).filter((t) => t.value === "general_info");

  return (
    <>
      <ActionsMenu
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
      />
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
            isPending: deletePersonMutation.isPending,
            action: () => deletePersonMutation.mutate(id),
          }}
        />
      </Dialog>
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <Modal>
          {error && <p>{error.message}</p>}
          {isLoading && <Loader />}
          {!isLoading && person && (
            <>
              <CustomTabs
                isModal={true}
                tabsOptions={tabs}
                selectedTab={tabs[0]}
              />
              <Separator className="bg-ui-border h-0.5 data-[orientation=horizontal]:h-0.5" />
              <PersonInfo person={person} />
            </>
          )}
        </Modal>
      </Dialog>
    </>
  );
};

export default PersonActionsMenu;
