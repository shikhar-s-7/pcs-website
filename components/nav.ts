/** In-page sections on /capabilities, in document order. */
export const nav = [
  { href: "/capabilities#overview", label: "Overview" },
  { href: "/capabilities#capabilities", label: "Capabilities" },
  { href: "/capabilities#pcs", label: "PCS" },
  { href: "/capabilities#compliance", label: "Compliance" },
  { href: "/capabilities#dispatch", label: "Dispatch" },
] as const;

export const cta = { href: "/enquiries", label: "Start a project" } as const;

/** Specimen revision. The date beside it is stamped at build. */
export const rev = "0.1";
