import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages Direct Upload serves the generated static files in `out`.
  output: "export",
  // Static exports cannot use Next's server-side image optimizer. Remote API
  // images are therefore loaded directly by the browser.
  images: { unoptimized: true },
};

export default nextConfig;
