import { ModalProps } from "@/types/modal.types";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { DialogContent, DialogTitle } from "@/components/ui/dialog";

import ModalHeader from "./modal-header";
import ModalFooter from "./modal-footer";

const Modal = ({ header, children, footer, destructive }: ModalProps) => {
  return (
    <DialogContent className="max-w-[95vw] max-h-[80vh] lg:max-h-[90vh] p-2.5 lg:p-5 min-w-fit w-full lg:max-w-lg overflow-y-auto">
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

      {children}
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
