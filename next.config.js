/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/ani-algo',
  assetPrefix: '/ani-algo/',
};

module.exports = nextConfig;
