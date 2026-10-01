"use client";

import { useRef } from "react";
import { ACCENT, MONO, stroke } from "@/components/diagrams/svg";
import { useDrawOn } from "@/components/diagrams/useDrawOn";

type Stage = "dc" | "pcs" | "transformer" | "grid";

type SingleLineDiagramProps = {
  /** Stage drawn in the accent. */
  highlight?: Stage;
  className?: string;
};

const LABEL_Y = 176;

/** DC source, PCS, transformer, grid. One conductor, left to right. */
export function SingleLineDiagram({ highlight = "pcs", className }: SingleLineDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  useDrawOn(ref);
  const tone = (stage: Stage) => (stage === highlight ? ACCENT : "currentColor");

  return (
    <svg
      ref={ref}
      viewBox="0 0 800 200"
      className={className}
      role="img"
      aria-label="Single-line diagram: DC source, PCS, transformer, grid"
    >
      <g {...stroke}>
        <g stroke={tone("dc")}>
          <path data-draw d="M60,70 L60,130" />
          <path data-draw d="M76,84 L76,116" />
          <path data-draw d="M92,70 L92,130" />
          <path data-draw d="M108,84 L108,116" />
          <path data-draw d="M60,100 L40,100" />
        </g>
        <path data-draw d="M108,100 L220,100" />

        <g stroke={tone("pcs")}>
          <rect data-draw x="220" y="56" width="120" height="88" />
          <path data-draw d="M220,144 L340,56" />
          <path data-draw d="M234,74 L254,74 M234,80 L254,80" />
          <path data-draw d="M302,126 C308,118 314,118 320,126 C326,134 332,134 338,126" />
        </g>
        <path data-draw d="M340,100 L446,100" />

        <g stroke={tone("transformer")}>
          <circle data-draw cx="470" cy="100" r="24" />
          <circle data-draw cx="502" cy="100" r="24" />
        </g>
        <path data-draw d="M526,100 L640,100" />

        <g stroke={tone("grid")}>
          <path data-draw d="M640,52 L640,148" />
          <path data-draw d="M640,100 L720,100" />
          <path data-draw d="M720,72 L720,128" />
          <path data-draw d="M720,72 L736,60 M720,86 L736,74 M720,100 L736,88 M720,114 L736,102 M720,128 L736,116" />
        </g>
      </g>

      <g fontFamily={MONO} fontSize="11" letterSpacing="1.5" fill="var(--muted)">
        <text data-label x="74" y={LABEL_Y} textAnchor="middle">DC SOURCE</text>
        <text data-label x="280" y={LABEL_Y} textAnchor="middle">PCS</text>
        <text data-label x="486" y={LABEL_Y} textAnchor="middle">TRANSFORMER</text>
        <text data-label x="688" y={LABEL_Y} textAnchor="middle">GRID</text>
        <text data-label x="164" y="90" textAnchor="middle">DC</text>
        <text data-label x="393" y="90" textAnchor="middle">AC</text>
      </g>
    </svg>
  );
}
