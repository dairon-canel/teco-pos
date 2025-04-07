'use client';

import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { CartItem, useCart } from '@/context/CartContext';

export default function CartSheet() {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeFromCart,
    getTotalItems,
    getTotalPrice,
  } = useCart();

  // Reference to trigger button for programmatic opening
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Listen for the custom event to open the cart
  useEffect(() => {
    const handleOpenCart = () => {
      if (triggerRef.current) {
        triggerRef.current.click();
      }
    };
    const handleCloseCart = () => {
      if (triggerRef.current) {
        triggerRef.current.click();
      }
    };

    document.addEventListener('open-cart', handleOpenCart);
    document.addEventListener('close-cart', handleCloseCart);
    return () => {
      document.removeEventListener('open-cart', handleOpenCart);
      document.removeEventListener('close-cart', handleCloseCart);
    };
  }, []);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    updateQuantity(id, newQuantity);
  };

  const handleRemove = (id: number) => {
    removeFromCart(id);
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          ref={triggerRef}
          className="relative p-2 text-gray-700 hover:text-blue-600 hover:cursor-pointer"
        >
          <ShoppingCart className="h-6 w-6" />
          {getTotalItems() > 0 && (
            <span className="absolute top-0 right-0 bg-blue-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {getTotalItems()}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-[350px] sm:w-[450px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Your Cart ({getTotalItems()})</SheetTitle>
          <p className="text-xs text-gray-500">
            Your cart is saved automatically
          </p>
        </SheetHeader>

        <div className="flex flex-col gap-5 my-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <button
                onClick={() => {
                  document.dispatchEvent(new Event('close-cart'));
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 hover:cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {items.map((item: CartItem) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b">
                  <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-white">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      style={{ objectFit: 'contain' }}
                      className="p-2"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      ${item.price.toFixed(2)} each
                    </p>

                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100 hover:cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 py-1">{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100 hover:cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-sm text-red-600 hover:text-red-500 hover:cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="flex-col gap-4 sm:flex-col">
            <div className="space-y-2 w-full">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-2 w-full">
              <button
                onClick={() => {
                  document.dispatchEvent(new Event('close-cart'));
                  handleCheckout();
                }}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md hover:cursor-pointer"
              >
                Checkout
              </button>
              <button
                onClick={() => {
                  document.dispatchEvent(new Event('close-cart'));
                  router.push('/cart');
                }}
                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md hover:cursor-pointer"
              >
                View Cart
              </button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
