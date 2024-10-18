/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['sequelize'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'onrnm2rcmvu0lbwt.public.blob.vercel-storage.com',
        port: '',
      },
    ],
  },
  // experimental: { serverActions: true },
};

export default nextConfig;
