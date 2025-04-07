'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, Suspense } from 'react';

import Navbar from '@/components/Navbar';
import { CartProvider } from '@/context/CartContext';
import { cn } from '@/lib/utils';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const isCheckoutPage = pathname === '/checkout';

  return (
    <CartProvider>
      {!isCheckoutPage && <Navbar />}
      <main
        className={cn(
          'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
          isCheckoutPage ? 'py-8' : 'pt-24',
        )}
      >
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </main>
    </CartProvider>
  );
}
