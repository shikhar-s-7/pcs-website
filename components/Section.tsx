import type { ReactNode } from "react";
import { Frame } from "@/components/Frame";
import { SectionMark } from "@/components/SectionMark";

type SectionProps = {
  id?: string;
  index: string;
  label: string;
  ground?: "ink" | "paper";
  children: ReactNode;
};

/** Index rides in a 3-column rail; content takes the other 9. */
export function Section({ id, index, label, ground = "ink", children }: SectionProps) {
  return (
    <section id={id} className={ground === "paper" ? "ground-paper" : "ground-ink"}>
      <Frame>
        <div className="hairline-t grid grid-cols-1 gap-y-6 py-10 md:grid-cols-12 md:gap-x-8 md:gap-y-8 md:py-20">
          <div className="md:col-span-3">
            <div className="md:sticky md:top-[calc(var(--header-h)+2rem)]">
              <SectionMark index={index} label={label} />
            </div>
          </div>
          <div className="min-w-0 md:col-span-9">{children}</div>
        </div>
      </Frame>
    </section>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 data-reveal="lines" className="font-display text-title max-w-[20ch] uppercase">{children}</h2>;
}
