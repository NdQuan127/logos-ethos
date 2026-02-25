import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Static export: Next.js emits a fully-static `out/` directory.
  // Firebase Hosting serves these files directly from its CDN edge nodes —
  // TTFB drops to near-zero since no Node.js server is involved.
  output: 'export',

  // Firebase Hosting requires `trailingSlash: true` so that `/blog/slug`
  // is served from `out/blog/slug/index.html` instead of `out/blog/slug.html`.
  trailingSlash: true,

  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    // `unoptimized: true` is required for `output: 'export'`.
    // Without a Node.js server there is no runtime image optimisation pipeline.
    // We compensate by self-hosting images at the correct size/format (Phase 2).
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { dev }) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = { ignored: /.*/ };
    }
    return config;
  },
};

export default nextConfig;
