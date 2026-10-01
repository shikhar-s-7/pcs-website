type SpecTableProps = {
  caption: string;
  rows: { key: string; label: string; value: string }[];
  note?: string;
  /** Mono on the label side, sans on the value side. For standards lists. */
  reference?: boolean;
};

export function SpecTable({ caption, rows, note, reference = false }: SpecTableProps) {
  return (
    <>
      <table className={reference ? "spec-table spec-table--reference" : "spec-table"}>
        <caption>{caption}</caption>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <th scope="row">{row.label}</th>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {note ? <p className="spec-note">{note}</p> : null}
    </>
  );
}
