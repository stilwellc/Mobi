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
}

module.exports = nextConfig 