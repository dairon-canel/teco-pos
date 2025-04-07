'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import CartControls from '@/components/CartControls';
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import {
    Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious
} from '@/components/ui/carousel';
import { Product, useCart } from '@/context/CartContext';
import { getProduct, getRelatedProducts } from '@/utils/api';

export default function ProductDetail() {
  const params = useParams();
  const { items } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const id = Number(params.id);
        if (isNaN(id)) {
          setError('Invalid product ID');
          return;
        }

        const productData = await getProduct(id);
        setProduct(productData);

        // Fetch related products
        const related = await getRelatedProducts(id, productData.category);
        setRelatedProducts(related);
      } catch (err) {
        setError('Failed to load product. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params.id]);

  // Check if product is already in cart (just for the badge display)
  useEffect(() => {
    if (product) {
      const cartItem = items.find(item => item.id === product.id);
      setInCart(!!cartItem);
    }
  }, [items, product]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-600">{error || 'Product not found'}</p>
        <button
          onClick={() => window.history.back()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 hover:cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-24 mb-16">
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="overflow-hidden p-0">
          <div className="relative h-[400px] w-full bg-white">
            <Image
              src={product.image}
              alt={product.title}
              fill
              style={{ objectFit: 'contain' }}
              className="p-8"
            />
            {inCart && (
              <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                In Cart
              </div>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="text-sm text-gray-500 uppercase">
              {product.category}
            </CardDescription>
            <CardTitle className="text-2xl font-bold">
              {product.title}
            </CardTitle>

            <div className="flex items-center mt-2">
              <div className="flex items-center mr-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(product.rating.rate)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600">
                ({product.rating.count} reviews)
              </span>
            </div>

            <p className="text-3xl font-bold text-gray-900 mt-4">
              ${product.price.toFixed(2)}
            </p>
          </CardHeader>

          <CardContent>
            <h2 className="text-lg font-medium mb-2">Description</h2>
            <p className="text-gray-700">{product.description}</p>
          </CardContent>

          <CardFooter>
            <CartControls product={product} />
          </CardFooter>
        </Card>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <Carousel
            opts={{
              align: 'start',
              loop: relatedProducts.length > 3,
            }}
            className="w-full"
          >
            <CarouselContent>
              {relatedProducts.map(relatedProduct => (
                <CarouselItem
                  key={relatedProduct.id}
                  className="md:basis-1/3 lg:basis-1/4"
                >
                  <Link href={`/product/${relatedProduct.id}`}>
                    <div className="p-1">
                      <Card className="h-full overflow-hidden">
                        <div className="relative h-48 w-full bg-white">
                          <Image
                            src={relatedProduct.image}
                            alt={relatedProduct.title}
                            fill
                            style={{ objectFit: 'contain' }}
                            className="p-4 transition-transform hover:scale-105"
                          />
                        </div>
                        <CardHeader className="p-4">
                          <CardDescription className="text-xs text-gray-500 uppercase">
                            {relatedProduct.category}
                          </CardDescription>
                          <CardTitle className="text-sm font-medium text-gray-900 truncate">
                            {relatedProduct.title}
                          </CardTitle>
                          <p className="mt-1 text-sm font-semibold text-gray-900">
                            ${relatedProduct.price.toFixed(2)}
                          </p>
                        </CardHeader>
                      </Card>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>
      )}
    </div>
  );
}
