"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { CabinetSvg } from "@/components/CabinetSvg";

const PcsScene = dynamic(() => import("@/components/PcsScene"), {
  ssr: false,
  loading: () => <CabinetSvg />,
});

function lowPower() {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  if (nav.connection?.saveData) return true;
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) return true;
  return (nav.hardwareConcurrency ?? 8) <= 2;
}

/** SVG first. Three.js chunk loads only when motion and the device allow it. */
export function PcsCabinet() {
  const [mode, setMode] = useState<"svg" | "3d">("svg");

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setMode(motion.matches || lowPower() ? "svg" : "3d");
    apply();
    motion.addEventListener("change", apply);
    return () => motion.removeEventListener("change", apply);
  }, []);

  if (mode === "svg") return <CabinetSvg />;
  return <PcsScene />;
}
