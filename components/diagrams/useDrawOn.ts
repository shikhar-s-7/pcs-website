"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type DrawOnOptions = {
  /** Seconds per stroke. */
  duration?: number;
  /** Total stagger spread across all strokes, seconds. */
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
    if (!svg || !enabled) return;
    const strokes = [...svg.querySelectorAll<SVGGeometryElement>("[data-draw]")];
    const labels = [...svg.querySelectorAll<SVGElement>("[data-label]")];
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      for (const stroke of strokes) {
        const length = stroke.getTotalLength();
        gsap.set(stroke, { strokeDasharray: length, strokeDashoffset: length });
      }
      gsap.set(labels, { opacity: 0 });

      const timeline = gsap.timeline({
        scrollTrigger: { trigger: svg, start, once: true },
      });
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
