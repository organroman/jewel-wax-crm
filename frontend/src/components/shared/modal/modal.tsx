import { ModalProps } from "@/types/modal.types";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { DialogContent, DialogTitle } from "@/components/ui/dialog";

import ModalHeader from "./modal-header";
import ModalFooter from "./modal-footer";
import { cn } from "@/lib/utils";

const Modal = ({
  header,
  children,
  footer,
  destructive,
  hideClose,
  dialogContentClassname,
}: ModalProps) => {
  return (
    <DialogContent
      hideClose={hideClose}
      className={cn(
        "max-w-[95vw] mi-h-fit max-h-[80vh] lg:max-h-[90vh] p-2.5 lg:p-5 lg:pr-2 min-w-fit w-full lg:max-w-lg overflow-visible bg-ui-sidebar",
        dialogContentClassname
      )}
    >
      {!header?.title && (
        <DialogTitle asChild>
          <VisuallyHidden>Modal</VisuallyHidden>
        </DialogTitle>
      )}
      {header && (
        <ModalHeader
          title={header.title}
          descriptionFirst={header.descriptionFirst}
          descriptionSecond={header.descriptionSecond}
          destructive={destructive}
        />
      )}
      <div className={cn("h-full overflow-y-auto pr-5", hideClose && "pr-0")}>
        {children}
      </div>
      {footer && (
        <ModalFooter
          isPending={footer.isPending}
          submit={footer.submit}
          formId={footer.formId}
          actionId={footer.actionId}
          action={footer.action}
          buttonActionTitle={footer.buttonActionTitle}
          buttonActionTitleContinuous={footer.buttonActionTitleContinuous}
          destructive={destructive}
        />
      )}
    </DialogContent>
  );
};

export default Modal;
