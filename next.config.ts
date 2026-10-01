import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Stop Next from generating AGENTS.md / CLAUDE.md in the repo. */
  agentRules: false,
  allowedDevOrigins: ["192.168.18.15"], // your IP
};

export default nextConfig;
