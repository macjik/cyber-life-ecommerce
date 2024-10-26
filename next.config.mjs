/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();

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

export default withNextIntl(nextConfig);
