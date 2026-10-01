type ImageSlotProps = {
  /** CSS aspect ratio, e.g. "4/3". The box keeps it with or without a photo. */
  aspect: `${number}/${number}`;
  /** What the photo will show. Becomes alt text once src is set. */
  alt: string;
  caption: string;
  detail?: string;
  /** Drop a real photo in here. No layout change. */
  src?: string;
  status?: string;
  className?: string;
};

/** Labelled hole where real photography goes. Never a stock or generated image. */
export function ImageSlot({
  aspect,
  alt,
  caption,
  detail,
  src,
  status = "PHOTO PENDING",
  className,
}: ImageSlotProps) {
  // Pending slots exist for development only. In production they collapse. A real src always renders.
  if (!src && process.env.NODE_ENV === "production") return null;
  return (
    <figure className={className}>
      <div className="hairline relative w-full" style={{ aspectRatio: aspect.replace("/", " / ") }}>
        {src ? (
          <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div role="img" aria-label={`${status}: ${alt}`} className="absolute inset-0">
            <svg
              className="absolute inset-0 h-full w-full text-line"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <g stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke">
                <line x1="0" y1="0" x2="100" y2="100" vectorEffect="non-scaling-stroke" />
                <line x1="100" y1="0" x2="0" y2="100" vectorEffect="non-scaling-stroke" />
              </g>
            </svg>
            <p className="absolute top-3 left-3 bg-ground px-1 font-mono text-label text-muted uppercase">
              [PLACEHOLDER]
            </p>
            <p className="absolute top-3 right-3 bg-ground px-1 font-mono text-label text-muted">
              {aspect}
            </p>
            <p className="absolute inset-x-0 top-1/2 mx-auto w-fit max-w-[80%] -translate-y-1/2 bg-ground px-2 py-1 text-center font-mono text-label text-muted uppercase">
              {alt}
            </p>
            <p className="absolute bottom-3 left-3 bg-ground px-1 font-mono text-label text-signal-text uppercase">
              {status}
            </p>
          </div>
        )}
      </div>
      <figcaption className="mt-3">
        <span className="block font-mono text-label uppercase">{caption}</span>
        {detail ? <span className="mt-1 block text-small text-muted">{detail}</span> : null}
      </figcaption>
    </figure>
  );
}
