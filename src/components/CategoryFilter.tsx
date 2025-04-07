'use client';

import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="px-4">
      <div className="overflow-x-auto hide-scrollbar -mx-2 pb-2">
        <div className="flex space-x-2 px-1 min-w-max">
          <button
            onClick={() => onSelectCategory('')}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium hover:cursor-pointer whitespace-nowrap',
              selectedCategory === ''
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300',
            )}
          >
            All Products
          </button>

          {categories.map(category => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium hover:cursor-pointer whitespace-nowrap',
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300',
              )}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
