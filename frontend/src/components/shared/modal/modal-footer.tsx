import { ModalFooterProps } from "@/types/modal.types";

import { Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

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
  return (
    <DialogFooter
      className={cn("sm:justify-start w-ful flex flex-row mt-4 space-x-2 ")}
    >
      <DialogClose asChild>
        <Button
          type="button"
          variant="secondary"
          className="flex-1 rounded-sm"
          disabled={isPending}
        >
          Скасувати
        </Button>
      </DialogClose>
      <Button
        type={submit ? "submit" : "button"}
        form={submit ? formId : undefined}
        className="flex-1 rounded-sm"
        variant={destructive ? "destructive" : "default"}
        onClick={!submit && action ? () => action(actionId) : undefined}
        disabled={isPending}
      >
        {isPending ? (
          <div className="flex flex-row items-center">
            <Loader className="size-6 animate-spin text-white mr-2" />
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
