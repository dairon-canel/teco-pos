'use client';

import { ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Product, useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

interface CartControlsProps {
  product: Product;
  showCartButton?: boolean;
  onQuantityChange?: (quantity: number) => void;
}

export default function CartControls({
  product,
  showCartButton = true,
  onQuantityChange,
}: CartControlsProps) {
  const { items, addToCart, updateQuantity } = useCart();
  const [inCart, setInCart] = useState(false);
  const [quantity, setQuantity] = useState(0);

  // Check if item is already in cart
  useEffect(() => {
    const cartItem = items.find(item => item.id === product.id);
    if (cartItem) {
      setInCart(true);
      setQuantity(cartItem.quantity);
    } else {
      setInCart(false);
      setQuantity(0);
    }
  }, [items, product.id]);

  const handleAddToCart = () => {
    addToCart(product);
    setInCart(true);
    setQuantity(1);
    if (onQuantityChange) onQuantityChange(1);
  };

  const handleIncreaseQuantity = () => {
    updateQuantity(product.id, quantity + 1);
    if (onQuantityChange) onQuantityChange(quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
      if (onQuantityChange) onQuantityChange(quantity - 1);
    } else {
      updateQuantity(product.id, 0); // This will remove the item
      setInCart(false);
      if (onQuantityChange) onQuantityChange(0);
    }
  };

  const openCart = () => {
    document.dispatchEvent(new Event('open-cart'));
  };

  if (!inCart) {
    return (
      <button
        onClick={handleAddToCart}
        className={cn(
          'w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors hover:cursor-pointer py-2 px-4',
        )}
      >
        Add to Cart
      </button>
    );
  }

  return (
    <div className="w-full flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <button
          onClick={handleDecreaseQuantity}
          className={cn(
            'bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium',
            'rounded-md transition-colors hover:cursor-pointer px-3 py-2',
          )}
        >
          -
        </button>
        <span className="font-medium text-gray-800 text-center w-8">
          {quantity}
        </span>
        <button
          onClick={handleIncreaseQuantity}
          className={cn(
            'bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium',
            'rounded-md transition-colors hover:cursor-pointer px-3 py-2',
          )}
        >
          +
        </button>
      </div>

      {showCartButton && (
        <button
          onClick={openCart}
          className={cn(
            'flex-grow bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md',
            'transition-colors flex items-center justify-center gap-1 hover:cursor-pointer py-2 px-4',
          )}
        >
          <ShoppingBag className="w-4 h-4" />
          Cart
        </button>
      )}
    </div>
  );
}
