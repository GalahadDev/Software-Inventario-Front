import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, 
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wduloqcugbdlwmladawq.supabase.co",
      },
    ],
  },
};

export default nextConfig