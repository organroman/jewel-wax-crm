import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ModalHeaderProps } from "@/types/modal.types";
import React from "react";

const ModalHeader = ({
  destructive,
  title,
  descriptionFirst,
  descriptionSecond,
}: ModalHeaderProps) => {
  return (
    <DialogHeader className="flex flex-col justify-center text-center">
      <DialogTitle
        className={cn(
          "text-center text-xl",
          destructive ? "text-red-500" : "text-primary"
        )}
      >
        {title}
      </DialogTitle>
      <DialogDescription className="text-center text-md">
        {descriptionFirst}
      </DialogDescription>
      <DialogDescription className="text-sm font-bold text-center">
        {descriptionSecond}
      </DialogDescription>
    </DialogHeader>
  );
};

export default ModalHeader;
