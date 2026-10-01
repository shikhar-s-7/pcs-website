import type { Metadata } from "next";
import { TopoContours } from "@/components/diagrams";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Frame } from "@/components/Frame";
import { Section } from "@/components/Section";
import { SectionMark } from "@/components/SectionMark";
import { brand } from "@/config/brand";
import { fig, spec } from "@/lib/spec";

export const metadata: Metadata = {
  title: "Enquiries",
  description: `Send a project enquiry to ${brand.name}: grid-forming PCS, compliance validation, and dispatch software for battery energy storage in India.`,
};

const details = [
  {
    label: spec("enq-response-row").label,
    value: spec("enq-response-row").value,
    note: "Every enquiry is read by engineering, not a sales queue.",
  },
  {
    label: "Location",
    value: "Bengaluru, India",
    note: "Site work across India.",
  },
  {
    label: "Scope",
    value: "Grid-forming PCS / Compliance validation / Dispatch software",
    note: `${fig("enq-scope-from")} to ${fig("enq-scope-to")} systems, C&I to small utility.`,
  },
];

export default function EnquiriesPage() {
  return (
    <main id="content" tabIndex={-1}>
      <section className="ground-ink relative">
        <TopoContours
          seed={5}
          levels={9}
          className="pointer-events-none absolute inset-0 h-full w-full text-ash opacity-15"
        />
        <Frame>
          <div className="relative grid grid-cols-1 gap-y-6 py-10 md:grid-cols-12 md:gap-x-8 md:gap-y-10 md:py-24">
            <div className="md:col-span-3">
              <SectionMark index="00" label="Contact" />
            </div>
            <div className="md:col-span-9">
              <h1
                data-reveal="heading"
                className="font-display text-display max-w-[14ch] uppercase"
              >
                Tell us about your project.
              </h1>
              <p className="mt-8 max-w-[58ch]">
                PCS supply, compliance evidence, or dispatch software. Share the site, the capacity,
                and the grid connection, and engineering responds within {fig("enq-response")}.
              </p>
            </div>
          </div>
        </Frame>
      </section>

      <Section index="01" label="Project enquiry" ground="paper">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-9">
          <dl className="hairline-t content-start lg:col-span-3">
            {details.map((item) => (
              <div key={item.label} className="hairline-b py-5">
                <dt className="font-mono text-label text-muted uppercase">{item.label}</dt>
                <dd className="mt-2 font-mono text-base">{item.value}</dd>
                <dd className="mt-1 text-small text-muted">{item.note}</dd>
              </div>
            ))}
            <div className="hairline-b py-5">
              <dt className="font-mono text-label text-muted uppercase">Email</dt>
              <dd className="mt-2">
                <a href={`mailto:${brand.email}`} className="text-link font-mono text-base">
                  {brand.email}
                </a>
              </dd>
            </div>
          </dl>
          <div className="lg:col-span-6">
            <EnquiryForm />
          </div>
        </div>
      </Section>
    </main>
  );
}
