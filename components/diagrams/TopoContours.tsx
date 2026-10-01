"use client";

import { useMemo, useRef } from "react";
import { useDrawOn } from "@/hooks/useReveal";

type Point = [number, number];

type TopoContoursProps = {
  /** Same seed, same terrain. */
  seed?: number;
  /** Contour count. */
  levels?: number;
  width?: number;
  height?: number;
  /** Set color through text-*; keep it low contrast. */
  className?: string;
  drawOn?: boolean;
  strokeWidth?: number;
  /** Every Nth contour is drawn 1.5x heavier. 0 = all equal. */
  emphasisEvery?: number;
};

/** mulberry32. Small, fast, deterministic. */
function random(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Value noise: random lattice, smoothstep between corners, three octaves. */
function terrain(seed: number) {
  const next = random(seed);
  const size = 16;
  const lattice = Array.from({ length: size * size }, next);
  const at = (x: number, y: number) =>
    lattice[(((y % size) + size) % size) * size + (((x % size) + size) % size)];
  const smooth = (t: number) => t * t * (3 - 2 * t);

  const noise = (x: number, y: number) => {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const tx = smooth(x - x0);
    const ty = smooth(y - y0);
    const top = at(x0, y0) * (1 - tx) + at(x0 + 1, y0) * tx;
    const bottom = at(x0, y0 + 1) * (1 - tx) + at(x0 + 1, y0 + 1) * tx;
    return top * (1 - ty) + bottom * ty;
  };

  return (x: number, y: number) =>
    noise(x, y) * 0.6 + noise(x * 2.1, y * 2.1) * 0.28 + noise(x * 4.3, y * 4.3) * 0.12;
}

const key = (point: Point) => `${point[0].toFixed(2)},${point[1].toFixed(2)}`;

/** Join loose segments into polylines so each draws as one stroke. */
function stitch(segments: [Point, Point][]) {
  const byEnd = new Map<string, number[]>();
  segments.forEach((segment, index) => {
    for (const point of segment) {
      const k = key(point);
      const list = byEnd.get(k);
      if (list) list.push(index);
      else byEnd.set(k, [index]);
    }
  });

  const used = new Uint8Array(segments.length);
  const lines: Point[][] = [];
  for (let i = 0; i < segments.length; i += 1) {
    if (used[i]) continue;
    used[i] = 1;
    const line: Point[] = [segments[i][0], segments[i][1]];
    for (const atEnd of [true, false]) {
      let tip = atEnd ? line[line.length - 1] : line[0];
      for (;;) {
        const next = byEnd.get(key(tip))?.find((index) => !used[index]);
        if (next === undefined) break;
        used[next] = 1;
        const [a, b] = segments[next];
        const far = key(a) === key(tip) ? b : a;
        if (atEnd) line.push(far);
        else line.unshift(far);
        tip = far;
      }
    }
    lines.push(line);
  }
  return lines;
}

/** Marching squares over a sampled field. Returns SVG path data, one per contour. */
function contours(seed: number, levels: number, width: number, height: number) {
  const field = terrain(seed);
  const cols = 72;
  const rows = Math.round((cols * height) / width);
  const cellW = width / cols;
  const cellH = height / rows;
  const scale = 3.2 / cols;

  const values: number[] = [];
  for (let r = 0; r <= rows; r += 1) {
    for (let c = 0; c <= cols; c += 1) values.push(field(c * scale, r * scale * (cellH / cellW)));
  }
  const v = (c: number, r: number) => values[r * (cols + 1) + c];
  const min = Math.min(...values);
  const max = Math.max(...values);

  const lerp = (c1: number, r1: number, c2: number, r2: number, level: number): Point => {
    const a = v(c1, r1);
    const b = v(c2, r2);
    const t = a === b ? 0.5 : (level - a) / (b - a);
    return [(c1 + (c2 - c1) * t) * cellW, (r1 + (r2 - r1) * t) * cellH];
  };

  const paths: string[] = [];
  for (let n = 1; n <= levels; n += 1) {
    const level = min + ((max - min) * n) / (levels + 1);
    const segments: [Point, Point][] = [];

    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const index =
          (v(c, r) > level ? 8 : 0) |
          (v(c + 1, r) > level ? 4 : 0) |
          (v(c + 1, r + 1) > level ? 2 : 0) |
          (v(c, r + 1) > level ? 1 : 0);
        if (index === 0 || index === 15) continue;

        const T = () => lerp(c, r, c + 1, r, level);
        const R = () => lerp(c + 1, r, c + 1, r + 1, level);
        const B = () => lerp(c, r + 1, c + 1, r + 1, level);
        const L = () => lerp(c, r, c, r + 1, level);

        switch (index) {
          case 1: case 14: segments.push([L(), B()]); break;
          case 2: case 13: segments.push([B(), R()]); break;
          case 3: case 12: segments.push([L(), R()]); break;
          case 4: case 11: segments.push([T(), R()]); break;
          case 6: case 9: segments.push([T(), B()]); break;
          case 7: case 8: segments.push([L(), T()]); break;
          case 5: segments.push([L(), T()], [B(), R()]); break;
          case 10: segments.push([T(), R()], [L(), B()]); break;
        }
      }
    }

    const d = stitch(segments)
      .filter((line) => line.length > 3)
      .map((line) =>
        line.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(""),
      )
      .join("");
    if (d) paths.push(d);
  }
  return paths;
}

/** Seeded terrain lines for backgrounds. Decorative, hidden from assistive tech. */
export function TopoContours({
  seed = 7,
  levels = 12,
  width = 1200,
  height = 800,
  className,
  drawOn = true,
  strokeWidth = 1,
  emphasisEvery = 0,
}: TopoContoursProps) {
  const ref = useRef<SVGSVGElement>(null);
  const paths = useMemo(() => contours(seed, levels, width, height), [seed, levels, width, height]);
  useDrawOn(ref, { duration: 0.9, staggerAmount: 0.6, start: "top 90%", enabled: drawOn });

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke">
        {paths.map((d, index) => (
          <path
            key={index}
            data-draw
            d={d}
            strokeWidth={emphasisEvery > 0 && (index + 1) % emphasisEvery === 0 ? strokeWidth * 1.5 : undefined}
          />
        ))}
      </g>
    </svg>
  );
}
