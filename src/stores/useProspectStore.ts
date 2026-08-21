import { create } from "zustand";
import type { Prospect } from "@/types";

interface ProspectState {
  prospects: Prospect[];
  isLoaded: boolean;
  isLoading: boolean;
  setProspects: (prospects: Prospect[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useProspectStore = create<ProspectState>((set) => ({
  prospects: [],
  isLoaded: false,
  isLoading: false,
  setProspects: (prospects) => set({ prospects, isLoaded: true }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
