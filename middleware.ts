// File: middleware.ts

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // 1. Create a response object
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Create the Supabase client
  // This client will automatically read/write cookies from the request/response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the set method is called, we need to update
          // the request cookies and the response cookies
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          // If the remove method is called, we need to update
          // the request cookies and the response cookies
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // 3. Refresh the session and get the user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 4. Define protected routes
  const protectedRoutes = ['/dashboard', '/admin'];
  const currentPath = request.nextUrl.pathname;

  // 5. Redirect unauthenticated users
  if (!user && protectedRoutes.some((path) => currentPath.startsWith(path))) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 6. Redirect authenticated users away from login
  // (Sending to the homepage as you requested)
  if (user && currentPath.startsWith('/login')) {
    const url = request.nextUrl.clone();
    url.pathname = '/'; // Redirect to homepage
    return NextResponse.redirect(url);
  }

  // 7. All good, continue the request
  return response;
}

// 8. Configure the matcher
// This matcher correctly protects /dashboard and /admin,
// and also runs on /login (so it can redirect you).
// It ignores all public files, API routes, and the homepage.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|products|api/products|auth/callback|/$).*)',
  ],
};