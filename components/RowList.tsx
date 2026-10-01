import type { ReactNode } from "react";

export type Row = {
  index: string;
  title: ReactNode;
  body?: ReactNode;
};

/** Numbered hairline rows. Index, title, body on a 2/4/6 split. */
export function RowList({ rows }: { rows: Row[] }) {
  return (
    <ol className="hairline-t">
      {rows.map((row) => (
        <li
          key={row.index}
          className="hairline-b grid grid-cols-1 gap-y-2 py-5 md:grid-cols-12 md:gap-x-6"
        >
          <span className="pt-1 font-mono text-label text-muted md:col-span-2">{row.index}</span>
          <p className="font-display text-heading uppercase md:col-span-4">{row.title}</p>
          {row.body ? <p className="text-small text-muted md:col-span-6">{row.body}</p> : null}
        </li>
      ))}
    </ol>
  );
}
