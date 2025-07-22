'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import PulseLoader from '@/components/pulse-loader';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  productImg: string[];
  stock: number;
  location: string;
  productStatus: string;
  averageRating?: number;
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    const api_url = process.env.NEXT_PUBLIC_API_URL;
    try {
      const res = await fetch(`${api_url}/api/v1/product/my-products`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        setProducts(data.data.enrichedProducts ?? []);
      } else {
        setError(data.message ?? 'Failed to fetch products');
        toast.error(data.message ?? 'Failed to fetch products');
      }
    } catch (err) {
      setError('An error occurred while fetching products');
      toast.error('An error occurred while fetching products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateProductStatus = async (
    productId: string,
    action: 'approve' | 'decline'
  ) => {
    const product = products.find((p) => p._id === productId);
    if (!product || product.productStatus !== 'pending') {
      toast.error('This product has already been moderated.');
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/super-admin/product/${productId}/moderate?action=${action}`,
        {
          method: 'PATCH',
          credentials: 'include',
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Failed to update product status');
      } else {
        toast.success(`Product ${action}d successfully`);
        setProducts((prev) =>
          prev.map((p) =>
            p._id === productId
              ? { ...p, productStatus: action === 'approve' ? 'approve' : 'declined' }
              : p
          )
        );
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  let content: React.ReactNode;

  if (loading) {
    content = (
      <div className="flex items-center justify-center h-64">
        <PulseLoader />
      </div>
    );
  } else if (error) {
    content = <p className="text-red-500 text-center">{error}</p>;
  } else if (products.length === 0) {
    content = (
      <div className="text-center py-12">
        <Image
          src="/no-product.jpg"
          alt="No products found"
          width={200}
          height={200}
          className="mx-auto mb-4"
        />
        <h3 className="text-lg font-semibold text-[var(--txt-clr)] sec-ff">No Products Available</h3>
        <p className="text-gray-500 sec-ff">You haven’t added any products yet.</p>
      </div>
    );
  } else {
    content = (
      <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2">
        {products.map((product) => (
          <li
            key={product._id}
            className="bg-white dark:bg-[var(--bg-clr)] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700 flex flex-col"
          >
            {/* Product Image */}
            <div className="relative w-full h-48 overflow-hidden">
              <Image
                src={product.productImg?.[0] || '/fallback.jpg'}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Product Details */}
            <div className="p-4 flex flex-col justify-between h-full space-y-3 sec-ff flex-1">
              <div>
                <h4 className="text-lg font-semibold text-[var(--txt-clr)] mb-1 pry-ff">
                  {product.title}
                </h4>
                {typeof product.averageRating === 'number' && (
                    <div className="text-yellow-500 text-sm mt-1 flex items-center gap-1">
                      <span className="font-medium">{product.averageRating.toFixed(1)}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">/5</span>
                    </div>
                )}
                
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 sec-ff mb-2">
                  {product.description}
                </p>

                <p className="text-xl font-bold text-[var(--txt-clr)] sec-ff mb-3">
                  ₦{product.price.toLocaleString()}
                </p>

                <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <span
                    className={`px-2 py-1 rounded-md ${
                      product.stock === 0
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 dark:bg-white/10 text-black dark:text-white'
                    }`}
                  >
                    {product.stock === 0 ? 'Sold Out' : `Stock: ${product.stock}`}
                  </span>

                  <span className="bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-md">
                    {product.location}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-md text-white capitalize ${
                      product.productStatus === 'approve'
                      ? 'bg-green-500'
                      : product.productStatus === 'declined'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                    }`}
                  >
                    {product.productStatus}
                  </span>
                </div>

                <Link
                  href={`/dashboard/all-products/${product._id}`}
                  className="group flex items-center gap-2 text-[var(--acc-clr)] font-medium hover:underline mb-4"
                >
                  <span>View Details</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>

              {/* Action Buttons - Only show if pending */}
              {product.productStatus === 'pending' && (
                <div className="flex gap-2 mt-auto">
                  <button
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-md text-sm font-semibold transition duration-300"
                    onClick={() => updateProductStatus(product._id, 'approve')}
                  >
                    Approve
                  </button>
                  <button
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md text-sm font-semibold transition duration-300"
                    onClick={() => updateProductStatus(product._id, 'decline')}
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <main className="p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-[var(--txt-clr)] pry-ff">
        Your Products
      </h2>
      {content}
    </main>
  );
}