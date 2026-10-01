import { brand } from "@/config/brand";

type WordmarkProps = {
  className?: string;
};

/**
 * Type-only lockup. Width follows the strings, so a longer name
 * does not need a new viewBox. Both lines share one measure.
 */
export function Wordmark({ className = "h-8 w-auto" }: WordmarkProps) {
  const nameUnit = 19;
  const tagUnit = 7.2;
  const pad = 1;
  const inner = Math.ceil(
    Math.max(brand.shortName.length * nameUnit, brand.tagline.length * tagUnit, 64),
  );
  const height = 52;
  const label = `${brand.shortName} ${brand.tagline}`;

  return (
    <svg
      viewBox={`0 0 ${inner + pad * 2} ${height}`}
      role="img"
      aria-label={label}
      className={className}
    >
      <text
        x={pad}
        y={33}
        fill="currentColor"
        textLength={inner}
        lengthAdjust="spacing"
        fontFamily="var(--font-barlow-condensed), 'Arial Narrow', sans-serif"
        fontSize="36"
        fontWeight="500"
        aria-hidden="true"
      >
        {brand.shortName}
      </text>
      <text
        x={pad}
        y={47}
        fill="currentColor"
        textLength={inner}
        lengthAdjust="spacing"
        fontFamily="var(--font-ibm-plex-mono), ui-monospace, monospace"
        fontSize="8"
        fontWeight="400"
        aria-hidden="true"
      >
        {brand.tagline}
      </text>
    </svg>
  );
}
