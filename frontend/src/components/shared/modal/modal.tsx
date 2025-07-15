import { ModalProps } from "@/types/modal.types";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { DialogContent, DialogTitle } from "@/components/ui/dialog";

import ModalHeader from "./modal-header";
import ModalFooter from "./modal-footer";

const Modal = ({ header, children, footer, destructive }: ModalProps) => {
  return (
    <DialogContent className="max-w-[95vw] mi-h-fit max-h-[80vh] lg:max-h-[90vh] p-2.5 lg:p-5 lg:pr-2 min-w-fit w-full lg:max-w-lg overflow-visible bg-ui-sidebar">
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
      <div className="h-full overflow-y-auto pr-5">{children}</div>
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
