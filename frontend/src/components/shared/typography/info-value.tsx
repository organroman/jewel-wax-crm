import { cn } from "@/lib/utils";
import React from "react";

type InfoValueProps = {
  children: React.ReactNode;
  className?: string;
};

const InfoValue = ({ children, className }: InfoValueProps) => {
  return <p className={cn("text-xs font-medium", className)}>{children}</p>;
};

export default InfoValue;
