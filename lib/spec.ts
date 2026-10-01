import { specs, type Spec } from "@/content/specs";

const byId = new Map(specs.map((item) => [item.id, item]));

export function spec(id: string): Spec {
  const found = byId.get(id);
  if (!found) throw new Error(`Missing spec ${id}`);
  return found;
}

/** Value and unit as separate strings. Unit is "" when the value already carries it. */
export function parts(id: string) {
  const { value, unit } = spec(id);
  if (!unit || unit.includes(",") || value.includes(unit)) return { value, unit: "" };
  return { value, unit };
}

/** Inline figure for prose: "9,000 MW", "50°C", "100%". */
export function fig(id: string) {
  const { value, unit } = parts(id);
  if (!unit) return value;
  if (unit === "°C" || unit === "%") return `${value}${unit}`;
  return `${value} ${unit}`;
}
