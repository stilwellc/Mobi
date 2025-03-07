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
  // Remove basePath and assetPrefix as they're not needed for Vercel
  // Remove trailingSlash as it's not needed for Vercel
  // Keep other optimizations
  optimizeFonts: true,
  swcMinify: true,
  compress: true,
  generateEtags: true,
}

module.exports = nextConfig 