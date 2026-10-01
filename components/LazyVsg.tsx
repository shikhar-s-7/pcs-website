"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const VsgDemo = dynamic(() => import("@/components/VsgDemo").then((m) => m.VsgDemo), {
  ssr: false,
});

/** Loads the swing simulation shortly before it scrolls into view. Space is reserved up front. */
export function LazyVsg() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) {
      setReady(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="min-h-[56rem] md:min-h-[40rem]">
      {ready ? <VsgDemo /> : null}
    </div>
  );
}
