import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com',
      },
    ],
    disableStaticImages: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              // Default source restrictions
              "default-src 'self'",

              // Allow framing from same origin and your specific extension
              `frame-ancestors 'self'`,

              // Scripts - allow inline for Next.js
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",

              "frame-src 'self' https://vercel.live",

              // Styles - allow inline for Next.js
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

              // Style elements
              "style-src-elem 'self' 'unsafe-inline'",

              // Images
              "img-src 'self' https:",

              "media-src 'self'",

              // Fonts
              "font-src 'self' https://fonts.gstatic.com",

              // API connections - allow your extension to make requests
              `connect-src 'self' https: wss: https://www.google-analytics.com https://*.mailerlite.com https://eth.merkle.io https://bsc-dataseed1.binance.org https://bsc-dataseed2.binance.org https://bsc-dataseed3.binance.org https://bsc-dataseed4.binance.org https://relay.walletconnect.org https://*.walletconnect.org wss://*.walletconnect.org https://api.walletconnect.org https://explorer-api.walletconnect.com https://verify.walletconnect.com https://registry.walletconnect.com https://1rpc.io`,

              // Allow communication with extension
              `script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://va.vercel-scripts.com https://vercel.live https://assets.mailerlite.com`,
            ].join('; '),
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
