/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/mobi',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  assetPrefix: '/mobi/',
  distDir: 'out',
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
  // Additional configuration for GitHub Pages
  poweredByHeader: false,
  generateEtags: false,
  compress: false,
  // Ensure proper static export
  experimental: {
    appDir: true,
  },
  // Optimize for static hosting
  optimizeFonts: true,
  swcMinify: true,
}

module.exports = nextConfig 