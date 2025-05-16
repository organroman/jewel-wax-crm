import { cn } from "@/lib/utils";
import React from "react";

type InfoLabelProps = {
  children: React.ReactNode;
  className?: string;
};

const InfoLabel = ({ children, className }: InfoLabelProps) => {
  return <p className={cn("text-xs text-text-muted", className)}>{children}</p>;
};

export default InfoLabel;
