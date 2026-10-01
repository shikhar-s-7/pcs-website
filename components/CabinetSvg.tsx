const COS = Math.cos(Math.PI / 6);
const SIN = Math.sin(Math.PI / 6);

function iso(x: number, y: number, z: number): [number, number] {
  return [(x - z) * COS, (x + z) * SIN - y];
}

function points(corners: [number, number, number][]) {
  return corners.map(([x, y, z]) => iso(x, y, z).map((n) => n.toFixed(1)).join(",")).join(" ");
}

function IsoBox({
  origin,
  size,
  accent = false,
}: {
  origin: [number, number, number];
  size: [number, number, number];
  accent?: boolean;
}) {
  const [x, y, z] = origin;
  const [w, h, d] = size;
  const front: [number, number, number][] = [
    [x, y, z + d],
    [x + w, y, z + d],
    [x + w, y + h, z + d],
    [x, y + h, z + d],
  ];
  const side: [number, number, number][] = [
    [x + w, y, z],
    [x + w, y, z + d],
    [x + w, y + h, z + d],
    [x + w, y + h, z],
  ];
  const top: [number, number, number][] = [
    [x, y + h, z],
    [x + w, y + h, z],
    [x + w, y + h, z + d],
    [x, y + h, z + d],
  ];
  const stroke = accent ? "#ff4d00" : "#c2bdb4";
  return (
    <g fill="#141311" stroke={stroke} strokeWidth="1">
      <polygon points={points(top)} />
      <polygon points={points(side)} />
      <polygon points={points(front)} />
    </g>
  );
}

const parts: { label: string; origin: [number, number, number]; size: [number, number, number]; y: number }[] = [
  { label: "DC input", origin: [0, 210, 0], size: [90, 28, 40], y: 28 },
  { label: "Converter stage", origin: [8, 150, 4], size: [74, 48, 32], y: 78 },
  { label: "LCL filter", origin: [12, 96, 6], size: [66, 36, 28], y: 128 },
  { label: "Control board", origin: [6, 58, 2], size: [78, 16, 36], y: 178 },
  { label: "AC output", origin: [0, 8, 0], size: [90, 32, 40], y: 228 },
];

/** Static isometric stand-in. Same five subassemblies, no motion. */
export function CabinetSvg() {
  return (
    <figure className="relative mx-auto flex h-full w-full max-w-[90rem] flex-col px-5 py-6 md:px-8">
      <figcaption className="font-mono text-label text-muted">CONCEPT RENDER</figcaption>
      <svg viewBox="0 0 640 320" className="mt-4 min-h-0 w-full flex-1" role="img" aria-label="Conceptual PCS cabinet">
        {parts.map((part) => (
          <IsoBox key={part.label} origin={part.origin} size={part.size} accent={part.label === "Converter stage"} />
        ))}
        {parts.map((part) => {
          const [x, y] = iso(part.origin[0] + part.size[0], part.origin[1] + part.size[1] / 2, part.origin[2]);
          return (
            <g key={part.label} stroke="#c2bdb4" fill="#c2bdb4">
              <line x1={x + 220} y1={y + 20} x2={430} y2={part.y} strokeWidth="1" />
              <text x={438} y={part.y + 4} fill="#e9e5db" stroke="none" fontFamily="ui-monospace, monospace" fontSize="12">
                {part.label}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
