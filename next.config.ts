import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
    ],
  },
  // Skip type checking during build for faster iterations
  // typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
