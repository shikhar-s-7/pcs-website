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

function headerLine() {
  const header = document.querySelector(".site-header");
  return (header?.getBoundingClientRect().height ?? 0) + 24;
}

/** Last section whose top has reached the header line. Otherwise the first section. */
function measure(): { active: string } | null {
  const present = sectionIds.filter((id) => document.getElementById(id));
  if (present.length === 0) return null;
  const line = headerLine();
  let active = present[0];
  for (const id of present) {
    if (document.getElementById(id)!.getBoundingClientRect().top <= line) active = id;
  }
  return { active };
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

const SECTION_PAGE = "/capabilities";

/**
 * Single source of truth for the nav highlight, used by the desktop nav and the overlay.
 * Anchor items can be active only on /capabilities. Elsewhere only the page-level item
 * matching the pathname is. The hash and the section state are ignored off /capabilities.
 */
function navCurrent(
  pathname: string,
  activeSection: string | null,
  href: string,
): "page" | "location" | undefined {
  const id = href.split("#")[1];
  if (id) {
    return pathname === SECTION_PAGE && activeSection === id ? "location" : undefined;
  }
  return pathname === href ? "page" : undefined;
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

  const publish = (active: string, syncHash: boolean) => {
    if (activeRef.current !== active) {
      activeRef.current = active;
      setActiveSection(active);
      if (syncHash && !scrollLock.current && window.location.hash !== `#${active}`) {
        history.replaceState(null, "", `#${active}`);
      }

    }
  };

  const recompute = (syncHash: boolean) => {
    const reading = measure();
    if (!reading) {
      activeRef.current = null;
      setActiveSection(null);
      return;
    }
    publish(reading.active, syncHash);
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

  const closeMenu = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  };

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Open menu: lock page scroll, move focus in, trap Tab, close on Escape or when the
  // viewport grows to the desktop nav.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const items = [
        ...(buttonRef.current ? [buttonRef.current] : []),
        ...panel.querySelectorAll<HTMLElement>("a[href], button"),
      ];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      } else if (!items.includes(current as HTMLElement)) {
        event.preventDefault();
        first.focus();
      }
    };

    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => {
      if (desktop.matches) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      root.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  // Leaving /capabilities drops every trace of section state.
  useEffect(() => {
    // Any route change: drop the scroll-spy lock so it cannot swallow the scroll reset.
    scrollLock.current = false;
    lockGeneration.current += 1;
    if (pathname === SECTION_PAGE) return;
    activeRef.current = null;
    setActiveSection(null);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== SECTION_PAGE) return;
    if (!document.getElementById(sectionIds[0] ?? "")) return;

    const hashId = window.location.hash.replace(/^#/, "");
    if (hashId && sectionIds.includes(hashId) && document.getElementById(hashId)) {
      scrollLock.current = true;
      scrollToId(hashId, "auto");
      activeRef.current = hashId;
      setActiveSection(hashId);
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
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname !== SECTION_PAGE) return;
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
    if (pathname !== SECTION_PAGE) return;
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
      const release = () => {
        scrollLock.current = false;
      };
      window.addEventListener("scrollend", release, { once: true });
      window.setTimeout(release, 700);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const onAnchorClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    // Close and release the scroll lock first, so the scroll below is not swallowed by the lock.
    if (open) {
      document.documentElement.style.overflow = "";
      closeMenu(false);
    }
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    activeRef.current = id;
    setActiveSection(id);
    history.pushState(null, "", `#${id}`);
    holdForScroll();
    scrollToId(id, "smooth");
  };

  const links = (className: string) =>
    nav.map((item) => {
      const id = item.href.split("#")[1] ?? "";
      if (!id) {
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={navCurrent(pathname, activeSection, item.href)}
            className={className}
            onClick={() => closeMenu(false)}
          >
            {item.label}
          </Link>
        );
      }
      const href = pathname === "/capabilities" ? `#${id}` : item.href;
      return (
        <a
          key={item.href}
          href={href}
          aria-current={navCurrent(pathname, activeSection, item.href)}
          className={className}
          onClick={(event) => onAnchorClick(event, id)}
        >
          {item.label}
        </a>
      );
    });

  return (
    <header className="site-header">
      <div className="gutter mx-auto flex h-[var(--header-bar)] w-full max-w-[90rem] items-center justify-between gap-4 xl:gap-6">
        <Link href="/" className="shrink-0">
          <Wordmark />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-4 xl:gap-6 lg:flex">
          {links("nav-link inline-flex items-center")}
          <Link href={cta.href} className="btn btn-signal">
            {cta.label}
          </Link>
        </nav>

        <button
          ref={buttonRef}
          type="button"
          className="nav-link -mr-2 inline-flex min-w-11 items-center justify-center px-2 lg:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => (open ? closeMenu(false) : setOpen(true))}
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
            {links("nav-link hairline-b inline-flex items-center min-h-14 text-[1.25rem]")}
            <Link
              href={cta.href}
              className="btn btn-signal mt-8 w-full"
              onClick={() => closeMenu(false)}
            >
              {cta.label}
            </Link>
          </nav>
          <p className="mt-auto font-mono text-label text-muted uppercase">{brand.tagline}</p>
        </div>
      ) : null}
    </header>
  );
}
