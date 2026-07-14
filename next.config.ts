import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co"
      },
      {
        protocol: "https",
        hostname: "http2.mlstatic.com"
      },
      {
        protocol: "https",
        hostname: "down-br.img.susercontent.com"
      }
    ]
  }
};

export default nextConfig;
