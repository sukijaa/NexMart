Project Submission: NexMart 

Author: Sukijaa VS
Submission Date: Wednesday, October 29, 2025

Project Overview

This project is an e-commerce product catalog built with Next.js (App Router) as per the assignment requirements. It demonstrates various rendering strategies (SSG, SSR, CSR) and integrates with a Supabase backend (Postgres, Auth, Storage).

Live Demo URL: https://nexmart-kappa.vercel.app/

GitHub Repository URL: https://github.com/sukijaa/NexMart


Core Requirements Met:

Frontend Pages:

Homepage (/): SSG (fetches data at build time).

Product Detail (/products/[slug]): SSR (fetches data on request, with On-Demand Revalidation via Server Actions).

Inventory Dashboard (/dashboard): SSR (fetches live data on every request, protected route).

Admin Panel (/admin): CSR (fetches data client-side, protected route).

Backend: Basic GET API routes implemented (/api/products, /api/products/details). Data mutations handled securely via Server Actions.

Database: Supabase (Postgres) used for product data.

Documentation: This README and the accompanying Report file.

Bonus Points & Advanced Features Implemented

TypeScript: Project written entirely in TypeScript.

Deployment: Successfully deployed to Vercel (link above).

On-Demand Revalidation: Implemented revalidatePath in Server Actions for instant updates to cached pages upon product modification.

Modern Next.js Features: Utilizes App Router, Server Actions, and Middleware for route protection.

Authentication: Basic but secure Magic Link authentication implemented using Supabase Auth to protect admin routes (/dashboard, /admin).

Additional Features:

Product image uploads using Supabase Storage.

Client-side shopping cart using Zustand.

Professional UI using Shadcn/ui and Tailwind CSS.

Form validation using Zod and React Hook Form.

Setup and Running Locally

(Instructions copied from main README for convenience)

Prerequisites:

Node.js (v18.17+ recommended)

npm (or yarn/pnpm)

Git

Steps:

Clone the Repository:

git clone [YOUR GITHUB REPO URL HERE]
cd [Your Project Folder Name]


Install Dependencies:

npm install


Set Up Supabase:

Create a free Supabase project.

Run the SQL schema provided in the GitHub repository (supabase_schema.sql or see Report Appendix) in the SQL Editor.

Create a public Storage bucket named product-images.

Add Storage Policies for INSERT, UPDATE, DELETE on the bucket allowing authenticated role access only.

Configure Authentication -> URL Configuration: Site URL = http://localhost:3000, add http://localhost:3000/** to Redirect URLs.

Configure Environment Variables:

Create .env.local in the project root.

Copy structure from .env.example.

Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY from your Supabase project settings.

Seed Database (Optional):

npm run db:seed


Run Development Server:

npm run dev


Open http://localhost:3000.