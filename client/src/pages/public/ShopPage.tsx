import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { ProductCard } from '../../components/product/ProductCard.js';
import { Product, Category } from '../../types/index.js';
import { api } from '../../api/client.js';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const categoryFilter = searchParams.get('category') || '';
  const searchFilter = searchParams.get('search') || '';
  const sortFilter = searchParams.get('sort') || 'newest';
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    api.getCategories()
      .then(res => {
        if (res.success) setCategories(res.categories);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    let selectedCatId = '';
    if (categoryFilter) {
      const match = categories.find(c => c.slug === categoryFilter);
      if (match) selectedCatId = match.id;
    }

    api.getProducts({
      categoryId: selectedCatId || undefined,
      search: searchFilter || undefined,
      sort: sortFilter || undefined
    })
      .then(res => {
        if (res.success) {
          setProducts(res.products);
        }
      })
      .catch(err => {
        console.error('Failed to load products:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoryFilter, searchFilter, sortFilter, categories]);

  const handleCategorySelect = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', e.target.value);
    setSearchParams(params);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams);
    if (e.target.value) {
      params.set('search', e.target.value);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setInStockOnly(false);
  };

  const filteredProducts = inStockOnly
    ? products.filter(p => p.stock_quantity > 0 || (p.variants && p.variants.some(v => v.stock_quantity > 0)))
    : products;

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Official CLEVARA Store
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-950 mt-1">
            Complete Product Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-2xl">
            Explore our laboratory-formulated essentials for household cleanliness, gentle dermacare hygiene, and automotive maintenance in Nepal.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Categories Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => handleCategorySelect('')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                !categoryFilter
                  ? 'bg-slate-950 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              All Products
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  categoryFilter === cat.slug
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-56">
              <input
                type="text"
                placeholder="Search..."
                value={searchFilter}
                onChange={handleSearchChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              {searchFilter && (
                <button
                  onClick={() => handleSearchChange({ target: { value: '' } } as any)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortFilter}
                onChange={handleSortChange}
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium cursor-pointer"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {/* In-stock toggle */}
            <label className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-slate-300 text-emerald-800 focus:ring-emerald-700"
              />
              <span>In Stock</span>
            </label>
          </div>

        </div>

        {/* Results Counter & Active Filter Pills */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
          <div>
            Showing <span className="font-semibold text-slate-900">{filteredProducts.length}</span> products
          </div>
          {(categoryFilter || searchFilter || inStockOnly) && (
            <button
              onClick={clearAllFilters}
              className="text-emerald-800 hover:text-emerald-700 font-semibold underline underline-offset-2 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Clear All Filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <SlidersHorizontal className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-display font-bold text-base text-slate-900 mb-1">No products match your criteria</h3>
            <p className="text-xs text-slate-500 mb-6">
              Try adjusting your search terms or category selection to browse available products.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-5 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
