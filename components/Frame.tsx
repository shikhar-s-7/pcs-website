import type { ReactNode } from "react";

type FrameProps = {
  children: ReactNode;
};

/**
 * 1440 frame, 12 equal columns, no gutter.
 * Column rules sit on the same grid as the content.
 * Hidden below md, where 12 hairlines collapse into noise.
 */
export function Frame({ children }: FrameProps) {
  return (
    <div className="mx-auto w-full max-w-[90rem] px-5 md:px-8">
      <div className="relative">
        <div
          aria-hidden="true"
          className="grid-12 pointer-events-none absolute inset-0 hidden md:grid"
        >
          {Array.from({ length: 12 }, (_, index) => (
            <div key={index} className={index < 11 ? "hairline-r" : undefined} />
          ))}
        </div>
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
