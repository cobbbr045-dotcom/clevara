import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Shield, Droplet } from 'lucide-react';
import { ProductCard } from '../../components/product/ProductCard.js';
import { Product, Category } from '../../types/index.js';
import { api } from '../../api/client.js';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    api.getCategories()
      .then(res => {
        if (res.success) {
          const found = res.categories.find(c => c.slug === slug);
          setCategory(found || null);

          if (found) {
            return api.getProducts({ categoryId: found.id });
          }
        }
        return { success: false, products: [] };
      })
      .then(prodRes => {
        if (prodRes && prodRes.success) {
          setProducts(prodRes.products);
        }
      })
      .catch(err => {
        console.error('Failed to load category products:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen py-24 text-center">
        <div className="w-8 h-8 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500">Loading collection...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen py-24 text-center max-w-md mx-auto px-4">
        <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">Category Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">The requested collection does not exist.</p>
        <Link to="/shop" className="px-5 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-semibold">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB]">
      
      {/* Category Hero Banner */}
      <section className="relative bg-slate-950 text-white py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img
            src={category.image_url}
            alt={category.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Products
          </Link>

          <div className="max-w-2xl">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-2">
              CLEVARA Product Line
            </span>
            <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
              {category.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      {/* Products Listing */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display font-bold text-xl text-slate-900">
              Available Formulations ({products.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Laboratory-tested products available for immediate nationwide courier dispatch.
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="font-display font-bold text-base text-slate-900 mb-1">Upcoming Batch Release</h3>
            <p className="text-xs text-slate-500 mb-4">
              Products in this category are currently being freshly batched. Please check back shortly.
            </p>
            <Link to="/shop" className="text-xs font-semibold text-emerald-800 hover:underline">
              Browse Other Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
