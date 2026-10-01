import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  /* Static host has no image optimizer. Skip the generated agent markdown. */
  agentRules: false,
};

export default nextConfig;
