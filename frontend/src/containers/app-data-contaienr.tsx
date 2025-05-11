"use client";
import { useEnums } from "@/api/enum/use-enums";
import { useEnumStore } from "@/stores/use-enums-store";
import { ReactNode, useEffect } from "react";

const AppDataContainer = ({ children }: { children: ReactNode }) => {
  const setAllEnums = useEnumStore((s) => s.setAllEnums);
  const { data, isSuccess, isLoading } = useEnums.getAllEnums();

  useEffect(() => {
    if (isSuccess && data) {
      setAllEnums(data);
    }
  }, [isSuccess, data, setAllEnums]);

  if (isLoading) return null;

  return <>{children}</>;
};

export default AppDataContainer;
