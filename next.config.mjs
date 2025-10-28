// File: next.config.ts

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
      { // Supabase Storage Hostname
        protocol: 'https',
        // Make SURE this hostname is correct for YOUR Supabase project
        hostname: 'rfowlpjjiiytitihtpvl.supabase.co',
      },
    ],
  },
  experimental: {
  serverActions: {
    // Keep the limit at 1MB as you requested
    bodySizeLimit: '1mb',
  },
  // NO 'turbopack' key here
},
};

export default config;