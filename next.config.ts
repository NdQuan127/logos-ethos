import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
    // Serve modern formats (WebP/AVIF) automatically
    formats: ['image/avif', 'image/webp'],
  },
  // Removed `output: 'standalone'` — reduces build artifact from ~230 MB to ~20 MB.
  // Firebase Hosting serves the static export directly; standalone is only needed
  // for containerised Node.js deployments (Docker / Cloud Run).
  webpack: (config, { dev }) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = { ignored: /.*/ };
    }
    return config;
  },
};

export default nextConfig;
