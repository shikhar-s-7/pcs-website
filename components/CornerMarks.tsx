const tick = "pointer-events-none fixed z-20 h-2.5 w-2.5 border-signal";

/** Four registration ticks. The accent, used as a mark rather than a fill. */
export function CornerMarks() {
  return (
    <div aria-hidden="true">
      <span className={`${tick} top-3 left-3 border-t border-l`} />
      <span className={`${tick} top-3 right-3 border-t border-r`} />
      <span className={`${tick} bottom-3 left-3 border-b border-l`} />
      <span className={`${tick} right-3 bottom-3 border-r border-b`} />
    </div>
  );
}
