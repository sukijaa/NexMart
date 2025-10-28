/** @type {import('next').NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'rfowlpjjiiytitihtpvl.supabase.co',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '1mb', // Enforce 1MB limit
    },
  },
};

export default config;
