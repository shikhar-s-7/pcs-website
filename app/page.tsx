import Link from "next/link";
import { Frame } from "@/components/Frame";
import { SectionMark } from "@/components/SectionMark";
import { Wordmark } from "@/components/Wordmark";

export default function Home() {
  return (
    <main>
      <header className="hairline-b">
        <Frame>
          <div className="flex items-center justify-between py-5">
            <Wordmark />
            <SectionMark index="00" label="INDEX" />
          </div>
        </Frame>
      </header>
      <Frame>
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="py-16 md:col-span-7 md:py-28">
            <h1 className="font-display text-title uppercase">Design system</h1>
            <Link
              href="/design-system"
              className="text-link mt-8 inline-block font-mono text-label uppercase"
            >
              Open specimen -&gt;
            </Link>
          </div>
        </div>
      </Frame>
    </main>
  );
}
