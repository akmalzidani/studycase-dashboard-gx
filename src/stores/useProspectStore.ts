import { create } from "zustand";
import type { Prospect } from "@/types";

interface ProspectState {
  prospects: Prospect[];
  hasLoaded: boolean;
  isLoading: boolean;
  setProspects: (prospects: Prospect[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useProspectStore = create<ProspectState>((set) => ({
  prospects: [],
  hasLoaded: false,
  isLoading: false,
  setProspects: (prospects) => set({ prospects, hasLoaded: true }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
