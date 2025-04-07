'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { CartItem, useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import { validateField } from '@/utils/validations';

interface ShippingDetails {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  email: string;
  phone: string;
}

// Field validation error interface
interface FieldErrors {
  [key: string]: string;
}

export default function Checkout() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Form state
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    email: '',
    phone: '',
  });

  // Use useEffect to handle redirect instead of doing it during render
  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      router.push('/cart');
    }
  }, [items.length, orderComplete, router]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Remove field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Trim whitespace for all inputs except address
    const trimmedValue = name !== 'address' ? value.trim() : value;

    setShippingDetails(prev => ({
      ...prev,
      [name]: trimmedValue,
    }));
  };

  // Validate the entire form
  const validateForm = (): boolean => {
    const errors: FieldErrors = {};
    let isValid = true;

    // Check all fields and collect errors
    Object.entries(shippingDetails).forEach(([field, value]) => {
      const error = validateField(field, value);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });

    // Update field errors state
    setFieldErrors(errors);

    if (!isValid) {
      setValidationError('Please correct the highlighted fields');
      return false;
    }

    // All fields are valid
    setValidationError(null);
    return true;
  };

  const handleSubmitOrder = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to the first error if there are any
      const firstErrorField = Object.keys(fieldErrors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element)
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    // Simulate order processing
    setTimeout(() => {
      // Sanitize inputs before submission to prevent XSS
      /* const sanitizedDetails = Object.entries(shippingDetails).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: sanitizeInput(value),
        }),
        {} as ShippingDetails,
      ); */

      // Send sanitized details to the server
      // await sendOrderDetails(sanitizedDetails);

      // Generate random order number
      const randomOrderNumber = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, '0');
      setOrderNumber(randomOrderNumber);
      setOrderComplete(true);
      clearCart();
      setIsSubmitting(false);
    }, 1500);
  };

  // Show loading state while checking cart or redirecting
  if (items.length === 0 && !orderComplete) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking your cart...</p>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="text-center py-12">
        <div className="bg-green-50 rounded-lg p-8 max-w-lg mx-auto">
          <svg
            className="w-16 h-16 text-green-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mb-4">
            Your order #{orderNumber} has been placed successfully.
          </p>
          <div className="text-left bg-white p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Shipping Details:</h3>
            <p>
              {shippingDetails.firstName} {shippingDetails.lastName}
            </p>
            <p>{shippingDetails.address}</p>
            <p>
              {shippingDetails.city}, {shippingDetails.postalCode}
            </p>
            <p>Email: {shippingDetails.email}</p>
            <p>Phone: {shippingDetails.phone}</p>
          </div>
          <p className="text-gray-600 mb-6">Thank you for shopping with us!</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 hover:cursor-pointer"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmitOrder} noValidate>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md mb-6 pl-6 py-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Order Summary
              </h2>

              <ul className="divide-y divide-gray-200 max-h-[300px] overflow-y-auto pr-4">
                {items.map((item: CartItem) => (
                  <li key={item.id} className="py-4 flex gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="text-sm font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Shipping Information
              </h2>

              {validationError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                  {validationError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="firstName"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={shippingDetails.firstName}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                    className={fieldErrors.firstName ? 'border-red-500' : ''}
                    aria-invalid={!!fieldErrors.firstName}
                    aria-describedby={
                      fieldErrors.firstName ? 'firstName-error' : undefined
                    }
                  />
                  {fieldErrors.firstName && (
                    <p
                      id="firstName-error"
                      className="text-red-500 text-xs mt-1"
                    >
                      {fieldErrors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="lastName"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={shippingDetails.lastName}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                    className={fieldErrors.lastName ? 'border-red-500' : ''}
                    aria-invalid={!!fieldErrors.lastName}
                    aria-describedby={
                      fieldErrors.lastName ? 'lastName-error' : undefined
                    }
                  />
                  {fieldErrors.lastName && (
                    <p
                      id="lastName-error"
                      className="text-red-500 text-xs mt-1"
                    >
                      {fieldErrors.lastName}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="address"
                  >
                    Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="address"
                    name="address"
                    value={shippingDetails.address}
                    onChange={handleInputChange}
                    required
                    maxLength={100}
                    className={fieldErrors.address ? 'border-red-500' : ''}
                    aria-invalid={!!fieldErrors.address}
                    aria-describedby={
                      fieldErrors.address ? 'address-error' : undefined
                    }
                  />
                  {fieldErrors.address && (
                    <p id="address-error" className="text-red-500 text-xs mt-1">
                      {fieldErrors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="city"
                  >
                    City <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="city"
                    name="city"
                    value={shippingDetails.city}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                    className={fieldErrors.city ? 'border-red-500' : ''}
                    aria-invalid={!!fieldErrors.city}
                    aria-describedby={
                      fieldErrors.city ? 'city-error' : undefined
                    }
                  />
                  {fieldErrors.city && (
                    <p id="city-error" className="text-red-500 text-xs mt-1">
                      {fieldErrors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="postalCode"
                  >
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={shippingDetails.postalCode}
                    onChange={handleInputChange}
                    required
                    className={fieldErrors.postalCode ? 'border-red-500' : ''}
                    aria-invalid={!!fieldErrors.postalCode}
                    aria-describedby={
                      fieldErrors.postalCode ? 'postalCode-error' : undefined
                    }
                  />
                  {fieldErrors.postalCode && (
                    <p
                      id="postalCode-error"
                      className="text-red-500 text-xs mt-1"
                    >
                      {fieldErrors.postalCode}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="email"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={shippingDetails.email}
                    onChange={handleInputChange}
                    required
                    className={fieldErrors.email ? 'border-red-500' : ''}
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={
                      fieldErrors.email ? 'email-error' : undefined
                    }
                  />
                  {fieldErrors.email && (
                    <p id="email-error" className="text-red-500 text-xs mt-1">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="phone"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={shippingDetails.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="(123) 456-7890"
                    className={fieldErrors.phone ? 'border-red-500' : ''}
                    aria-invalid={!!fieldErrors.phone}
                    aria-describedby={
                      fieldErrors.phone ? 'phone-error' : undefined
                    }
                  />
                  {fieldErrors.phone && (
                    <p id="phone-error" className="text-red-500 text-xs mt-1">
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Payment</h2>

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
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md hover:cursor-pointer',
                isSubmitting ? 'opacity-70 cursor-not-allowed' : '',
              )}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Complete Order'
              )}
            </button>

            <div className="mt-4 text-center">
              <Link
                href="/cart"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Return to Cart
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
