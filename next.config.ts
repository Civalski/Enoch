import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@radix-ui/react-alert-dialog", "@supabase/supabase-js"],
  },
  webpack: (config) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },
  serverExternalPackages: [
    "@prisma/client",
    ".prisma/client",
    "@prisma/adapter-pg",
    "pg",
    "pg-connection-string",
    "pg-pool",
    "pgpass",
  ],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "enoch.ornete.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
  async redirects() {
    return [];
  },
};

export default withBundleAnalyzer(nextConfig);

// Set OPENNEXT_SKIP_MINIFLARE=1 to avoid starting Miniflare during `next dev` (e.g. Windows
// workerd crash 0xc0000005, or when you do not use getCloudflareContext). Use `npm run dev:cloudflare`
// on Windows only after unsetting that var if you need the Wrangler proxy. Updating the
// MSVC++ redistributable often fixes Miniflare on Windows: https://aka.ms/vs/17/release/vc_redist.x64.exe
if (process.env.NODE_ENV === "development" && process.env.OPENNEXT_SKIP_MINIFLARE !== "1") {
  initOpenNextCloudflareForDev();
}
