import { Frame } from "@/components/Frame";
import { PcsCabinet } from "@/components/PcsCabinet";
import { SectionMark } from "@/components/SectionMark";
import { VsgDemo } from "@/components/VsgDemo";

export default function TechnologyPage() {
  return (
    <main id="content" tabIndex={-1}>
      <section className="py-12 md:py-16">
        <Frame>
          <SectionMark index="01" label="TECHNOLOGY" />
          <h1 className="font-display text-title mt-6 uppercase">Swing equation</h1>
          <p className="mt-4 max-w-[62ch]">
            Inertia H sets J. A load step raises Pe. Frequency falls, then the angle
            moves until power balances again.
          </p>
          <div className="mt-12">
            <VsgDemo />
          </div>
        </Frame>
      </section>
      <section className="hairline-t">
        <PcsCabinet />
      </section>
    </main>
  );
}
