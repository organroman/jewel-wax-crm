"use client";

import { ReactNode } from "react";
import "@/lib/i18n";

const TranslationProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default TranslationProvider;
