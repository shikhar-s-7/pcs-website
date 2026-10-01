import Link from "next/link";
import { Frame } from "@/components/Frame";
import { Wordmark } from "@/components/Wordmark";
import { cta, rev } from "@/components/nav";
import { brand } from "@/config/brand";

/** Stamped when the site is built. */
const buildDate = new Date().toISOString().slice(0, 10);

const site = [
  { href: "/", label: "Overview" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/technology", label: "Technology" },
  { href: "/enquiries", label: "Contact" },
] as const;

const capabilities = [
  { href: "/capabilities#pcs", label: "Grid-forming PCS" },
  { href: "/capabilities#compliance", label: "Compliance & validation" },
  { href: "/capabilities#dispatch", label: "Dispatch software" },
] as const;

export function SiteFooter() {
  return (
    <footer className="ground-ink hairline-t pb-[env(safe-area-inset-bottom)]">
      <Frame>
        <div className="py-10 md:py-20">
          <Link href="/" className="inline-block">
            <Wordmark className="h-16 w-auto md:h-24" />
          </Link>
          <p className="mt-6 max-w-[48ch] text-small text-muted">
            Grid-forming power conversion, compliance validation, and dispatch software for battery
            energy storage.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-y-10 md:grid-cols-12">
            <div className="md:col-span-3">
              <p className="font-mono text-label text-muted uppercase">Sitemap</p>
              <ul className="mt-4 grid gap-2">
                {site.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="nav-link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3">
              <p className="font-mono text-label text-muted uppercase">Capabilities</p>
              <ul className="mt-4 grid gap-2">
                {capabilities.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="nav-link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3">
              <p className="font-mono text-label text-muted uppercase">Contact</p>
              <ul className="mt-4 grid gap-2">
                <li>
                  <Link href={cta.href} className="nav-link">
                    Enquiry form
                  </Link>
                </li>
                <li>
                  <a href={`mailto:${brand.email}`} className="nav-link">
                    {brand.email}
                  </a>
                </li>
                <li className="font-mono text-label uppercase">BENGALURU / INDIA</li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <p className="font-mono text-label text-muted uppercase">Legal</p>
              <p className="mt-4 font-mono text-label uppercase">
                © 2026 {brand.shortName}. ALL RIGHTS RESERVED.
              </p>
              <p className="mt-2 font-mono text-label text-muted uppercase">{brand.legalEntity}</p>
            </div>
          </div>

          <p className="hairline-t mt-14 py-4 font-mono text-label text-muted uppercase">
            REV {rev} / {buildDate}
          </p>
        </div>
      </Frame>
    </footer>
  );
}
