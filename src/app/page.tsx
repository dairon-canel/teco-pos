'use client';

import { X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import CategoryFilter from '@/components/CategoryFilter';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import { getCategories, getProducts } from '@/utils/api';

export default function Home() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterVisible, setFilterVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const observer = useRef<IntersectionObserver | null>(null);

  const loadMoreProducts = useCallback(async () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);
    try {
      // Calculate next set of products to display
      const nextProducts = filteredProducts.slice(0, page * ITEMS_PER_PAGE);

      setDisplayedProducts(nextProducts);
      setPage(prevPage => prevPage + 1);

      // Check if we've loaded all products
      if (nextProducts.length >= filteredProducts.length) {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Failed to load more products:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [filteredProducts, hasMore, loadingMore, page]);

  const lastProductRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreProducts();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore, loadMoreProducts],
  );

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(100, 0), // Get a larger set of products
          getCategories(),
        ]);
        setAllProducts(productsData);
        setFilteredProducts(productsData);
        // Initial display is just the first page
        setDisplayedProducts(productsData.slice(0, ITEMS_PER_PAGE));
        setCategories(categoriesData);
        setHasMore(productsData.length > ITEMS_PER_PAGE);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Track scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Simple scroll direction detection
      const isScrollingDown = currentScrollY > lastScrollY;

      // Hide on scroll down, show on scroll up
      if (isScrollingDown) {
        setFilterVisible(false);
      } else {
        setFilterVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Apply filters
  useEffect(() => {
    let result = allProducts;

    // Apply category filter
    if (selectedCategory) {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Apply search query if present
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        product =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query),
      );
    }

    setFilteredProducts(result);
    // Reset pagination when filters change
    setDisplayedProducts(result.slice(0, ITEMS_PER_PAGE));
    setPage(2);
    setHasMore(result.length > ITEMS_PER_PAGE);
  }, [allProducts, selectedCategory, searchQuery]);

  // Update the useEffect to set the search query from URL parameters
  useEffect(() => {
    const query = searchParams.get('query') || '';
    setSearchQuery(query);
  }, [searchParams]);

  // Handle category selection
  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 hover:cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        className={cn(
          'sticky top-16 z-30 bg-white pb-2 pt-4 border-b -mx-4',
          filterVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-full',
          'transition-all duration-300 ease-in-out',
        )}
      >
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
      </div>

      {/* Search results heading */}
      {searchQuery && (
        <div className="mt-24 -mb-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-medium">
              {filteredProducts.length === 0
                ? `No results found for "${searchQuery}"`
                : `Search results for "${searchQuery}"`}
            </h2>
            <button
              onClick={() => {
                setSearchQuery('');
                // Update URL to remove the query parameter
                const url = new URL(window.location.href);
                url.searchParams.delete('query');
                window.history.pushState({}, '', url);
              }}
              className="inline-flex items-center gap-1 px-2 py-1 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 hover:cursor-pointer transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg mt-8">
          <p className="text-gray-600">
            No products found. Try a different search or category.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-24">
            {displayedProducts.map((product, index) => {
              // Add ref to the last product for intersection observer
              if (displayedProducts.length === index + 1) {
                return (
                  <div ref={lastProductRef} key={product.id}>
                    <ProductCard
                      id={product.id}
                      title={product.title}
                      price={product.price}
                      image={product.image}
                      category={product.category}
                    />
                  </div>
                );
              } else {
                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    image={product.image}
                    category={product.category}
                  />
                );
              }
            })}
          </div>

          {/* Loading indicator for infinite scrolling */}
          {loadingMore && (
            <div className="flex justify-center my-8">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* End of results message */}
          {!hasMore && displayedProducts.length > 0 && (
            <div className="text-center my-8 text-gray-500">
              You&apos;ve reached the end of the results
            </div>
          )}
        </>
      )}
    </div>
  );
}
