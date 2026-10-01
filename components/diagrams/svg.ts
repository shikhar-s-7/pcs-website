/** Shared drawing rules for every diagram. */
export const MONO = "var(--font-ibm-plex-mono), ui-monospace, monospace";

export const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
  vectorEffect: "non-scaling-stroke",
} as const;

/** Accent tracks the ground: #ff4d00 on ink, #b83500 on paper. */
export const ACCENT = "var(--signal-text)";

/** Arrowhead for a horizontal or vertical line ending at (x, y). */
export function arrowHead(x: number, y: number, direction: "right" | "left" | "up" | "down") {
  const s = 5;
  switch (direction) {
    case "right":
      return `M${x - s},${y - s * 0.7} L${x},${y} L${x - s},${y + s * 0.7}`;
    case "left":
      return `M${x + s},${y - s * 0.7} L${x},${y} L${x + s},${y + s * 0.7}`;
    case "up":
      return `M${x - s * 0.7},${y + s} L${x},${y} L${x + s * 0.7},${y + s}`;
    case "down":
      return `M${x - s * 0.7},${y - s} L${x},${y} L${x + s * 0.7},${y - s}`;
  }
}
