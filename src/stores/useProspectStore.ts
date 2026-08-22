import { create } from "zustand";
import type { Prospect } from "@/types";

interface ProspectState {
  prospects: Prospect[];
  isLoading: boolean;
  setProspects: (prospects: Prospect[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useProspectStore = create<ProspectState>((set) => ({
  prospects: [],
  isLoading: false,
  setProspects: (prospects) => set({ prospects }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
