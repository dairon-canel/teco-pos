import { Product } from '../context/CartContext';

const API_BASE_URL = 'https://fakestoreapi.com';

export async function getProducts(
  limit: number = 20,
  offset: number = 0,
): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const products = await response.json();

  return products.slice(offset, offset + limit);
}

export async function getProductsCount(): Promise<number> {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products count');
  }
  const products = await response.json();
  return products.length;
}

export async function getProduct(id: number): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch product with id ${id}`);
  }
  return response.json();
}

export async function getCategories(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/products/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
}

export async function getProductsByCategory(
  category: string,
  limit: number = 20,
  offset: number = 0,
): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products/category/${category}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch products in category ${category}`);
  }
  const products = await response.json();

  return products.slice(offset, offset + limit);
}

export async function getRelatedProducts(
  productId: number,
  category: string,
  limit: number = 4,
): Promise<Product[]> {
  // Get products from the same category
  const products = await getProductsByCategory(category);

  // Filter out the current product and limit the results
  return products.filter(product => product.id !== productId).slice(0, limit);
}
