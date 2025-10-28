<div align="center">
  <br />
  <h1>Project Report: NexMart</h1>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-Next.js_14-black?style=for-the-badge&logoColor=white&logo=next.js&color=black"/>
    <img src="https://img.shields.io/badge/-Supabase-black?style=for-the-badge&logoColor=white&logo=supabase&color=3ECF8E"/>
    <img src="https://img.shields.io/badge/-PostgreSQL-black?style=for-the-badge&logoColor=white&logo=postgresql&color=4169E1"/>
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6"/>
    <img src="https://img.shields.io/badge/-Vercel-black?style=for-the-badge&logoColor=white&logo=vercel&color=black"/>
    <br/>
    <img src="https://img.shields.io/badge/-TailwindCSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=38B2AC"/>
    <img src="https://img.shields.io/badge/-Shadcn-black?style=for-the-badge&logoColor=white&logo=shadcnui&color=black"/>
    <img src="https://img.shields.io/badge/-Zustand-black?style=for-the-badge&logoColor=white&color=black"/>
    <img src="https://img.shields.io/badge/-Zod-black?style=for-the-badge&logoColor=white&logo=zod&color=3E67B1"/>
    <img src="https://img.shields.io/badge/-React%20Hook%20Form-black?style=for-the-badge&logoColor=white&logo=reacthookform&color=EC5990"/>
  </div>

  <h3 align="center">To build a modern e-commerce product catalog using Next.js, demonstrating various rendering strategies and incorporating advanced features for a professional portfolio piece.</h3>
  
  <p align="center">
    <strong>Author:</strong> Sukijaa VS
    <br />
    <strong>Date:</strong> Wednesday, October 29, 2025
  </p>
</div>

## 📋 <a name="table">Table of Contents</a>

1.  ✨ [Introduction](#introduction)
2.  ⚙️ [Tech Stack](#tech-stack)
3.  💡 [Rendering Strategy Rationale](#rendering)
4.  🌊 [Data Flow](#data-flow)
5.  🔒 [Authentication](#authentication)
6.  챌 [Challenges Faced & Solutions](#challenges)
7.  📸 [Screenshots](#screenshots)
8.  🏁 [Conclusion](#conclusion)
9.  📜 [Appendix: Supabase Schema](#appendix)

## ✨ <a name="introduction">Introduction</a>

This report details the implementation of the NexMart e-commerce catalog application. The project was built using Next.js 14 (App Router) and TypeScript, leveraging Supabase for database, authentication, and storage. The primary goal was to demonstrate proficiency in different Next.js rendering strategies (SSG, SSR, CSR) while also incorporating modern best practices like Server Actions, On-Demand Revalidation, and a professional UI using Shadcn/ui and Tailwind CSS. Additional features like image uploads and a client-side shopping cart (Zustand) were added to showcase a broader skillset.

## ⚙️ <a name="tech-stack">Tech Stack</a>

* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript
* **Backend (BaaS):** Supabase (Postgres, Auth, Storage)
* **UI:** Tailwind CSS, Shadcn/ui
* **State Management:** Zustand (for client-side cart)
* **Form Handling:** React Hook Form
* **Validation:** Zod
* **Core React Features:** Server Components, Client Components, Server Actions, `useTransition`, `useActionState`
* **Deployment:** Vercel

## 💡 <a name="rendering">Rendering Strategy Rationale</a>

Choosing the appropriate rendering strategy is crucial for performance, SEO, and data freshness. The following choices were made for each key section:

### a) Homepage (/) - SSG (Static Site Generation)

* **Strategy:** Default behavior of Next.js App Router Server Components without dynamic functions or `force-dynamic`. Data is fetched at build time.
* **Rationale:** The homepage primarily displays a list of products that doesn't change extremely frequently for every user. SSG provides the best possible performance by serving pre-built HTML files from a CDN. This also maximizes SEO benefits as search engine crawlers receive fully rendered content immediately. Client-side search/filtering was added for interactivity without requiring server requests.
* **Implementation:** The page (`app/page.tsx`) is a Server Component that fetches all products using the Supabase client during the build process.

### b) Product Detail Page (/products/[slug]) - SSR (Server-Side Rendering) with On-Demand Revalidation

* **Strategy:** Server-Side Rendering forced using `export const dynamic = 'force-dynamic'`. Data is fetched on the server for each request. Additionally, `revalidatePath` is used in Server Actions to purge the Vercel data cache when a product is updated.
* **Rationale:** Product details (especially price and inventory) might change more frequently than the homepage list. While Incremental Static Regeneration (ISR) was the initial goal, persistent issues encountered with build tools (Turbopack, Vercel build environment) related to dynamic parameters made SSR a more stable choice. SSR ensures data is always fresh. Critically, On-Demand Revalidation via `revalidatePath` in the `updateProduct` Server Action provides the instant cache invalidation benefit originally sought from ISR, ensuring users see updated product info immediately after an admin saves changes.
* **Implementation:** The page (`app/products/[slug]/page.tsx`) is a Server Component marked with `export const dynamic = 'force-dynamic'`. It fetches data for a single product based on the `slug` parameter on each request. The `updateProduct` Server Action (`lib/actions.ts`) calls `revalidatePath('/products/[slug]')` after a successful database update.

### c) Inventory Dashboard (/dashboard) - SSR (Server-Side Rendering)

* **Strategy:** Server-Side Rendering forced using `export const dynamic = 'force-dynamic'`.
* **Rationale:** This page is protected and displays real-time inventory statistics (total products, low stock items, total value). This data must be current on every view. SSR guarantees that the data is fetched live from the database every time an authenticated user accesses the page.
* **Implementation:** The page (`app/dashboard/page.tsx`) is a Server Component marked with `export const dynamic = 'force-dynamic'`. It fetches product data on each request and calculates statistics server-side. Access is restricted via `middleware.ts`.

### d) Admin Panel (/admin) - CSR (Client-Side Rendering)

* **Strategy:** Client-Side Rendering using the `'use client'` directive.
* **Rationale:** The admin panel features an interactive data table for management tasks. Fetching the potentially large list of products client-side after the initial page load provides a faster perceived load time for the UI shell. The interactivity of sorting, filtering, and triggering actions benefits from running in the browser. The route is protected by middleware.
* **Implementation:** The page (`app/admin/page.tsx`) uses `'use client'`. It renders a loading state, then fetches the product list using `useEffect` and the client-side Supabase helper (`lib/supabase/client.ts`). Data is displayed using Shadcn's `<DataTable />` component.

## 🌊 <a name="data-flow">Data Flow</a>

The application utilizes several data flow patterns:

**Read (Public Pages):**

* User requests Page (e.g., `/` or `/products/slug`).
* Next.js Server Component runs.
* Server Component uses Supabase Server Client (`lib/supabase/server.ts`) to fetch data from Supabase DB.
* Component renders HTML, sent to the client. (Data might be cached by Vercel Data Cache).

**Read (Admin CSR):**

* User requests Page (`/admin`).
* Middleware verifies auth.
* Next.js sends minimal HTML shell.
* Client Component (`'use client'`) mounts in the browser.
* `useEffect` hook triggers.
* Client Component uses Supabase Client (`lib/supabase/client.ts`) to fetch data (leveraging RLS).
* Component updates state and re-renders with data.

**Write/Update (Server Actions):**

* User interacts with Client Form Component (`components/ProductForm.tsx`).
* User submits form.
* `form.handleSubmit` runs client validation (Zod, React Hook Form).
* If valid, `startTransition` calls Server Action (e.g., `createProduct` in `lib/actions.ts`).
* Server Action runs on the server.
* Server Action performs Zod validation again (server-side).
* If image present, Server Action uploads to Supabase Storage.
* Server Action uses Supabase Server Client to `INSERT` or `UPDATE` data in Supabase DB.
* Server Action calls `revalidatePath` to invalidate Vercel Data Cache.
* Server Action returns state (via `useActionState`) to the Client Form Component.
* Client Form Component reads the returned state, shows success/error toast (`sonner`), and redirects (`useRouter`) on success.

## 🔒 <a name="authentication">Authentication</a>

* User enters email on `/login` (Client Component).
* Client Component calls Supabase Client (`signInWithOtp`).
* Supabase sends Magic Link email containing a callback URL (`/auth/callback?token=...`).
* User clicks link.
* Browser hits `/auth/callback` (Route Handler).
* Route Handler uses Supabase Server Client (`exchangeCodeForSession`) to verify token and set auth cookies.
* Route Handler redirects user to `/`.
* On subsequent requests to protected routes (`/dashboard`, `/admin`):
    * `middleware.ts` runs first.
    * It uses Supabase Server Client (`getUser`) to read auth cookies.
    * If no user, redirects to `/login`.
    * If user exists, allows request to proceed.

## 챌 <a name="challenges">Challenges Faced & Solutions</a>

Developing this application involved several significant challenges:

### Turbopack/Build Tool Inconsistencies (params Promise Bug)

* **Challenge:** During local development with Turbopack, dynamic route parameters (`params.slug`) were intermittently passed as `Promise` objects instead of plain objects to Server Components, causing crashes.
* **Solution:** Implemented workarounds using `await params` locally. For deployment stability, the Product Detail Page was switched from ISR to SSR (`force-dynamic`). The final stable solution involved using the standard non-Promise signature with Next.js 14 and Webpack/Vercel's default build.

### Vercel Build Environment Discrepancies

* **Challenge:** The Vercel build environment repeatedly failed with errors (incorrect API route type signatures, Tailwind CSS configuration errors) that did not occur locally.
* **Solution:** This required meticulous debugging:
    * Downgrading from experimental Next.js 16/React 19 to stable **Next.js 14/React 18**.
    * Ensuring exact alignment of Tailwind/PostCSS config files.
    * Aggressively cleaning local caches (`.next`, `node_modules`, `npm cache`).
    * Explicitly setting the Node.js version (`"engines": { "node": "20.x" }` in `package.json`).
    * Crucially, **deploying to a completely new Vercel project** to bypass persistent caching issues.

### Server Action State Management & Client Validation

* **Challenge:** Integrating Server Actions with `react-hook-form` required ensuring client-side validation ran *before* the Server Action, and correctly displaying server-returned errors.
* **Solution:** Utilized `form.handleSubmit` to trigger client validation first. Inside its callback, `useTransition` was used to wrap the Server Action dispatch (obtained from `useFormState` / `useActionState`), providing correct pending states. Server-returned errors (`state.errors`) are mapped back to the form using `form.setError` in a `useEffect`.

### Configuration File Syntax/Handling

* **Challenge:** Inconsistencies arose with config file naming (`.ts` vs `.mjs`) and module syntax (`import` vs `require`) after dependency changes.
* **Solution:** Standardized on `next.config.mjs` and `postcss.config.mjs` using `export default`, which proved stable after downgrading to Next.js 14.

## 📸 <a name="screenshots">Screenshots</a>

(Please insert your screenshots below each heading)

* a) Homepage (/)
* b) Product Detail Page (/products/[slug])
* c) Login Page (/login)
* d) Inventory Dashboard (/dashboard)
* e) Admin Panel (/admin)
* f) Add Product Form (/admin/add)
* g) Edit Product Form (/admin/edit/[id])
* h) Cart Sheet (Open)

## 🏁 <a name="conclusion">Conclusion</a>

The NexMart project successfully demonstrates the implementation of various Next.js rendering strategies within a single application, integrated with a Supabase backend. Beyond meeting the core requirements, the project incorporates modern features like Server Actions, On-Demand Revalidation, authentication, image storage, and a client-side cart, built with TypeScript and a professional UI library. The extensive debugging process, particularly concerning build environment discrepancies, provided valuable experience in troubleshooting modern web development workflows. The final deployed application serves as a strong portfolio piece showcasing proficiency in current full-stack development practices using the Next.js ecosystem.

## 📜 <a name="appendix">Appendix: Supabase Schema (supabase_schema.sql)</a>

```sql
-- Create the 'products' table
CREATE TABLE products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  price numeric(10, 2) NOT NULL DEFAULT 0.00,
  category text,
  inventory integer NOT NULL DEFAULT 0,
  image_url text, -- Stores the public URL from Supabase Storage
  "lastUpdated" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Secure the table: Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access
CREATE POLICY "Allow public read access to products"
ON products
FOR SELECT USING (true);

-- Policy: Allow full access for authenticated users (admins)
CREATE POLICY "Allow full access for authenticated users"
ON products
FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
