'use client';

import { Search, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import { Product } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import { getProducts } from '@/utils/api';

export default function NavbarSearch() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  // Fetch products on mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        const products = await getProducts();
        setAllProducts(products);
      } catch (error) {
        console.error('Failed to fetch products for search:', error);
      }
    }

    fetchProducts();
  }, []);

  // Reset search when changing pages
  useEffect(() => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setShowResults(false);
  }, [pathname]);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    const debounceTimer = setTimeout(() => {
      const filteredResults = allProducts.filter(
        product =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      setSearchResults(filteredResults.slice(0, 6)); // Limit to 6 results
      setShowResults(true);
      setIsLoading(false);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, allProducts]);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Focus the input when opening
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      // Clear search when closing
      setSearchQuery('');
      setShowResults(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="relative">
      <button
        onClick={toggleSearch}
        className={cn(
          'p-2 text-gray-700 hover:text-blue-600 rounded-full hover:bg-gray-100 hover:cursor-pointer mr-1',
          isSearchOpen && 'text-white',
        )}
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
      </button>

      {/* Animated search input */}
      <div
        className={cn(
          'absolute right-0 top-0 flex items-center overflow-hidden transition-all duration-300',
          isSearchOpen ? 'w-64 opacity-100 visible' : 'w-0 opacity-0 invisible',
        )}
      >
        <div className="relative w-full">
          <Input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search products..."
            className="w-full pr-10 rounded-none overflow-hidden"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search results dropdown with carousel */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg z-50 border border-gray-200 py-2">
          <div className="px-4 py-2 text-sm font-medium text-gray-500 border-b border-gray-200">
            {isLoading
              ? 'Searching...'
              : `${searchResults.length} results found`}
          </div>

          <div className="px-4 py-3">
            <Carousel
              opts={{
                align: 'start',
                loop: false,
                dragFree: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {searchResults.map(product => (
                  <CarouselItem
                    key={product.id}
                    className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/3"
                  >
                    <div className="h-full">
                      <Link
                        href={`/product/${product.id}`}
                        className="h-full flex flex-col group"
                        onClick={() => setShowResults(false)}
                      >
                        <div className="relative h-36 w-full bg-white rounded-md border border-gray-200 group-hover:border-blue-300 transition-colors overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            style={{ objectFit: 'contain' }}
                            className="p-3"
                            sizes="(max-width: 768px) 100vw, 33vw"
                            priority
                          />
                        </div>
                        <div className="mt-2 px-1 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            ${product.price.toFixed(2)}
                          </p>
                        </div>
                      </Link>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-end mt-2 gap-1 pr-2">
                <CarouselPrevious className="static translate-y-0 translate-x-0 rounded-sm size-6 opacity-80 hover:opacity-100 hover:cursor-pointer" />
                <CarouselNext className="static translate-y-0 translate-x-0 rounded-sm size-6 opacity-80 hover:opacity-100 hover:cursor-pointer" />
              </div>
            </Carousel>
          </div>

          <div className="px-4 py-2 border-t border-gray-200">
            <Link
              href={`/?query=${encodeURIComponent(searchQuery)}`}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline block text-center w-full hover:cursor-pointer"
              onClick={() => setShowResults(false)}
            >
              See all results
            </Link>
          </div>
        </div>
      )}

      {/* No results message */}
      {showResults &&
        searchQuery &&
        searchResults.length === 0 &&
        !isLoading && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 border border-gray-200 p-4">
            <p className="text-gray-600 text-center">No products found</p>
          </div>
        )}
    </div>
  );
}
