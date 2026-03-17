'use client';

import ProductList from './product-list';

export default function ProductCard() {

  return (
    <main className="h-full w-full bg-[var(--txt-clr)] p-4 sm:p-6">
      {/* Responsive Header with Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/5 p-4 rounded-lg mb-6 border border-white/10">
        <h2 className="text-xl sm:text-2xl font-semibold text-[var(--pry-clr)] pry-ff">
          Product List
        </h2>
      </div>

      {/* Product List */}
      <ProductList />
    </main>
  );
}