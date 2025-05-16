import { InfoIcon, Loader } from "lucide-react";

import { usePerson } from "@/api/persons/use-person";

import { useDialog } from "@/hooks/use-dialog";

import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Separator } from "../ui/separator";
import CustomTabs from "../shared/custom-tabs";

import Modal from "../shared/modal/modal";
import PersonDetails from "./person-details";

import { PERSON_CARD_TABS_LIST } from "@/constants/persons.constants";
import { useState } from "react";
import { TabOption } from "@/types/shared.types";

interface ViewEntityItemProps {
  id: number;
}

const ViewPersonDetails = ({ id }: ViewEntityItemProps) => {
  const { dialogOpen, setDialogOpen } = useDialog();
  const [selectedTab, setSelectedTab] = useState<TabOption>(
    PERSON_CARD_TABS_LIST[0]
  );

  const {
    data: person,
    isLoading,
    error,
  } = usePerson.getPersonById({ id, enabled: dialogOpen });

  return (
    <>
      <Button
        variant="ghost"
        className="has-[>svg]:p-0"
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
                tabsOptions={PERSON_CARD_TABS_LIST}
                selectedTab={selectedTab}
              />
              <Separator className="bg-ui-border h-0.5 data-[orientation=horizontal]:h-0.5" />
              {/* <div className="w-full"> */}
              <PersonDetails person={person} />
              {/* </div> */}
            </>
          )}
        </Modal>
      </Dialog>
    </>
  );
};

export default ViewPersonDetails;
