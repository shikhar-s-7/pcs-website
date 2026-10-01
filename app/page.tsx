import type { Spec } from "@/content/specs";
import { specs } from "@/content/specs";
import { BusSimulation } from "@/components/BusSimulation";
import { Frame } from "@/components/Frame";

const heroIds = ["hero-scr", "hero-ambient", "hero-block", "hero-mode"] as const;

const heroStats = heroIds.map((id) => {
  const spec = specs.find((item) => item.id === id);
  if (!spec) throw new Error(`Missing spec ${id}`);
  return spec;
});

function shown(spec: Spec) {
  if (spec.unit === "°C" || spec.unit === "%") return `${spec.value}${spec.unit}`;
  if (spec.unit) return `${spec.value} ${spec.unit}`;
  return spec.value;
}

const mark = "pointer-events-none absolute h-2.5 w-2.5 border-signal";

export default function Home() {
  return (
    <main id="content" tabIndex={-1}>
      <section className="ground-ink relative flex min-h-[calc(100dvh-var(--header-h))] flex-col">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full text-ash opacity-20"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <g fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M80,520 C220,470 300,610 460,540 C640,460 700,320 900,380 C1040,420 1120,300 1280,340" />
            <path d="M-40,460 C140,400 260,560 420,490 C600,410 720,280 940,330 C1080,360 1160,250 1300,290" />
            <path d="M40,600 C200,540 340,700 520,620 C700,540 780,400 980,450 C1100,480 1200,390 1360,420" />
            <path d="M200,180 C320,140 380,240 520,200 C680,150 760,80 960,120 C1080,140 1160,60 1320,90" />
            <path d="M120,240 C260,190 360,300 540,250 C720,200 800,120 1000,160" />
            <path d="M640,640 C760,600 840,720 980,670 C1100,630 1180,700 1320,660" />
          </g>
        </svg>
        <span className={`${mark} top-3 left-3 border-t border-l`} />
        <span className={`${mark} top-3 right-3 border-t border-r`} />
        <span className={`${mark} bottom-3 left-3 border-b border-l`} />
        <span className={`${mark} right-3 bottom-3 border-r border-b`} />

        <div className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-1 items-center px-5 py-8 md:px-8 md:py-10">
          <div className="grid w-full grid-cols-1 items-center gap-10 md:grid-cols-12">
            <div className="md:col-span-6">
              <h1 className="font-display text-display uppercase">
                The grid is losing its machines. We build what replaces them.
              </h1>
              <p className="mt-6 max-w-[46ch] text-small text-muted">
                Dhruvir engineers grid-forming power conversion systems, compliance validation,
                and dispatch software for battery energy storage, built for weak grids, extreme
                heat, and the regulations that now demand both.
              </p>
            </div>
            <div className="md:col-span-6">
              <BusSimulation />
            </div>
          </div>
        </div>
      </section>

      <section className="hairline-t">
        <Frame>
          <ul className="grid grid-cols-1 md:grid-cols-4">
            {heroStats.map((spec) => (
              <li
                key={spec.id}
                className="hairline-b py-6 md:border-b-0 md:hairline-r md:px-5 md:first:pl-0 md:last:border-r-0"
              >
                <p className="font-mono text-data">{shown(spec)}</p>
                <p className="mt-3 font-mono text-small tracking-normal text-muted">{spec.label}</p>
              </li>
            ))}
          </ul>
        </Frame>
      </section>
    </main>
  );
}
