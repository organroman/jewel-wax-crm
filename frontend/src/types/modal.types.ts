export interface ModalHeaderProps {
  title: string;
  descriptionFirst: string;
  descriptionSecond?: string;
  destructive?: boolean;
}

export interface ModalFooterProps {
  isPending?: boolean;
  submit?: boolean;
  formId?: string;
  actionId?: number;
  action?: (id?: number) => void;
  buttonActionTitle: string;
  buttonActionTitleContinuous: string;
  destructive?: boolean;
}

export interface ModalProps {
  header?: ModalHeaderProps;
  children?: React.ReactNode;
  footer?: ModalFooterProps;
  destructive?: boolean;
}
