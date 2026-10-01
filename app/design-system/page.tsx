import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Frame } from "@/components/Frame";
import { SectionMark } from "@/components/SectionMark";
import { Wordmark } from "@/components/Wordmark";
import { specs, type Spec } from "@/content/specs";

export const metadata: Metadata = {
  title: "Design system",
};

const heroIds = ["hero-scr", "hero-ambient", "hero-block", "hero-mode"] as const;

const heroStats = heroIds.map((id) => {
  const spec = specs.find((item) => item.id === id);
  if (!spec) {
    throw new Error(`Missing spec ${id}`);
  }
  return spec;
});

const tableRows = specs.filter(
  (item) =>
    item.section === "PCS platform / preliminary design targets" &&
    item.id !== "pcs-table-note",
);

const tableNote = specs.find((item) => item.id === "pcs-table-note");

const swatches = [
  { name: "Ink", token: "--color-ink", hex: "#100f0c", className: "bg-ink" },
  { name: "Paper", token: "--color-paper", hex: "#f2eee6", className: "bg-paper" },
  { name: "Ash", token: "--color-ash", hex: "#c2bdb4", className: "bg-ash" },
  { name: "Stone", token: "--color-stone", hex: "#5c574f", className: "bg-stone" },
  { name: "Graphite", token: "--color-graphite", hex: "#3a3833", className: "bg-graphite" },
  { name: "Signal", token: "--color-signal", hex: "#ff4d00", className: "bg-signal" },
] as const;

function heroFigure(spec: Spec) {
  if (spec.unit === "°C" || spec.unit === "%") {
    return `${spec.value}${spec.unit}`;
  }
  if (spec.unit) {
    return `${spec.value} ${spec.unit}`;
  }
  return spec.value;
}

function Band({
  index,
  label,
  id,
  paper = false,
  children,
}: {
  index: string;
  label: string;
  id: string;
  paper?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className={paper ? "ground-paper" : undefined}>
      <Frame>
        <div className="hairline-t grid grid-cols-1 md:grid-cols-12">
          <div className="py-8 md:col-span-3 md:py-16">
            <SectionMark index={index} label={label} />
          </div>
          <div className="pb-16 md:col-span-9 md:py-16">{children}</div>
        </div>
      </Frame>
    </section>
  );
}

export default function DesignSystemPage() {
  return (
    <main>
      <header className="hairline-b">
        <Frame>
          <div className="flex items-center justify-between gap-6 py-5">
            <Wordmark />
            <SectionMark index="DS" label="REV 0.1" />
          </div>
        </Frame>
      </header>

      <Band index="01" label="TYPE" id="type">
        <p className="font-display text-display uppercase">
          Grid-forming is no longer optional in India.
        </p>
        <div className="mt-14 grid grid-cols-1 gap-y-10">
          <div>
            <p className="font-mono text-label text-muted uppercase">Display</p>
            <p className="font-display text-title mt-3 uppercase">
              ABCDEFGHIJKLMNOPQRSTUVWXYZ
              <span className="mt-1 block">0123456789</span>
            </p>
          </div>
          <div>
            <p className="font-mono text-label text-muted uppercase">Title</p>
            <p className="font-display text-title mt-3 uppercase">Three disciplines. One stack.</p>
          </div>
          <div>
            <p className="font-mono text-label text-muted uppercase">Heading</p>
            <p className="font-display text-heading mt-3 uppercase">Grid-forming PCS</p>
          </div>
          <div>
            <p className="font-mono text-label text-muted uppercase">Body</p>
            <p className="mt-3 max-w-[65ch]">
              Hardware, control firmware, and the evidence trail that regulators now require,
              developed together and validated on real power hardware before they touch a
              customer&apos;s battery.
            </p>
          </div>
          <div>
            <p className="font-mono text-label text-muted uppercase">Label / data</p>
            <p className="font-mono text-data mt-3">SCR 1.0</p>
          </div>
          <div>
            <p className="font-mono text-label text-muted uppercase">Wordmark</p>
            <Wordmark className="mt-4 h-14 w-auto" />
          </div>
        </div>
      </Band>

      <Band index="02" label="COLOR" id="color">
        <ul className="grid grid-cols-2 gap-px md:grid-cols-6">
          {swatches.map((swatch) => (
            <li key={swatch.token}>
              <div className={`hairline h-20 ${swatch.className}`} />
              <p className="font-mono text-label mt-3 uppercase">{swatch.name}</p>
              <p className="font-mono text-label text-muted mt-1 uppercase">{swatch.hex}</p>
            </li>
          ))}
        </ul>
      </Band>

      <Band index="03" label="BUTTONS" id="buttons">
        <div className="flex flex-wrap items-center gap-4">
          <button type="button" className="btn btn-signal">
            Send enquiry
          </button>
          <button type="button" className="btn btn-line">
            Explore capabilities
          </button>
        </div>
      </Band>

      <Band index="04" label="LINKS" id="links">
        <p className="max-w-[65ch]">
          EMT models, hardware-in-the-loop validation, and witnessed test protocols mapped to{" "}
          <a className="text-link" href="#spec">IEEE 1547.1</a>{", UL 1741 SB, and CEA's 2026 standards."}
        </p>
        <p className="mt-6">
          <a className="text-link font-mono text-label uppercase" href="#spec">
            View system -&gt;
          </a>
        </p>
      </Band>

      <Band index="05" label="RULES" id="rules">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="py-2 md:pr-8">
            <p className="font-mono text-label text-muted uppercase">Horizontal / 1px</p>
            <div className="hairline-t mt-8" />
          </div>
          <div className="mt-8 py-2 md:mt-0 md:hairline-l md:pl-8">
            <p className="font-mono text-label text-muted uppercase">Vertical / 1px</p>
          </div>
        </div>
      </Band>

      <Band index="06" label="SPEC" id="spec" paper>
        <table className="spec-table w-full border-collapse text-left">
          <caption className="hairline-b py-3 text-left font-mono text-small tracking-normal">
            PCS platform / preliminary design targets
          </caption>
          <tbody>
            {tableRows.map((row) => (
              <tr key={row.id} className="hairline-b">
                <th scope="row" className="text-muted py-3 pr-6 text-left text-small font-normal">
                  {row.label}
                </th>
                <td className="py-3 font-mono text-small">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {tableNote ? (
          <p className="mt-4 max-w-[65ch] font-mono text-small tracking-normal text-muted">
            {tableNote.value}
          </p>
        ) : null}
      </Band>

      <Band index="07" label="STATS" id="stats">
        <ul className="grid grid-cols-1 md:grid-cols-4">
          {heroStats.map((spec) => (
            <li
              key={spec.id}
              className="hairline-b py-6 md:border-b-0 md:hairline-r md:px-5 md:first:pl-0 md:last:border-r-0"
            >
              <p className="font-mono text-data">{heroFigure(spec)}</p>
              <p className="mt-3 font-mono text-small tracking-normal text-muted">{spec.label}</p>
            </li>
          ))}
        </ul>
      </Band>

      <Band index="08" label="INDEX" id="index">
        <div className="grid grid-cols-1 gap-y-4">
          <SectionMark index="01" label="TYPE" />
          <SectionMark index="02" label="COLOR" />
          <SectionMark index="06" label="SPEC" />
          <p className="font-display text-title mt-8 uppercase">08 / INDEX</p>
        </div>
      </Band>

      <Band index="09" label="FIELDS" id="fields" paper>
        <form className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
          <label className="field">
            <span>
              Name <span className="text-signal">*</span>
            </span>
            <input name="name" type="text" autoComplete="name" required />
          </label>
          <label className="field">
            <span>
              Work email <span className="text-signal">*</span>
            </span>
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label className="field md:col-span-2">
            <span>
              Interest <span className="text-signal">*</span>
            </span>
            <select name="interest" required defaultValue="">
              <option value="" disabled>
                Select one
              </option>
              <option>Grid-forming PCS (100 kW - 5 MW)</option>
              <option>Compliance & validation (EMT / HIL / witness tests)</option>
              <option>Dispatch & asset management software</option>
              <option>Integrated project (multiple)</option>
              <option>Other</option>
            </select>
          </label>
          <label className="field md:col-span-2">
            <span>
              Project details <span className="text-signal">*</span>
            </span>
            <textarea
              name="message"
              required
              placeholder="Site location, grid connection voltage, timeline, tender or compliance driver"
            />
          </label>
          <div className="md:col-span-2">
            <button type="button" className="btn btn-signal">
              Send enquiry
            </button>
          </div>
        </form>
      </Band>
    </main>
  );
}
