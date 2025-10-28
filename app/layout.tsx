// File: app/layout.tsx
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';
import CartSheet from '@/components/CartSheet'; // <-- Import CartSheet

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'NexMart E-Commerce',
  description: 'A demo e-commerce app built with Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
      >
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
        </div>
        <CartSheet /> {/* <-- ADD THIS COMPONENT */}
        <Toaster richColors position="top-right" /> {/* Added position prop */}
      </body>
    </html>
  );
}