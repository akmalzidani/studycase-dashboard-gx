import { create } from "zustand";
import type { Prospect } from "@/types";

interface ProspectState {
  __prospects: Prospect[];
  __isLoading: boolean;
  __handleSetProspects: (prospects: Prospect[]) => void;
  __handleSetIsLoading: (isLoading: boolean) => void;
}

export const useProspectStore = create<ProspectState>((set) => ({
  __prospects: [],
  __isLoading: false,
  __handleSetProspects: (__prospects) => set({ __prospects }),
  __handleSetIsLoading: (__isLoading) => set({ __isLoading }),
}));
