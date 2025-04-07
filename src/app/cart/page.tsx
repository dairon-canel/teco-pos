'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import CartControls from '@/components/CartControls';
import { CartItem, useCart } from '@/context/CartContext';

export default function Cart() {
  const router = useRouter();
  const { items, removeFromCart, getTotalPrice } = useCart();

  const handleRemove = (id: number) => {
    removeFromCart(id);
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="bg-gray-50 rounded-lg p-8 max-w-lg mx-auto">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
              {items.map((item: CartItem) => (
                <li key={item.id} className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative h-24 w-24 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.title}
                        </h3>
                        <p className="text-lg font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        ${item.price.toFixed(2)} each
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="w-40">
                          <CartControls product={item} showCartButton={false} />
                        </div>

                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-sm text-red-600 hover:text-red-500 hover:cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Order Summary
          </h2>

          <div className="flex justify-between mb-2">
            <p className="text-gray-600">Subtotal</p>
            <p className="text-gray-900">${getTotalPrice().toFixed(2)}</p>
          </div>

          <div className="flex justify-between mb-2">
            <p className="text-gray-600">Shipping</p>
            <p className="text-gray-900">Free</p>
          </div>

          <div className="border-t border-gray-200 my-4"></div>

          <div className="flex justify-between mb-6">
            <p className="text-lg font-medium text-gray-900">Total</p>
            <p className="text-lg font-medium text-gray-900">
              ${getTotalPrice().toFixed(2)}
            </p>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md hover:cursor-pointer"
          >
            Proceed to Checkout
          </button>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
