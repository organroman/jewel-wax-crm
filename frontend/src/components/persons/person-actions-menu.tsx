import { Person } from "@/types/person.types";

import { useQueryClient } from "@tanstack/react-query";
import { GalleryVerticalEndIcon } from "lucide-react";
import Link from "next/link";

import { usePerson } from "@/api/persons/use-person";

import { useDialog } from "@/hooks/use-dialog";

import { DropdownMenuItem } from "@components/ui/dropdown-menu";
import { Dialog } from "@components/ui/dialog";

import ActionsMenu from "@components/shared/actions-menu";
import Modal from "@components/shared/modal/modal";
import PersonInfo from "./person-info";

const PersonActionsMenu = ({ person }: { person: Person }) => {
  const queryClient = useQueryClient();

  const { dialogOpen: isViewDialogOpen, setDialogOpen: setIsViewDialogOpen } =
    useDialog();

  const {
    dialogOpen: isDeleteDialogOpen,
    setDialogOpen: setIsDeleteDialogOpen,
    closeDialog: closeDeleteDialog,
  } = useDialog();

  const { deletePersonMutation } = usePerson.deletePerson({
    queryClient,
    closeDialog: closeDeleteDialog,
  });
  return (
    <>
      <ActionsMenu
        editItemLink={`persons/${person.id}`}
        viewItemTitle="Переглянути контрагента"
        viewItemDialogOpen={() => setIsViewDialogOpen(true)}
        editItemTitle="Редагувати контрагента"
        deleteItemDialogOpen={() => setIsDeleteDialogOpen(true)}
        deleteItemTitle="Видалити контрагента"
        extraItems={
          <DropdownMenuItem asChild>
            <Link href={`persons/${person.id}?tab=orders_history`}>
              <GalleryVerticalEndIcon /> Історія замовлень
            </Link>
          </DropdownMenuItem>
        }
      />
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <Modal
          destructive
          header={{
            title: "Видалення контрагента",
            descriptionFirst: "Ви впевненні, що бажаєте видалити?",
            descriptionSecond: "Цю дію неможливо відмінити!",
          }}
          footer={{
            buttonActionTitleContinuous: "Видалення",
            buttonActionTitle: "Видалити",
            actionId: person.id,
            isPending: deletePersonMutation.isPending,
            action: () => deletePersonMutation.mutate(person.id),
          }}
        />

        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <Modal>
            <div className="mt-5">
              <PersonInfo person={person} />
            </div>
          </Modal>
        </Dialog>
      </Dialog>
    </>
  );
};

export default PersonActionsMenu;
