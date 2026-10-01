"use client";

import { useEffect, useState } from "react";

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT")
  );
}

/** One page-level 12-column overlay. G toggles it. Off, there are no column rules. */
export function GridDebug() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "g" && event.key !== "G") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;
      event.preventDefault();
      setOn((value) => !value);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!on) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30">
      <div className="mx-auto h-full w-full max-w-[90rem] px-5 md:px-8">
        <div className="grid h-full grid-cols-12">
          {Array.from({ length: 12 }, (_, index) => (
            <div
              key={index}
              className={index < 11 ? "border-r border-[#ff4d00]/45" : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
