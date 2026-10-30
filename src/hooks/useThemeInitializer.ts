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

    // The theme-color tags from layout.tsx's viewport export pick by OS
    // scheme; a toggled theme can disagree with it, so point both at the
    // background we're actually painting.
    const background = getComputedStyle(root)
      .getPropertyValue("--background")
      .trim();
    if (background) {
      for (const meta of document.querySelectorAll<HTMLMetaElement>(
        'meta[name="theme-color"]',
      )) {
        meta.content = background;
      }
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
