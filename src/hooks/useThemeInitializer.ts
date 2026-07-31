"use client";

import { useEffect } from "react";
import { getSystemTheme, useThemeStore } from "@/stores/useThemeStore";

export function useThemeInitializer() {
  const theme = useThemeStore((state) => state.theme);
  const setSystemTheme = useThemeStore((state) => state.setSystemTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
    }
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const sync = () => setSystemTheme(getSystemTheme());

    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [setSystemTheme]);
}
