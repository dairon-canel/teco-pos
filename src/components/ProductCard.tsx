import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';

import CartControls from './CartControls';

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
}

export default function ProductCard({
  id,
  title,
  price,
  image,
  category,
}: ProductCardProps) {
  const { items } = useCart();
  const [inCart, setInCart] = useState(false);

  // Check if item is already in cart (just for the badge display)
  useEffect(() => {
    const cartItem = items.find(item => item.id === id);
    setInCart(!!cartItem);
  }, [items, id]);

  // Create a product object for the CartControls component
  const product = {
    id,
    title,
    price,
    image,
    category,
    description: '',
    rating: { rate: 0, count: 0 },
  };

  return (
    <Card className="h-full overflow-hidden">
      <Link href={`/product/${id}`} className="block overflow-hidden">
        <div className="relative h-64 w-full bg-white">
          <Image
            src={image}
            alt={title}
            fill
            style={{ objectFit: 'contain' }}
            className="p-4 transition-transform hover:scale-105"
          />
          {inCart && (
            <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
              In Cart
            </div>
          )}
        </div>
      </Link>

      <CardHeader className="p-4 pt-0">
        <CardDescription className="text-xs text-gray-500 uppercase">
          {category}
        </CardDescription>
        <CardTitle className="text-lg font-medium text-gray-900 truncate">
          {title}
        </CardTitle>
        <p className="mt-1 text-lg font-semibold text-gray-900">
          ${price.toFixed(2)}
        </p>
      </CardHeader>

      <CardFooter className="p-4 pt-0">
        <CartControls product={product} />
      </CardFooter>
    </Card>
  );
}
