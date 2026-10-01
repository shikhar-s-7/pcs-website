"use client";

import { useRef } from "react";
import { ACCENT, MONO, arrowHead, stroke } from "@/components/diagrams/svg";
import { useDrawOn } from "@/hooks/useReveal";

type Block = "pf" | "qv" | "zv" | "current";

type ControlBlockDiagramProps = {
  /** Block drawn in the accent. */
  highlight?: Block;
  className?: string;
};

const W = 150;
const H = 52;

const blocks: { id: Block; x: number; y: number; lines: string[] }[] = [
  { id: "pf", x: 110, y: 30, lines: ["P–f", "DROOP"] },
  { id: "qv", x: 110, y: 160, lines: ["Q–V", "DROOP"] },
  { id: "zv", x: 400, y: 95, lines: ["VIRTUAL", "IMPEDANCE"] },
  { id: "current", x: 630, y: 95, lines: ["CURRENT", "LOOP"] },
];

/** Shorter block labels for narrow screens, where the drawing renders at about 0.36x. */
const short: Record<Block, string> = { pf: "P–f", qv: "Q–V", zv: "Z VIRT", current: "I LOOP" };

/**
 * Outer droops set angle and magnitude. Virtual impedance shapes the
 * voltage reference. The inner current loop drives modulation.
 * Scales with its container; never scrolls.
 */
export function ControlBlockDiagram({ highlight, className }: ControlBlockDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  useDrawOn(ref);

  const midY = (y: number) => y + H / 2;

  return (
    <div className="@container">
    <svg
      ref={ref}
      viewBox="0 0 880 260"
      preserveAspectRatio="xMidYMid meet"
      style={{ width: "100%", height: "auto", display: "block" }}
      className={className}
      role="img"
      aria-label="Control block diagram: P-f droop, Q-V droop, virtual impedance, inner current loop"
    >
      <g {...stroke}>
        {blocks.map((block) => (
          <rect
            key={block.id}
            data-draw
            x={block.x}
            y={block.y}
            width={W}
            height={H}
            stroke={block.id === highlight ? ACCENT : "currentColor"}
          />
        ))}

        <path data-draw d={`M40,${midY(30)} L110,${midY(30)}`} />
        <path data-draw d={arrowHead(110, midY(30), "right")} />
        <path data-draw d={`M40,${midY(160)} L110,${midY(160)}`} />
        <path data-draw d={arrowHead(110, midY(160), "right")} />

        <path data-draw d={`M260,${midY(30)} L340,${midY(30)} L340,112 L400,112`} />
        <path data-draw d={arrowHead(400, 112, "right")} />
        <path data-draw d={`M260,${midY(160)} L340,${midY(160)} L340,130 L400,130`} />
        <path data-draw d={arrowHead(400, 130, "right")} />

        <path data-draw d={`M550,${midY(95)} L630,${midY(95)}`} />
        <path data-draw d={arrowHead(630, midY(95), "right")} />
        <path data-draw d={`M780,${midY(95)} L850,${midY(95)}`} />
        <path data-draw d={arrowHead(850, midY(95), "right")} />

        <path data-draw d={`M815,${midY(95)} L815,236 L475,236 L475,147`} />
        <path data-draw d={arrowHead(475, 147, "up")} />
        <path data-draw d="M705,236 L705,147" />
        <path data-draw d={arrowHead(705, 147, "up")} />
      </g>

      {/* wide container */}
      <g className="hidden @[720px]:block">
        <g fontFamily={MONO} fontSize="12" letterSpacing="1.5" textAnchor="middle">
          {blocks.map((block) => (
            <text
              key={block.id}
              data-label
              x={block.x + W / 2}
              y={block.y + 22}
              fill={block.id === highlight ? ACCENT : "currentColor"}
            >
              {block.lines.map((line, index) => (
                <tspan key={line} x={block.x + W / 2} dy={index === 0 ? 0 : 15}>
                  {line}
                </tspan>
              ))}
            </text>
          ))}
        </g>

        <g fontFamily={MONO} fontSize="12" letterSpacing="1" fill="var(--muted)">
          <text data-label x="40" y={midY(30) - 8}>P</text>
          <text data-label x="40" y={midY(160) - 8}>Q</text>
          <text data-label x="280" y={midY(30) - 8}>ω, θ</text>
          <text data-label x="280" y={midY(160) - 8}>E</text>
          <text data-label x="572" y={midY(95) - 8}>v*</text>
          <text data-label x="572" y={midY(95) + 18}>i*</text>
          <text data-label x="796" y={midY(95) - 8}>m</text>
          <text data-label x="825" y="226">i</text>
        </g>
      </g>

      {/* narrow container: larger text, shorter labels, so it stays near 10px on screen */}
      <g className="@[720px]:hidden">
        <g fontFamily={MONO} fontSize="32" textAnchor="middle">
          {blocks.map((block) => (
            <text
              key={block.id}
              data-label
              x={block.x + W / 2}
              y={block.y + H / 2 + 10}
              fill={block.id === highlight ? ACCENT : "currentColor"}
            >
              {short[block.id]}
            </text>
          ))}
        </g>

        <g fontFamily={MONO} fontSize="30" fill="var(--muted)">
          <text data-label x="40" y={midY(30) - 10}>P</text>
          <text data-label x="40" y={midY(160) - 10}>Q</text>
          <text data-label x="272" y={midY(30) - 10}>ω,θ</text>
          <text data-label x="280" y={midY(160) - 10}>E</text>
          <text data-label x="572" y={midY(95) - 10}>v*</text>
          <text data-label x="572" y={midY(95) + 34}>i*</text>
          <text data-label x="790" y={midY(95) - 10}>m</text>
          <text data-label x="826" y="222">i</text>
        </g>
      </g>
    </svg>
    </div>
  );
}
