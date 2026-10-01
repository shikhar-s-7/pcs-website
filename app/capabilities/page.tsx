import type { Metadata } from "next";
import Link from "next/link";
import { ControlBlockDiagram, SingleLineDiagram, TopoContours } from "@/components/diagrams";
import { Frame } from "@/components/Frame";
import { ImageSlot } from "@/components/ImageSlot";
import { RowList } from "@/components/RowList";
import { Section, SectionTitle } from "@/components/Section";
import { SectionMark } from "@/components/SectionMark";
import { SpecTable } from "@/components/SpecTable";
import { StatRow, type Stat } from "@/components/StatRow";
import { specs } from "@/content/specs";
import { fig, parts, spec } from "@/lib/spec";

export const metadata: Metadata = {
  title: "Capabilities",
  description: `Grid-forming PCS hardware, compliance validation, and dispatch software for battery energy storage. Modular ${fig("pcs-block")} blocks, VSG control, HIL-validated, engineered for weak grids and ${fig("cap-meta-ambient")} ambients.`,
};

const TABLE = "PCS platform / preliminary design targets";

const tableRows = specs
  .filter((item) => item.section === TABLE && item.id !== "pcs-table-note")
  .map((item) => ({ key: item.id, label: item.label, value: item.value }));

const pcsStats: Stat[] = [
  { ...parts("pcs-block"), label: spec("pcs-table-block").label },
  { ...parts("pcs-table-efficiency"), label: spec("pcs-table-efficiency").label },
  { ...parts("pcs-table-scr"), label: spec("pcs-table-scr").label },
];

const pcsFeatures = [
  {
    index: "01",
    title: "Synthetic inertia & damping",
    body: "Adjustable inertia constant and power oscillation damping, tuned per site.",
  },
  {
    index: "02",
    title: "Black start",
    body: "Energizes a dead bus, including transformer inrush, without external supply.",
  },
  {
    index: "03",
    title: "GFM / GFL transition",
    body: "Seamless mode transition on grid events, with islanded voltage-source operation.",
  },
  {
    index: "04",
    title: "Weak-grid stability",
    body: `Control stability designed and tested down to ${fig("pcs-scr")}, where most GFM claims assume ${fig("pcs-scr-assumed")}.`,
  },
  {
    index: "05",
    title: "Fault ride-through",
    body: "Voltage and frequency ride-through windows matched to the Indian Grid Code.",
  },
  {
    index: "06",
    title: "Phase-jump immunity",
    body: "Rides through the phase jumps that trip grid-following fleets in weak pockets.",
  },
];

const labWork = [
  {
    index: "01",
    title: "EMT models",
    body: "PSCAD / EMT-type and PSSE models delivered with every project, ready for utility study submission.",
  },
  {
    index: "02",
    title: "HIL validation",
    body: "Real-time simulator testing of control firmware against fault, weak-grid, and islanding scenarios.",
  },
  {
    index: "03",
    title: "Witnessed commissioning tests",
    body: "GFM, black start, and ride-through demonstrated at site, documented for the load despatch centre.",
  },
  {
    index: "04",
    title: "Periodic re-verification",
    body: "Retainer-based re-testing and reporting as regulations finalize and audits begin.",
  },
];

const dispatchWork = [
  {
    index: "01",
    title: "Dispatch optimization",
    body: "TOD tariffs, day-ahead and real-time prices, DSM penalty avoidance, demand-charge shaving.",
  },
  {
    index: "02",
    title: "Asset management",
    body: "SOH and degradation analytics, warranty-compliance telemetry, alarm triage, availability reporting.",
  },
  {
    index: "03",
    title: "Vendor-neutral",
    body: "Multi-OEM monitoring and control over Modbus TCP and IEC 60870-5-104. No hardware lock-in.",
  },
  {
    index: "04",
    title: "Aggregation-ready",
    body: "Fleet pooling for ancillary and discom flexibility products as those markets open.",
  },
];

const segments = [
  {
    index: "01",
    title: "C&I battery storage",
    body: `${fig("app-ci-from")} to ${fig("app-ci-to")} behind-the-meter systems needing tariff optimization, backup, and GFM compliance without utility-scale budgets.`,
  },
  {
    index: "02",
    title: "EV charging hubs",
    body: "Storage-buffered fast charging where grid connections are weak and demand charges are punishing.",
  },
  {
    index: "03",
    title: "Solar-plus-storage",
    body: `Co-located storage meeting the mandatory-storage and GFM clauses of the ${fig("app-solar-year")} connectivity framework.`,
  },
  {
    index: "04",
    title: "Weak-grid RE plants",
    body: `Renewable sites in low-SCR pockets facing the ${fig("app-re-share")} grid-forming quota from ${fig("app-re-date")}.`,
  },
  {
    index: "05",
    title: "Microgrids & islands",
    body: "Voltage-source operation, black start, and seamless transition for industrial microgrids and islanded systems.",
  },
  {
    index: "06",
    title: "BESS integrators",
    body: "Certified GFM control firmware and compliance evidence for integrators assembling containers from imported cells.",
  },
];

const jump = [
  { href: "#pcs", index: "01", label: "Grid-forming power conversion" },
  { href: "#compliance", index: "02", label: "Compliance & validation lab" },
  { href: "#dispatch", index: "03", label: "Dispatch & asset management" },
];

export default function CapabilitiesPage() {
  return (
    <main id="content" tabIndex={-1}>
      <section id="overview" className="ground-ink relative">
        <TopoContours
          seed={23}
          levels={10}
          className="pointer-events-none absolute inset-0 h-full w-full text-ash opacity-15"
        />
        <Frame>
          <div className="relative grid grid-cols-1 gap-y-6 py-10 md:grid-cols-12 md:gap-x-8 md:gap-y-10 md:py-24">
            <div className="md:col-span-3">
              <SectionMark index="00" label="Engineering capability" />
            </div>
            <div className="md:col-span-9">
              <h1 data-reveal="heading" className="font-display text-display max-w-[16ch] uppercase">
                Hardware, controls, and evidence. Built as one system.
              </h1>
              <p className="mt-8 max-w-[58ch]">
                Grid-forming conversion hardware, the firmware that makes it behave like a machine,
                and the validation trail that proves it to a regulator. Each is engineered against
                the others.
              </p>
              <ol className="hairline-t mt-12 grid grid-cols-1 md:grid-cols-3">
                {jump.map((item) => (
                  <li
                    key={item.href}
                    className="hairline-b md:border-b-0 md:hairline-r md:px-4 md:first:pl-0 md:last:border-r-0"
                  >
                    <a href={item.href} className="nav-link block py-4">
                      <span className="text-signal-text">{item.index}</span> / {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Frame>
      </section>

      <div id="capabilities">
        <Section id="pcs" index="01" label="PCS">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-9">
            <div className="grid gap-5 lg:col-span-5">
              <SectionTitle>Grid-forming power conversion</SectionTitle>
              <p className="mt-3">
                Our PCS line is a modular {fig("pcs-block")} building block that parallels into
                systems from {fig("pcs-range-from")} to {fig("pcs-range-to")}, sized for the C&amp;I
                and small-utility segment that imported OEMs do not engineer for. At its core is a
                virtual synchronous generator (VSG) control stack: the converter emulates the swing
                equation of a synchronous machine, delivering synthetic inertia and damping instead
                of merely following the grid&apos;s phase.
              </p>
              <p>
                The result is a converter that forms the grid where there is none, stabilizes it
                where it is weak, and transitions between grid-forming and grid-following operation
                without a bump in output.
              </p>
              <Link href="/technology" className="text-link mt-2 font-mono text-label uppercase">
                Swing equation / concept render -&gt;
              </Link>
            </div>
            <figure className="lg:col-span-4 lg:mt-20">
              <ControlBlockDiagram highlight="pf" className="hairline h-auto w-full" />
              <figcaption className="mt-3 font-mono text-label text-muted uppercase">
                VSG control / schematic
              </figcaption>
            </figure>
          </div>

          <div className="mt-16">
            <RowList rows={pcsFeatures} />
          </div>

          <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-9">
            <div className="lg:col-span-9">
              <StatRow stats={pcsStats} />
            </div>
            <div className="lg:col-span-7 lg:col-start-3">
              <SpecTable caption={TABLE} rows={tableRows} note={spec("pcs-table-note").value} />
            </div>
          </div>
        </Section>

        <Section id="compliance" index="02" label="Compliance" ground="paper">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-9">
            <figure className="lg:col-span-4">
              <SingleLineDiagram highlight="pcs" className="hairline h-auto w-full" />
              <figcaption className="mt-3">
                <span className="block font-mono text-label uppercase">
                  Hardware under test / single-line
                </span>
                <span className="mt-1 block text-small text-muted">
                  Control strategies proven on iron before they touch a battery
                </span>
              </figcaption>
            </figure>
            <div className="grid content-start gap-5 lg:col-span-5">
              <SectionTitle>Compliance & validation lab</SectionTitle>
              <p className="mt-3">
                The {fig("compliance-year")} draft regulations make evidence the customer&apos;s
                actual problem: EMT studies at design stage, demonstrated GFM and black start at
                commissioning, periodic re-verification by load despatch centres. Our lab exists to
                produce that evidence, for our hardware and for anyone else&apos;s.
              </p>
              <p>
                Controls are validated on a hardware-in-the-loop bench against a real-time grid model
                before any site visit. When the dispatch layer or a PCS unit ships, its behavior under
                faults, weak grids, and islanding has already been measured, not simulated in the
                marketing sense.
              </p>
            </div>
          </div>
          <div className="mt-16">
            <RowList rows={labWork} />
          </div>
        </Section>

        <Section id="dispatch" index="03" label="Dispatch">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-9">
            <div className="grid gap-5 lg:col-span-5">
              <SectionTitle>Dispatch & asset management</SectionTitle>
              <p className="mt-3">
                India has built the price signal for storage and almost none of the software to
                capture it. Our dispatch layer re-solves charge and discharge per site, daily,
                against time-of-day tariffs, exchange prices, demand charges, and degradation cost.
                The asset-management layer underneath it tracks state of health, warranty
                compliance, and availability, the monthly discipline asset owners actually pay for.
              </p>
              <p>
                The differentiator is the lab: dispatch and GFM-compliant control strategies are
                validated on real power hardware before deployment, so the control warranty we sign
                is backed by measurement.
              </p>
            </div>
            <ImageSlot
              className="lg:col-span-4 lg:mt-20"
              aspect="16/10"
              alt="Dispatch and asset management dashboard"
              caption="Fleet dispatch console"
              detail="Price-aware scheduling across distributed sites"
              status="SCREENSHOT PENDING"
            />
          </div>
          <div className="mt-16">
            <RowList rows={dispatchWork} />
          </div>
        </Section>
      </div>

      <Section index="04" label="Where it deploys" ground="paper">
        <SectionTitle>Built for the segments imports ignore.</SectionTitle>
        <div className="mt-12">
          <RowList rows={segments} />
        </div>
      </Section>

      <Section index="05" label="Start a project">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-9">
          <h2 data-reveal="lines" className="font-display text-display uppercase lg:col-span-6">
            Bring us the grid problem your current vendor can&apos;t solve.
          </h2>
          <div className="lg:col-span-3 lg:self-end">
            <p>
              PCS supply, compliance evidence, or dispatch software. One engineering team,{" "}
              {fig("cap-response")} response.
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
