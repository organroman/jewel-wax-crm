import { createStore } from "zustand/vanilla";
import { useStoreWithEqualityFn } from "zustand/traditional";
import type { StoreApi } from "zustand";
import { shallow } from "zustand/shallow";
import { EnumItem } from "@/types/shared.types";

type EnumStore = {
  enums: Record<string, EnumItem[]>;
  setAllEnums: (all: Record<string, EnumItem[]>) => void;
  getByType: (type: string) => EnumItem[];
};

export const enumStore: StoreApi<EnumStore> = createStore<EnumStore>(
  (set, get) => ({
    enums: {},
    setAllEnums: (all) => set({ enums: all }),
    getByType: (type) => get().enums[type] || [],
  })
);

// This hook is hydration-safe and works with App Router
export const useEnumStore = <T>(selector: (state: EnumStore) => T): T =>
  useStoreWithEqualityFn(enumStore, selector, shallow);
