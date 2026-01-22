import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: false,
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

export default nextConfig;
