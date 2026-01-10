import { create } from "zustand";
import type { DrawingModes } from "@/components/Bio/HeroAscii/types";

interface DrawingModeStore {
  drawingMode: DrawingModes;
  setDrawingMode: (mode: DrawingModes) => void;
}

export const useDrawingModeStore = create<DrawingModeStore>((set) => ({
  drawingMode: null,
  setDrawingMode: (mode) => set({ drawingMode: mode }),
}));
