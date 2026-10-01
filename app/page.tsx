import Link from "next/link";
import { Frame } from "@/components/Frame";

export default function Home() {
  return (
    <main id="content" tabIndex={-1}>
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
