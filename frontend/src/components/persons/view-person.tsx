import { InfoIcon, Loader } from "lucide-react";
import { useTranslation } from "react-i18next";

import { usePerson } from "@/api/person/use-person";

import { useDialog } from "@/hooks/use-dialog";

import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Separator } from "../ui/separator";
import CustomTabs from "../shared/custom-tabs";

import Modal from "../shared/modal/modal";
import PersonInfo from "./person-info";

import { PERSON_CARD_TABS_LIST } from "@/constants/persons.constants";
import { translateKeyValueList } from "@/lib/translate-constant-labels";

interface ViewEntityItemProps {
  id: number;
}

const ViewPersonDetails = ({ id }: ViewEntityItemProps) => {
  const { dialogOpen, setDialogOpen } = useDialog();
  const { t } = useTranslation();

  const tabs = translateKeyValueList(
    PERSON_CARD_TABS_LIST,
    t,
    "person.tabs"
  ).filter((t) => t.value === "general_info");

  const {
    data: person,
    isLoading,
    error,
  } = usePerson.getPersonById({ id, enabled: dialogOpen });

  return (
    <>
      <Button
        variant="ghost"
        className="has-[>svg]:p-1.5"
        onClick={() => setDialogOpen(true)}
      >
        <InfoIcon className="text-text-muted size-5" />
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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

export default ViewPersonDetails;
