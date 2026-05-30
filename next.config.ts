import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 允许局域网设备访问开发服务器
  allowedDevOrigins: ['192.168.10.108'],

  // 启用压缩
  compress: true,

  // 优化图片
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // 实验性功能
  experimental: {
    // 优化 CSS
    optimizeCss: true,
  },

  // Headers for PWA and caching
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
