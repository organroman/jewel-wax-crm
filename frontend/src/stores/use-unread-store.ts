import { createStore } from "zustand/vanilla";
import { useStoreWithEqualityFn } from "zustand/traditional";
import type { StoreApi } from "zustand";
import { shallow } from "zustand/shallow";
import { BadgePayload } from "@/types/unread.types";

type State = BadgePayload & {
  setBadges: (p: BadgePayload) => void;
  setForKey: (key: string, n: number) => void;
  clearForKey: (key: string) => void;
};

export const unreadStore: StoreApi<State> = createStore<State>((set, get) => ({
  total: 0,
  byConversation: {},
  setBadges: (p) => set({ total: p.total, byConversation: p.byConversation }),
  setForKey: (key, n) => {
    const by = { ...get().byConversation, [key]: n };
    const total = Object.values(by).reduce((a, b) => a + b, 0);
    set({ byConversation: by, total });
  },
  clearForKey: (key) => {
    const by = { ...get().byConversation };
    delete by[key];
    const total = Object.values(by).reduce((a, b) => a + b, 0);
    set({ byConversation: by, total });
  },
}));

// This hook is hydration-safe and works with App Router
export const useUnreadStore = <T>(selector: (state: State) => T): T =>
  useStoreWithEqualityFn(unreadStore, selector, shallow);
