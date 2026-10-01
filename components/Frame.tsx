import type { ReactNode } from "react";

type FrameProps = {
  children: ReactNode;
};

/** 1440 frame, 12 columns, no gutter. Column rules are the G-key overlay. */
export function Frame({ children }: FrameProps) {
  return <div className="mx-auto w-full max-w-[90rem] px-5 md:px-8">{children}</div>;
}
