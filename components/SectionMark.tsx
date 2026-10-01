type SectionMarkProps = {
  index: string;
  label: string;
};

/** "01 / TECHNOLOGY". Numeral carries the accent; the label stays quiet. */
export function SectionMark({ index, label }: SectionMarkProps) {
  return (
    <p className="font-mono text-label text-muted uppercase">
      <span className="text-signal-text">{index}</span>
      <span> / {label}</span>
    </p>
  );
}
