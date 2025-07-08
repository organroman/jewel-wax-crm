import { ModalFooterProps } from "@/types/modal.types";

import { Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const ModalFooter = ({
  isPending,
  submit,
  formId,
  destructive,
  action,
  actionId,
  buttonActionTitleContinuous,
  buttonActionTitle,
}: ModalFooterProps) => {
  const { t } = useTranslation();
  return (
    <DialogFooter
      className={cn(
        "sm:justify-start w-ful flex flex-row mt-4 lg:mt-8 space-x-2 "
      )}
    >
      <DialogClose asChild>
        <Button
          type="button"
          variant="secondary"
          className="flex-1 rounded-sm"
          disabled={isPending}
        >
          {t("buttons.cancel")}
        </Button>
      </DialogClose>
      <Button
        type={submit ? "submit" : "button"}
        form={submit ? formId : undefined}
        className="flex-1 rounded-sm"
        variant={destructive ? "destructive" : "default"}
        onClick={
          !submit && action
            ? () => {
                if (typeof action === "function") {
                  (action as (id?: number) => void)(actionId);
                }
              }
            : undefined
        }
        disabled={isPending}
      >
        {isPending ? (
          <div className="flex flex-row items-center">
            <Loader className="size-6 animate-spin text-text-regular mr-2" />
            <span>{buttonActionTitleContinuous}</span>
          </div>
        ) : (
          buttonActionTitle
        )}
      </Button>
    </DialogFooter>
  );
};

export default ModalFooter;
