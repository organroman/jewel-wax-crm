import { ModalFooterProps, ModalHeaderProps } from "@/types/modal.types";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { DialogContent, DialogTitle } from "@/components/ui/dialog";

import ModalHeader from "./modal-header";
import ModalFooter from "./modal-footer";

interface ModalProps {
  header?: ModalHeaderProps;
  children?: React.ReactNode;
  footer?: ModalFooterProps;
  destructive?: boolean;
}

const Modal = ({ header, children, footer, destructive }: ModalProps) => {
  return (
    <DialogContent className="sm:max-w-md max-h-[90vh] max-w-lg min-w-fit overflow-y-auto">
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
