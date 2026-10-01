import { Frame } from "@/components/Frame";
import { PcsCabinet } from "@/components/PcsCabinet";
import { SectionMark } from "@/components/SectionMark";
import { LazyVsg } from "@/components/LazyVsg";

export default function TechnologyPage() {
  return (
    <main id="content" tabIndex={-1}>
      <section id="product" className="pt-12 md:pt-16">
        <Frame>
          <SectionMark index="01" label="TECHNOLOGY" />
          <h1 data-reveal="heading" className="font-display text-title mt-6 uppercase">
            Grid-forming power conversion
          </h1>
        </Frame>
        <div className="hairline-t hairline-b mt-8">
          <PcsCabinet />
        </div>
      </section>
      <section className="py-12 md:py-16">
        <Frame>
          <SectionMark index="02" label="LOAD STEP" />
          <h2 data-reveal="lines" className="font-display text-title mt-6 uppercase">
            Same load hit. Two responses.
          </h2>
          <p className="mt-4 max-w-[62ch]">
            When demand suddenly jumps, a grid-forming inverter acts like a spinning machine:
            frequency dips, then recovers. A grid-following inverter just tracks the grid and adds
            no inertia of its own.
          </p>
          <div className="mt-12">
            <LazyVsg />
          </div>
        </Frame>
      </section>
    </main>
  );
}
