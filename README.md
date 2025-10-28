<div align="center">
  

  <div>
    <img src="https://img.shields.io/badge/-Next.js-black?style=for-the-badge&logoColor=white&logo=next.js&color=black"/>
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
  

  <h2>NexMart</h2>
 
  <p>An e-commerce product catalog built with Next.js and Supabase.</p>

</div>

---


## 📋 <a name="table">Table of Contents</a>

1.  ✨ [Project Overview](#overview)
2.  🔗 [Links](#links)
3.  ✅ [Core Requirements](#core-requirements)
4.  🏆 [Bonus Features](#bonus-features)
5.  🎉 [Additional Features](#additional-features)
6.  🤸 [Setup and Running Locally](#quick-start)
   
---

## ✨ <a name="overview">Project Overview</a>

This project is an e-commerce product catalog built with **Next.js (App Router)** as per the assignment requirements. It demonstrates various rendering strategies (SSG, SSR, CSR) and integrates with a **Supabase** backend (Postgres, Auth, Storage).

---

## 🔗 <a name="links">Links</a>

-   **Live Demo URL:** [https://nexmart-kappa.vercel.app/](https://nexmart-kappa.vercel.app/)
-   **GitHub Repository URL:** [https://github.com/sukijaa/NexMart](https://github.com/sukijaa/NexMart)
  
---

## ✅ <a name="core-requirements">Core Requirements Met</a>

### Frontend Pages
* **Homepage (`/`):** SSG (fetches data at build time).
* **Product Detail (`/products/[slug]`):** SSR (fetches data on request, with On-Demand Revalidation via Server Actions).
* **Inventory Dashboard (`/dashboard`):** SSR (fetches live data on every request, protected route).
* **Admin Panel (`/admin`):** CSR (fetches data client-side, protected route).

### Backend
* Basic GET API routes implemented (`/api/products`, `/api/products/details`).
* Data mutations handled securely via Server Actions.

### Database
* **Supabase (Postgres)** used for product data.

### Documentation
* This README and the accompanying Report file.

---

## 🏆 <a name="bonus-features">Bonus Points & Advanced Features Implemented</a>

* **TypeScript:** Project written entirely in TypeScript.
* **Deployment:** Successfully deployed to **Vercel**.
* **On-Demand Revalidation:** Implemented `revalidatePath` in Server Actions for instant updates to cached pages upon product modification.
* **Modern Next.js Features:** Utilizes App Router, Server Actions, and Middleware for route protection.
* **Authentication:** Basic but secure Magic Link authentication implemented using **Supabase Auth** to protect admin routes (`/dashboard`, `/admin`).

---

## 🎉 <a name="additional-features">Additional Features</a>

* Product image uploads using **Supabase Storage**.
* Client-side shopping cart using **Zustand**.
* Professional UI using **Shadcn/ui** and **Tailwind CSS**.
* Form validation using **Zod** and **React Hook Form**.

---

## 🤸 <a name="quick-start">Setup and Running Locally</a>

### Prerequisites

Make sure you have the following installed on your machine:
* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/en) (v18.17+ recommended)
* [npm](https://www.npmjs.com/) (or yarn/pnpm)

### Steps:

**1. Clone the Repository:**

```bash
git clone [https://github.com/sukijaa/NexMart](https://github.com/sukijaa/NexMart)
cd NexMart
```

**2. Install Dependencies:**

```bash
npm install
```

**3. Set Up Supabase:**

1. Create a free Supabase project.
2. Run the SQL schema provided in the GitHub repository (supabase_schema.sql or see Report Appendix) in the SQL Editor.
3. Create a public Storage bucket named product-images.
4. Add Storage Policies for INSERT, UPDATE, DELETE on the bucket allowing authenticated role access only.
5. Configure Authentication -> URL Configuration:
   * Site URL: http://localhost:3000
   * Redirect URLs: Add http://localhost:3000/**

**4. Configure Environment Variables:**

1. Create .env.local in the project root.
2. Copy structure from .env.example.
3. Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY from your Supabase project settings.

**5. Seed Database (Optional):**

```bash
npm run db:seed
```
**6. Run Development Server:**

```bash
npm run dev
```
Open http://localhost:3000 in your browser.
