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
}

module.exports = nextConfig 