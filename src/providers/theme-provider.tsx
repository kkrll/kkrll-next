"use client";

import { useThemeInitializer } from "@/hooks/useThemeInitializer";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useThemeInitializer();
  return <>{children}</>;
}
