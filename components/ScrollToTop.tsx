"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * New route, new page: start at the top, instantly.
 * Skipped on first load, for hash links (the section is the destination) and on
 * back/forward, where the browser restores the old position.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const previous = useRef<string | null>(null);
  const fromHistory = useRef(false);

  useEffect(() => {
    const onPop = () => {
      fromHistory.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    const first = previous.current === null;
    const changed = previous.current !== pathname;
    previous.current = pathname;
    if (first || !changed) return;

    const restoring = fromHistory.current;
    fromHistory.current = false;
    if (restoring || window.location.hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}
