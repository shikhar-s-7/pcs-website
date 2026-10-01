export type Stat = {
  value: string;
  unit?: string;
  label: string;
  detail?: string;
  source?: string;
};

const columns = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
} as const;

/** Big mono figure, unit set smaller beside it, then label, detail, source. 2 columns below md. */
export function StatRow({ stats }: { stats: Stat[] }) {
  const count = Math.min(Math.max(stats.length, 2), 4) as keyof typeof columns;
  return (
    <ul className={`grid grid-cols-2 ${columns[count]}`}>
      {stats.map((stat) => (
        <li
          key={`${stat.value}-${stat.label}`}
          className="hairline-b flex min-w-0 flex-col py-6 max-md:odd:hairline-r max-md:odd:pr-4 max-md:even:pl-4 md:border-b-0 md:hairline-r md:px-6 md:py-8 md:first:pl-0 md:last:border-r-0"
        >
          <p
            className={`font-mono break-words ${stat.value.length > 6 ? "text-stat-long" : "text-stat"}`}
          >
            <span data-count={stat.value}>{stat.value}</span>
            {stat.unit ? (
              <span className="text-heading tracking-normal">
                {stat.unit === "°C" || stat.unit === "%" ? stat.unit : ` ${stat.unit}`}
              </span>
            ) : null}
          </p>
          <p className="mt-3 font-mono text-label uppercase md:mt-4">{stat.label}</p>
          {stat.detail ? <p className="mt-3 max-w-[38ch] text-small text-muted">{stat.detail}</p> : null}
          {stat.source ? (
            <p className="mt-auto pt-5 font-mono text-label text-muted uppercase">{stat.source}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
