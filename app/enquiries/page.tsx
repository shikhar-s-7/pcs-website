import type { Metadata } from "next";
import { Frame } from "@/components/Frame";

export const metadata: Metadata = {
  title: "Enquiries",
};

export default function EnquiriesPage() {
  return (
    <main id="content" tabIndex={-1}>
      <Frame>
        <h1 className="font-display text-title py-16 uppercase md:py-24">
          Tell us about your project.
        </h1>
      </Frame>
    </main>
  );
}
