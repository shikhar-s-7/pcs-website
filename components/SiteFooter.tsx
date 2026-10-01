import Link from "next/link";
import { Frame } from "@/components/Frame";
import { Wordmark } from "@/components/Wordmark";
import { cta, nav, rev } from "@/components/nav";
import { brand } from "@/config/brand";

/** Stamped when the static export is built. */
const buildDate = new Date().toISOString().slice(0, 10);

export function SiteFooter() {
  return (
    <footer className="ground-ink hairline-t">
      <Frame>
        <div className="py-14 md:py-20">
          <Link href="/" className="inline-block">
            <Wordmark className="h-16 w-auto md:h-24" />
          </Link>

          <div className="mt-14 grid grid-cols-1 gap-y-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="font-mono text-label text-muted uppercase">Sitemap</p>
              <ul className="mt-4 grid gap-2">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="nav-link">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href={cta.href} className="nav-link">
                    Enquiries
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <p className="font-mono text-label text-muted uppercase">Contact</p>
              <ul className="mt-4 grid gap-2">
                <li>
                  <a href={`mailto:${brand.email}`} className="nav-link">
                    {brand.email}
                  </a>
                </li>
                <li className="font-mono text-label uppercase">BENGALURU / INDIA</li>
              </ul>
            </div>

            <div className="md:col-span-4">
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
