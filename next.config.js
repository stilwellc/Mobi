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
}

module.exports = nextConfig 