import { Stage } from "@/types/order.types";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

import Modal from "../shared/modal/modal";

import { ORDER_STAGE } from "@/constants/enums.constants";

interface OrderChangeStageProps {
  currentStage: Stage;
  handleStageChange: (value: Stage) => void;
  closeDialog: () => void;
}

const OrderChangeStage = ({
  currentStage,
  handleStageChange,
  closeDialog,
}: OrderChangeStageProps) => {
  const { t } = useTranslation();
  const [newStage, setNewStage] = useState<Stage>(currentStage);

  const handleSave = () => {
    handleStageChange(newStage);
    closeDialog();
  };
  return (
    <Modal
      header={{
        title: t("order.modal.change_stage.title"),
        descriptionFirst: t("order.modal.change_stage.desc_first"),
      }}
      footer={{
        buttonActionTitle: t("buttons.save_changes"),
        buttonActionTitleContinuous: t("buttons.change_continuous"),
        action: handleSave,
      }}
    >
      <div className="flex justify-center">
        <RadioGroup
          defaultValue={currentStage}
          onValueChange={(value: Stage) => setNewStage(value)}
        >
          {ORDER_STAGE.map((stage) => (
            <div
              key={stage}
              className="flex items-center justify-start self-center gap-3"
            >
              <RadioGroupItem value={stage} id={stage} />
              <Label className="w-fit" htmlFor={stage}>
                {t(`order.stages.${stage}`)}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </Modal>
  );
};

export default OrderChangeStage;
