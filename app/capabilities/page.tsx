import type { Metadata } from "next";
import { Frame } from "@/components/Frame";

export const metadata: Metadata = {
  title: "Capabilities",
};

export default function CapabilitiesPage() {
  return (
    <main id="content" tabIndex={-1}>
      <Frame>
        <div className="py-16 md:py-24">
          <section id="overview">
            <h1 className="font-display text-title uppercase">
              Hardware, controls, and evidence.
            </h1>
          </section>
          <section id="capabilities" className="grid gap-16 pt-16">
            <section id="pcs">
              <h2 className="font-display text-heading uppercase">Grid-forming power conversion</h2>
            </section>
            <section id="compliance">
              <h2 className="font-display text-heading uppercase">Compliance & validation lab</h2>
            </section>
            <section id="dispatch">
              <h2 className="font-display text-heading uppercase">Dispatch & asset management</h2>
            </section>
          </section>
        </div>
      </Frame>
    </main>
  );
}
