/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // 画像最適化設定
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  // パフォーマンス最適化
  swcMinify: true,
  // 圧縮設定
  compress: true,
  // セキュリティヘッダー
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  // PWA対応準備
  async rewrites() {
    return [];
  },
}

module.exports = nextConfig