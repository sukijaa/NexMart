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
      bodySizeLimit: '1mb', // Enforce 1MB limit
    },
    // --- FORCE WEBPACK ---
    turbopack: {
        enabled: false // Explicitly disable Turbopack for dev
    }
    // --- END FORCE WEBPACK ---
  },
};

export default config;