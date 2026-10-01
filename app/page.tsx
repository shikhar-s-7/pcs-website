import type { Metadata } from "next";
import Link from "next/link";
import { BusSimulation } from "@/components/BusSimulation";
import { ControlBlockDiagram, SingleLineDiagram, TopoContours } from "@/components/diagrams";
import { Frame } from "@/components/Frame";
import { ImageSlot } from "@/components/ImageSlot";
import { RowList } from "@/components/RowList";
import { Section, SectionTitle } from "@/components/Section";
import { SpecTable } from "@/components/SpecTable";
import { StatRow, type Stat } from "@/components/StatRow";
import { brand } from "@/config/brand";
import { fig, parts, spec } from "@/lib/spec";

export const metadata: Metadata = {
  title: { absolute: `${brand.name} | Grid-Forming Power Conversion Systems` },
  description: `${brand.name} designs grid-forming power conversion systems, compliance validation, and dispatch software for battery energy storage. Engineered in India for the world's weakest grids.`,
};

const heroStats: Stat[] = ["hero-scr", "hero-ambient", "hero-block", "hero-mode"].map((id) => ({
  ...parts(id),
  label: spec(id).label,
}));

const clockStats: Stat[] = [
  {
    ...parts("stat-9000"),
    label: spec("stat-9000").label,
    detail: spec("stat-9000-detail").label,
    source: spec("stat-9000-source").value,
  },
  {
    ...parts("stat-100"),
    label: spec("stat-100").label,
    detail: spec("stat-100-detail-date").label,
    source: spec("stat-100-source").value,
  },
  {
    ...parts("stat-236"),
    label: spec("stat-236").label,
    detail: spec("stat-236-gw").label,
    source: spec("stat-236-source").value,
  },
  {
    ...parts("stat-2027"),
    label: spec("stat-2027").label,
    detail: `Draft Connectivity Regulations ${fig("draft-regs-year")}, plus mandatory co-located storage and EMT studies.`,
    source: spec("stat-2027-source").value,
  },
];

const clockTicks = [
  {
    index: "01",
    title: `${fig("tick-july-2026")}, CEA advisory.`,
    body: `${fig("tick-100")} grid-forming PCS mandated on all new BESS projects of ${fig("tick-50mw")} and above.`,
  },
  {
    index: "02",
    title: `Draft Connectivity Regulations ${fig("draft-regs-year")}.`,
    body: `Minimum ${fig("tick-15")} grid-forming inverters on new renewable plants from ${fig("tick-july-2027")}; all BESS PCS to be grid-forming; EMT studies at design stage.`,
  },
  {
    index: "03",
    title: "Commissioning evidence.",
    body: "Demonstrated GFM and black-start capability at commissioning, with periodic re-verification by load despatch centres.",
  },
  {
    index: "04",
    title: "Domestic supply gap.",
    body: "CEA has formally asked Indian manufacturers to declare GFM capacity. The mapping came back thin.",
  },
];

const pillars = [
  {
    index: "CAP / 01",
    title: "Grid-forming PCS",
    body: `Modular ${fig("pillar-block")} power conversion blocks paralleling to ${fig("pillar-parallel")}, running virtual synchronous generator control. Synthetic inertia, black start, and stable operation down to ${fig("pillar-scr")}.`,
    points: ["VSG control core", spec("pillar-dc").label, spec("pillar-ambient").label],
    link: { href: "/capabilities#pcs", label: "View system ->" },
  },
  {
    index: "CAP / 02",
    title: "Compliance & validation",
    body: `EMT models, hardware-in-the-loop validation, and witnessed test protocols mapped to IEEE 1547.1, UL 1741 SB, and CEA's ${fig("pillar-standards-year")} standards. The paperwork is the product.`,
    points: ["PSCAD / PSSE EMT models", "HIL-validated controls", "Commissioning witness tests"],
    link: { href: "/capabilities#compliance", label: "View lab ->" },
  },
  {
    index: "CAP / 03",
    title: "Dispatch & asset software",
    body: "A dispatch and asset-management layer for distributed BESS: tariff and market-price optimization, degradation analytics, and aggregation-ready fleet control.",
    points: ["IEX / TOD dispatch optimization", "SOH & warranty analytics", "VPP-ready aggregation"],
    link: { href: "/capabilities#dispatch", label: "View software ->" },
  },
];

const standards = [
  "std-ieee-1547",
  "std-ul-1741-sb",
  "std-cea-2026",
  "std-iegc",
  "std-iec-62116",
  "std-ieee-519",
  "std-iec-comms",
  "std-cpri",
].map((id) => ({ key: id, label: spec(id).value, value: spec(id).label }));

const mark = "pointer-events-none absolute h-2.5 w-2.5 border-signal";

export default function Home() {
  return (
    <main id="content" tabIndex={-1}>
      <section className="ground-ink relative flex min-h-[calc(100svh-var(--header-h))] flex-col">
        <TopoContours
          seed={11}
          strokeWidth={1.25}
          emphasisEvery={4}
          className="hero-topo pointer-events-none absolute inset-0 h-full w-full text-ash opacity-[0.16]"
        />
        <span className={`${mark} top-3 left-3 border-t border-l`} />
        <span className={`${mark} top-3 right-3 border-t border-r`} />
        <span className={`${mark} bottom-3 left-3 border-b border-l`} />
        <span className={`${mark} right-3 bottom-3 border-r border-b`} />

        <div className="gutter relative z-10 mx-auto flex w-full max-w-[90rem] flex-1 items-center py-8 md:py-10">
          <div className="grid w-full grid-cols-1 items-center gap-10 md:grid-cols-12">
            <div className="md:col-span-6">
              <p className="font-mono text-label text-muted uppercase">
                Grid-forming power electronics / India
              </p>
              <h1 data-reveal="heading" className="font-display text-display mt-6 uppercase">
                The grid is losing its machines. We build what replaces them.
              </h1>
              <p className="mt-6 max-w-[46ch] text-small text-muted">
                We engineer grid-forming power conversion systems, compliance validation, and
                dispatch software for battery energy storage, built for weak grids, extreme heat,
                and the regulations that now demand both.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link href="/enquiries" className="btn btn-signal">
                  Send an enquiry
                </Link>
                <Link href="/capabilities" className="text-link font-mono text-label uppercase">
                  Explore capabilities -&gt;
                </Link>
              </div>
              <p className="mt-5">
                <Link href="/technology" className="text-link font-mono text-label uppercase">
                  See how it behaves under load -&gt;
                </Link>
              </p>
            </div>
            <div className="md:col-span-6">
              <BusSimulation />
            </div>
          </div>
        </div>
      </section>

      <section className="ground-ink hairline-t">
        <Frame>
          <StatRow stats={heroStats} />
        </Frame>
      </section>

      <Section index="01" label="The regulatory clock">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-9">
          <div className="lg:col-span-4">
            <SectionTitle>Grid-forming is no longer optional in India.</SectionTitle>
          </div>
          <div className="grid gap-5 lg:col-span-5">
            <p>
              As inverter-based renewables replace synchronous machines, India&apos;s grid is losing
              inertia and short-circuit strength. The system has already paid for it: in{" "}
              {fig("khavda-date")}, a single {fig("khavda-voltage")} fault cascaded through the
              Khavda renewable zone and tripped {fig("khavda-mw")} of generation in{" "}
              {fig("khavda-seconds")}, while grid-following inverters injected reactive power into
              the fault.
            </p>
            <p>
              The regulatory response is now a forced-demand clock. The Central Electricity
              Authority requires {fig("cea-gfm-share")} grid-forming PCS on new BESS projects of{" "}
              {fig("cea-bess-threshold")} and above, and the draft Connectivity Regulations{" "}
              {fig("draft-regs-year")} extend GFM requirements to renewable plants from{" "}
              {fig("re-gfm-date")}, with EMT studies, demonstrated black start, and periodic
              re-verification.
            </p>
          </div>
        </div>

        <blockquote className="hairline-l mt-16 pl-6 md:ml-[33%]">
          <p className="font-display text-heading max-w-[34ch] uppercase md:text-[2rem] md:leading-[1]">
            Every serious grid-forming PCS operating in India today is imported. None is engineered
            or priced for Indian conditions.
          </p>
          <footer className="mt-4 font-mono text-label text-signal-text uppercase">
            The supply gap we are built to close
          </footer>
        </blockquote>

        <div className="mt-16">
          <RowList rows={clockTicks} />
        </div>
      </Section>

      <section className="ground-paper">
        <Frame>
          <div className="hairline-t py-4">
            <StatRow stats={clockStats} />
          </div>
        </Frame>
      </section>

      <Section index="02" label="What we build">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-9">
          <div className="lg:col-span-5">
            <SectionTitle>Three disciplines. One stack.</SectionTitle>
          </div>
          <p className="lg:col-span-4">
            Hardware, control firmware, and the evidence trail that regulators now require,
            developed together and validated on real power hardware before they touch a
            customer&apos;s battery.
          </p>
        </div>

        <figure className="mt-14">
          <SingleLineDiagram highlight="pcs" className="hairline h-auto w-full" />
          <figcaption className="mt-3 font-mono text-label text-muted uppercase">
            Single-line / schematic
          </figcaption>
        </figure>

        <ol className="hairline-t mt-14">
          {pillars.map((pillar) => (
            <li
              key={pillar.index}
              className="hairline-b grid grid-cols-1 gap-y-4 py-8 md:grid-cols-12 md:gap-x-6"
            >
              <span className="pt-2 font-mono text-label text-muted md:col-span-2">
                {pillar.index}
              </span>
              <h3 className="font-display text-title uppercase md:col-span-4">{pillar.title}</h3>
              <div className="md:col-span-6">
                <p>{pillar.body}</p>
                <ul className="mt-5 grid gap-1.5 font-mono text-label uppercase">
                  {pillar.points.map((point) => (
                    <li key={point} className="text-muted">
                      — {point}
                    </li>
                  ))}
                </ul>
                <Link
                  href={pillar.link.href}
                  className="text-link mt-6 inline-block font-mono text-label uppercase"
                >
                  {pillar.link.label}
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section index="03" label="Engineered for Indian conditions" ground="paper">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-9">
          <div className="lg:col-span-5">
            <SectionTitle>Imported hardware assumes a grid India doesn&apos;t have.</SectionTitle>
            <div className="mt-8 grid gap-5">
              <p>
                Global PCS platforms are designed around stiff grids, temperate climates, and
                utility buyers with deep commissioning budgets. Indian reality is different:{" "}
                {fig("india-ambient-range")} ambients, dust ingress, weak-grid sites in the
                Rajasthan and Gujarat renewable zones, and erratic frequency.
              </p>
              <p>
                Our design baseline starts where imported datasheets end. Full power at{" "}
                {fig("india-full-power")}, {fig("india-ip")}-sealed enclosures with conformal-coated
                boards, and control stability proven at a short-circuit ratio of {fig("india-scr")},
                not the SCR of {fig("india-scr-assumed")} that most GFM claims quietly assume.
              </p>
            </div>
          </div>
          <figure className="lg:col-span-4 lg:mt-24">
            <ControlBlockDiagram highlight="current" className="hairline h-auto w-full" />
            <figcaption className="mt-3">
              <span className="block font-mono text-label uppercase">Control stack / schematic</span>
              <span className="mt-1 block text-small text-muted">
                Control firmware proven on real power hardware
              </span>
            </figcaption>
          </figure>
        </div>
      </Section>

      <Section index="04" label="Standards & compliance">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-9">
          <div className="lg:col-span-5">
            <SectionTitle>Designed against the standards, documented for the auditor.</SectionTitle>
          </div>
          <p className="lg:col-span-4">
            Every design decision is traceable to a clause. Every unit of evidence ships with the
            model and the test report behind it.
          </p>
        </div>
        <div className="mt-14">
          <SpecTable caption="Standards & compliance" rows={standards} reference />
        </div>
      </Section>

      <Section index="05" label="Work with us">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-9">
          <h2 data-reveal="lines" className="font-display text-display uppercase lg:col-span-6">
            Planning a BESS project the new rules apply to?
          </h2>
          <div className="lg:col-span-3 lg:self-end">
            <p>
              Tell us about your site, capacity, and grid connection. Our engineering team responds
              to every enquiry within {fig("overview-response")}.
            </p>
            <Link href="/enquiries" className="btn btn-signal mt-8">
              Send an enquiry -&gt;
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
