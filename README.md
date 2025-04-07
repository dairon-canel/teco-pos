# TecoPOS - Online Store

This is an online store project built with Next.js, React, and Tailwind CSS. The application uses the [Fake Store API](https://fakestoreapi.com/) to provide product data.

## Features

- **Homepage with Product Listing**: View all products with images, names, prices, and "Add to Cart" functionality.
- **Search and Category Filtering**: Filter products by category or search for specific products.
- **Product Detail Page**: View detailed information about each product.
- **Shopping Cart**: Add products to cart, update quantities, remove items, and view total prices.
- **Checkout Page**: Review order and complete the purchase.

## Getting Started

### Prerequisites

Make sure you have Node.js installed (version 18 or higher).

### Installation

1. Clone the repository:

```bash
git clone https://github.com/dairon-canel/teco-pos.git
cd teco-pos
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/src/app`: App router code
  - `/app/product/[id]`: Product detail page
  - `/app/cart`: Shopping cart page
  - `/app/checkout`: Order confirmation page
- `/src/components`: Reusable UI components
- `/src/context`: Context providers (CartContext)
- `/src/utils`: Utility functions and API communication

## Technologies Used

- **Next.js**: React framework for server-side rendering and routing
- **React**: Frontend library
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: For type safety

## API

This project uses the [Fake Store API](https://fakestoreapi.com/) to fetch product data.

## Deployment

The app can be deployed using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/dairon-canel/teco-pos)
