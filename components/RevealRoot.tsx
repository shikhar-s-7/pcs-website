"use client";

import { usePathname } from "next/navigation";
import { useReveal } from "@/hooks/useReveal";

/** Mount once in the layout. Re-arms reveals on each route. Renders nothing. */
export function RevealRoot() {
  useReveal(undefined, usePathname());
  return null;
}
