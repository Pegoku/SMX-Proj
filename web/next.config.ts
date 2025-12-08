import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Allow unoptimized images for local development
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
