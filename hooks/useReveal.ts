"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const MOTION = "(prefers-reduced-motion: no-preference)";

/**
 * Markup contract. Reduced motion never hides anything (see globals.css).
 *   data-reveal="heading"  split to lines, staggered in on load
 *   data-reveal="lines"    split to lines, revealed when scrolled to
 *   data-count="9,000"     counts up, ends on exactly this string
 *   data-draw / data-label inside an <svg> -> useDrawOn
 */

/** 4 cores or fewer: one fade per element, no text splitting, no count-ups, no stroke drawing. */
function isLowPower() {
  return typeof navigator !== "undefined" && (navigator.hardwareConcurrency ?? 8) <= 4;
}

/** Cheap path: the whole element fades in once. */
function fadeIn(el: HTMLElement, mode: "load" | "scroll") {
  gsap.set(el, { visibility: "visible" });
  gsap.from(el, {
    autoAlpha: 0,
    duration: 0.5,
    ease: "power2.out",
    delay: mode === "load" ? 0.1 : 0,
    scrollTrigger: mode === "scroll" ? { trigger: el, start: "top 90%", once: true } : undefined,
  });
}

/** Move and fade only. Transforms do not reflow, so nothing shifts. */
function revealLines(el: HTMLElement, mode: "load" | "scroll") {
  return SplitText.create(el, {
    type: "lines",
    autoSplit: true,
    linesClass: "reveal-line",
    onSplit(self) {
      gsap.set(el, { visibility: "visible" });
      return gsap.from(self.lines, {
        autoAlpha: 0,
        yPercent: 40,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.09,
        delay: mode === "load" ? 0.1 : 0,
        scrollTrigger:
          mode === "scroll" ? { trigger: el, start: "top 88%", once: true } : undefined,
      });
    },
  });
}

/** "9,000" -> 9000. Anything with letters or symbols is left static. */
function parseCount(text: string) {
  if (!/^\d[\d,]*(\.\d+)?$/.test(text)) return null;
  const decimals = text.includes(".") ? text.split(".")[1].length : 0;
  const grouped = text.includes(",");
  return { target: Number(text.replace(/,/g, "")), decimals, grouped };
}

function countUp(el: HTMLElement) {
  const final = el.dataset.count ?? el.textContent ?? "";
  const parsed = parseCount(final);
  if (!parsed) {
    el.textContent = final;
    return null;
  }
  // Hold the final width so shorter intermediate numbers cannot shift layout.
  const width = el.getBoundingClientRect().width;
  gsap.set(el, { display: "inline-block", minWidth: width });
  const state = { n: 0 };
  const format = (n: number) =>
    n.toLocaleString("en-US", {
      useGrouping: parsed.grouped,
      minimumFractionDigits: parsed.decimals,
      maximumFractionDigits: parsed.decimals,
    });
  el.textContent = format(0);
  return gsap.to(state, {
    n: parsed.target,
    duration: 0.9,
    ease: "power2.out",
    scrollTrigger: { trigger: el, start: "top 90%", once: true },
    onUpdate: () => {
      el.textContent = format(state.n);
    },
    onComplete: () => {
      el.textContent = final; // exact string from specs, units untouched
    },
  });
}

/** Run every reveal under `scope` (default: <main>). Re-runs when `key` changes. */
export function useReveal(scope?: RefObject<HTMLElement | null>, key?: string) {
  useEffect(() => {
    const root = scope?.current ?? document.querySelector("main");
    if (!root) return;
    const media = gsap.matchMedia();
    let cancelled = false;

    media.add(MOTION, () => {
      const splits: SplitText[] = [];
      document.fonts.ready.then(() => {
        if (cancelled) return;
        if (isLowPower()) {
          root
            .querySelectorAll<HTMLElement>("[data-reveal]")
            .forEach((el) => fadeIn(el, el.dataset.reveal === "heading" ? "load" : "scroll"));
          ScrollTrigger.refresh();
          return;
        }
        root
          .querySelectorAll<HTMLElement>('[data-reveal="heading"]')
          .forEach((el) => splits.push(revealLines(el, "load")));
        root
          .querySelectorAll<HTMLElement>('[data-reveal="lines"]')
          .forEach((el) => splits.push(revealLines(el, "scroll")));
        root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => countUp(el));
        ScrollTrigger.refresh();
      });
      return () => splits.forEach((split) => split.revert());
    });

    return () => {
      cancelled = true;
      media.revert();
    };
  }, [scope, key]);
}

type DrawOnOptions = {
  duration?: number;
  staggerAmount?: number;
  start?: string;
  enabled?: boolean;
};

/**
 * Strokes marked data-draw trace on once when the SVG scrolls in.
 * Text marked data-label fades in after. Reduced motion: drawn at rest.
 */
export function useDrawOn(
  ref: RefObject<SVGSVGElement | null>,
  { duration = 0.9, staggerAmount = 0.5, start = "top 80%", enabled = true }: DrawOnOptions = {},
) {
  useEffect(() => {
    const svg = ref.current;
    if (!svg || !enabled || isLowPower()) return;
    const strokes = [...svg.querySelectorAll<SVGGeometryElement>("[data-draw]")];
    const labels = [...svg.querySelectorAll<SVGElement>("[data-label]")];
    const media = gsap.matchMedia();

    media.add(MOTION, () => {
      for (const stroke of strokes) {
        const length = stroke.getTotalLength();
        gsap.set(stroke, { strokeDasharray: length, strokeDashoffset: length });
      }
      gsap.set(labels, { opacity: 0 });

      const timeline = gsap.timeline({ scrollTrigger: { trigger: svg, start, once: true } });
      timeline.to(strokes, {
        strokeDashoffset: 0,
        duration,
        ease: "power2.out",
        stagger: { amount: staggerAmount },
      });
      if (labels.length > 0) {
        timeline.to(
          labels,
          { opacity: 1, duration: 0.4, ease: "power2.out", stagger: { amount: 0.2 } },
          "-=0.4",
        );
      }

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
        gsap.set(strokes, { clearProps: "strokeDasharray,strokeDashoffset" });
        gsap.set(labels, { clearProps: "opacity" });
      };
    });

    return () => media.revert();
  }, [ref, duration, staggerAmount, start, enabled]);
}
