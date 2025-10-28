// File: components/Header.tsx
'use client'; // Essential for using hooks like useState, useEffect, useCartStore

import { useState, useEffect } from 'react'; // Import hooks
import Link from 'next/link';
import { Button } from './ui/button';
import LogoutButton from './LogoutButton';
import { createClient } from '@/lib/supabase/client'; // Use the CLIENT Supabase helper
import { useCartStore } from '@/lib/store';
import { ShoppingBag } from 'lucide-react';
import type { User } from '@supabase/supabase-js'; // Import User type

export default function Header() {
  // Get cart state
  const toggleCart = useCartStore((state) => state.toggleCart);
  const totalItems = useCartStore((state) => state.getTotalItems());

  // State for user session
  const [user, setUser] = useState<User | null>(null); // Use Supabase User type
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      // Use onAuthStateChange for real-time updates
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );

      // Initial check
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);


      // Cleanup listener on component unmount
      return () => {
        authListener?.subscription.unsubscribe();
      };
    };

    checkUser();
  }, []); // Run only once on mount

  // Removed server-side cookie/supabase logic

  return (
    <header className="w-full border-b sticky top-0 bg-background/95 backdrop-blur z-10">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-bold transition-colors hover:text-primary"
        >
          NexMart
        </Link>
        <div className="flex items-center gap-4">
          {/* Cart Button */}
         <Button variant="ghost" size="icon" className="relative" onClick={toggleCart}>
             <ShoppingBag className="h-5 w-5" />
             {totalItems > 0 && (
                 <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                     {totalItems > 9 ? '9+' : totalItems} {/* Show 9+ if > 9 */}
                 </span>
             )}
             <span className="sr-only">Open Cart</span>
         </Button>

          {/* Auth Buttons - Conditionally render based on loading state */}
          {!loading && (
            <>
              {user ? (
                <>
                  <span className="text-sm text-gray-600 hidden sm:inline">
                    {user.email}
                  </span>
                  <Button asChild variant="secondary">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <LogoutButton />
                </>
              ) : (
                <Button asChild>
                  <Link href="/login">Admin Login</Link>
                </Button>
              )}
            </>
          )}
           {/* Optionally show a loading indicator */}
           {loading && <span className="text-sm text-gray-500">Loading...</span>}
        </div>
      </nav>
    </header>
  );
}