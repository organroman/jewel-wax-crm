import { ModalFooterProps } from "@/types/modal.types";

import { Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";

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
    <DialogFooter className="sm:justify-start mt-4">
      <DialogClose asChild>
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          disabled={isPending}
        >
          Скасувати
        </Button>
      </DialogClose>
      <Button
        type={submit ? "submit" : "button"}
        form={submit ? formId : undefined}
        className="w-full"
        variant={destructive ? "destructive" : "default"}
        onClick={!submit && action ? () => action(actionId) : undefined}
        disabled={isPending}
      >
        {isPending ? (
          <div className="flex flex-row items-center">
            <Loader className="size-6 animate-spin text-zinc-300 mr-2" />
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
