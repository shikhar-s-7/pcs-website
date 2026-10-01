const tick = "pointer-events-none fixed z-20 h-2.5 w-2.5 border-signal";

/** Four registration ticks. The accent, used as a mark rather than a fill. Inside the safe area. */
export function CornerMarks() {
  return (
    <div aria-hidden="true">
      <span className={`${tick} top-3 left-[max(0.75rem,env(safe-area-inset-left))] border-t border-l`} />
      <span className={`${tick} top-3 right-[max(0.75rem,env(safe-area-inset-right))] border-t border-r`} />
      <span
        className={`${tick} bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-[max(0.75rem,env(safe-area-inset-left))] border-b border-l`}
      />
      <span
        className={`${tick} right-[max(0.75rem,env(safe-area-inset-right))] bottom-[max(0.75rem,env(safe-area-inset-bottom))] border-r border-b`}
      />
    </div>
  );
}
