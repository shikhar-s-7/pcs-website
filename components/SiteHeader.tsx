"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/Wordmark";
import { cta, nav } from "@/components/nav";
import { brand } from "@/config/brand";

const sectionIds = nav.flatMap((item) => {
  const id = item.href.split("#")[1];
  return id ? [id] : [];
});

type SectionTops = Record<string, number>;

function headerLine() {
  const header = document.querySelector(".site-header");
  return (header?.getBoundingClientRect().height ?? 0) + 24;
}

/** Last section whose top has reached the header line. Otherwise the first section. */
function measure(): { active: string; tops: SectionTops } | null {
  const present = sectionIds.filter((id) => document.getElementById(id));
  if (present.length === 0) return null;
  const line = headerLine();
  const tops: SectionTops = {};
  let active = present[0];
  let crossed = false;
  for (const id of present) {
    const top = document.getElementById(id)!.getBoundingClientRect().top;
    tops[id] = Math.round(top);
    if (top <= line) {
      active = id;
      crossed = true;
    }
  }
  if (!crossed) active = present[0];
  return { active, tops };
}

function report(active: string, tops: SectionTops) {
  // TEMP: remove this log and the report() wrapper calls once scroll-spy is confirmed.
  console.log({ hash: window.location.hash, active, sectionTops: tops });
}

function scrollToId(id: string, behavior: ScrollBehavior) {
  const target = document.getElementById(id);
  if (!target) return;
  const root = document.documentElement;
  const previous = root.style.scrollBehavior;
  if (behavior === "auto") root.style.scrollBehavior = "auto";
  target.scrollIntoView({ behavior });
  if (behavior === "auto") root.style.scrollBehavior = previous;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollLock = useRef(false);
  const lockGeneration = useRef(0);
  const activeRef = useRef<string | null>(null);

  const publish = (active: string, tops: SectionTops, syncHash: boolean) => {
    if (activeRef.current !== active) {
      activeRef.current = active;
      setActiveSection(active);
      if (syncHash && !scrollLock.current && window.location.hash !== `#${active}`) {
        history.replaceState(null, "", `#${active}`);
      }
      report(active, tops);
    }
  };

  const recompute = (syncHash: boolean) => {
    const reading = measure();
    if (!reading) {
      activeRef.current = null;
      setActiveSection(null);
      return;
    }
    publish(reading.active, reading.tops, syncHash);
  };

  const holdForScroll = () => {
    const generation = lockGeneration.current + 1;
    lockGeneration.current = generation;
    scrollLock.current = true;
    const release = () => {
      if (lockGeneration.current !== generation) return;
      lockGeneration.current += 1;
      scrollLock.current = false;
      recompute(false);
    };
    window.addEventListener("scrollend", release, { once: true });
    window.setTimeout(release, 700);
  };

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!document.getElementById(sectionIds[0] ?? "")) return;

    const hashId = window.location.hash.replace(/^#/, "");
    if (hashId && sectionIds.includes(hashId) && document.getElementById(hashId)) {
      scrollLock.current = true;
      scrollToId(hashId, "auto");
      activeRef.current = hashId;
      setActiveSection(hashId);
      report(hashId, measure()?.tops ?? {});
      const release = () => {
        scrollLock.current = false;
      };
      window.addEventListener("scrollend", release, { once: true });
      const timer = window.setTimeout(release, 700);
      return () => {
        window.removeEventListener("scrollend", release);
        window.clearTimeout(timer);
      };
    }

    const reading = measure();
    if (reading) {
      activeRef.current = reading.active;
      setActiveSection(reading.active);
      report(reading.active, reading.tops);
    }
  }, [pathname]);

  useEffect(() => {
    if (!document.getElementById(sectionIds[0] ?? "")) return;

    let frame = 0;
    const onScroll = () => {
      if (scrollLock.current || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (scrollLock.current) return;
        recompute(true);
      });
    };
    const onResize = () => recompute(false);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (frame) cancelAnimationFrame(frame);
    };
    // recompute closes over publish, which is stable enough for this page's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const onPop = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id || !document.getElementById(id)) {
        recompute(false);
        return;
      }
      scrollLock.current = true;
      activeRef.current = id;
      setActiveSection(id);
      scrollToId(id, "auto");
      report(id, measure()?.tops ?? {});
      const release = () => {
        scrollLock.current = false;
      };
      window.addEventListener("scrollend", release, { once: true });
      window.setTimeout(release, 700);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAnchorClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    activeRef.current = id;
    setActiveSection(id);
    history.pushState(null, "", `#${id}`);
    report(id, measure()?.tops ?? {});
    holdForScroll();
    scrollToId(id, "smooth");
    setOpen(false);
  };

  const links = (className: string) =>
    nav.map((item) => {
      const id = item.href.split("#")[1] ?? "";
      const href = pathname === "/capabilities" ? `#${id}` : item.href;
      return (
        <a
          key={item.href}
          href={href}
          aria-current={activeSection === id ? "location" : undefined}
          className={className}
          onClick={(event) => onAnchorClick(event, id)}
        >
          {item.label}
        </a>
      );
    });

  return (
    <header className="site-header">
      <div className="mx-auto flex h-[var(--header-h)] w-full max-w-[90rem] items-center justify-between gap-6 px-5 md:px-8">
        <Link href="/" className="shrink-0">
          <Wordmark />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {links("nav-link")}
          <Link href={cta.href} className="btn btn-signal">
            {cta.label}
          </Link>
        </nav>

        <button
          ref={buttonRef}
          type="button"
          className="nav-link lg:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <div
          id={menuId}
          ref={panelRef}
          className="mobile-menu lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <nav aria-label="Primary" className="flex flex-col">
            {links("nav-link hairline-b py-4 text-[1.25rem]")}
            <Link href={cta.href} className="btn btn-signal mt-8 self-start" onClick={() => setOpen(false)}>
              {cta.label}
            </Link>
          </nav>
          <p className="mt-auto font-mono text-label text-muted uppercase">{brand.tagline}</p>
        </div>
      ) : null}
    </header>
  );
}
