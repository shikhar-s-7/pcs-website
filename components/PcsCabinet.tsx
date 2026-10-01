"use client";

import dynamic from "next/dynamic";
import { Component, Suspense, useEffect, useState, type ReactNode } from "react";
import { CabinetSvg } from "@/components/CabinetSvg";

function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <p className="font-mono text-label text-muted uppercase">Loading concept render</p>
    </div>
  );
}

const PcsScene = dynamic(() => import("@/components/PcsScene"), {
  ssr: false,
  loading: Loading,
});

class WebglBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <CabinetSvg /> : this.props.children;
  }
}

function hasWebgl() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Returns why the device should get the SVG, or null for 3D. */
function lowPowerReason() {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  if (nav.connection?.saveData) return "save-data";
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) return "device-memory<=2";
  if ((nav.hardwareConcurrency ?? 8) <= 2) return "cpu-cores<=2";
  return null;
}

type Mode = "pending" | "svg" | "3d";

/** Fixed box so 3D, loader and SVG all occupy the same space. */
export function PcsCabinet() {
  const [mode, setMode] = useState<Mode>("pending");

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      const webgl = hasWebgl();
      const reason = motion.matches
        ? "reduced-motion"
        : !webgl
          ? "no-webgl"
          : lowPowerReason();
      setMode(reason ? "svg" : "3d");
    };
    apply();
    motion.addEventListener("change", apply);
    return () => motion.removeEventListener("change", apply);
  }, []);

  return (
    <div className="relative h-[60svh] min-h-[380px] md:h-[70svh] md:min-h-[420px] w-full">
      {mode === "pending" && <Loading />}
      {mode === "svg" && <CabinetSvg />}
      {mode === "3d" && (
        <WebglBoundary>
          <Suspense fallback={<Loading />}>
            <PcsScene />
          </Suspense>
        </WebglBoundary>
      )}
    </div>
  );
}
