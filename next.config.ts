import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopack: {},
  },
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;