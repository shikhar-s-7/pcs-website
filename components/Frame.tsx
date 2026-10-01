import type { ReactNode } from "react";

type FrameProps = {
  children: ReactNode;
};

/** 1440 frame, 12 columns, no gutter. Gutter respects the notch. Column rules are the G-key overlay. */
export function Frame({ children }: FrameProps) {
  return <div className="gutter mx-auto w-full max-w-[90rem]">{children}</div>;
}
