'use client';

import Link from 'next/link';

import CartSheet from './CartSheet';
import NavbarSearch from './NavbarSearch';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">TecoPOS</span>
            </Link>
          </div>

          <div className="flex items-center space-x-1">
            <NavbarSearch />
            <CartSheet />
          </div>
        </div>
      </div>
    </nav>
  );
}
