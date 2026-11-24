import type { NextConfig } from "next";
const config: NextConfig = {
  experimental: { inlineCss: true },
  async headers() { return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }]; },
};
export default config;
