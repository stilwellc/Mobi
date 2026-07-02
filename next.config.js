/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
  async redirects() {
    return [
      { source: '/digital/ray/:path*', destination: '/software/ray/:path*', permanent: true },
      { source: '/digital/3d-prints/:path*', destination: '/physical/prints/:path*', permanent: true },
      { source: '/digital', destination: '/software', permanent: true },
      { source: '/shop', destination: '/', permanent: true },
      { source: '/shop/:path*', destination: '/', permanent: true },
      { source: '/social', destination: '/', permanent: true },
      { source: '/physical/1122/before', destination: '/physical/1122', permanent: true },
      { source: '/physical/1122/after', destination: '/physical/1122', permanent: true },
      { source: '/physical/1122/gallery', destination: '/physical/1122', permanent: true },
    ]
  },
  optimizeFonts: true,
  swcMinify: true,
  compress: true,
  generateEtags: true,
}

module.exports = nextConfig
