"use client";

import dynamic from "next/dynamic";
import { ThemeProviderProps } from "next-themes"; // Correct import
import * as React from "react";

const NextThemesProvider = dynamic(
  () => import("next-themes").then((mod) => mod.ThemeProvider),
  { ssr: false } // Disable SSR for theme provider
);

export default function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
