import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  isSystem: boolean;
  setTheme: (theme: Theme) => void;
  setSystemTheme: (theme: Theme) => void;
}

export const getSystemTheme = (): Theme =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: getSystemTheme(),
      isSystem: true,
      setTheme: (theme) => set({ theme, isSystem: false }),
      setSystemTheme: (theme) =>
        set((state) => (state.isSystem ? { theme } : {})),
    }),
    {
      name: "theme",
      // persist only a deliberate choice — the <head> script in layout.tsx
      // falls back to matchMedia on the absent key
      partialize: (state): Partial<ThemeStore> =>
        state.isSystem ? {} : { theme: state.theme },
    },
  ),
);
