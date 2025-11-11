"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/stores/useThemeStore";

export function useThemeInitializer() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
    }
  }, [theme]);
}
