import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../types/index.js';
import { formatNPR } from '../../utils/format.js';
import { useCart } from '../../context/CartContext.js';
import { useToast } from '../../context/ToastContext.js';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();
  const { success } = useToast();
  const navigate = useNavigate();

  const discountPercent = product.original_price && product.original_price > product.selling_price
    ? Math.round(((product.original_price - product.selling_price) / product.original_price) * 100)
    : 0;

  const hasVariants = product.variants && product.variants.length > 0;
  const inStock = product.stock_quantity > 0 || (hasVariants && product.variants?.some(v => v.stock_quantity > 0));

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasVariants) {
      // Navigate to product details to choose variant
      navigate(`/product/${product.slug}`);
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: product.selling_price,
      image: product.images[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      quantity: 1,
      maxStock: product.stock_quantity
    });

    success(`Added ${product.name} to cart.`);
  };

  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-soft hover:shadow-premium transition-all duration-300 overflow-hidden">
      
      {/* Product Image & Badges */}
      <Link to={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-slate-50">
        <img
          src={mainImage}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-800 text-white tracking-wide shadow-sm">
              Save {discountPercent}%
            </span>
          )}
          {product.is_featured && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-900/90 text-white backdrop-blur-sm shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Variant Notice */}
        {hasVariants && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-white/95 text-slate-800 shadow-soft backdrop-blur-sm">
              {product.variants!.length} Options Available
            </span>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* Category Name */}
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-1.5">
            {product.category?.name || 'CLEVARA Collection'}
          </div>

          {/* Product Name */}
          <Link
            to={`/product/${product.slug}`}
            className="block font-display font-semibold text-sm text-slate-900 hover:text-emerald-800 transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>

          {/* Product Short Description */}
          <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Button */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-base text-slate-900">
                {formatNPR(product.selling_price)}
              </span>
              {product.original_price && product.original_price > product.selling_price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatNPR(product.original_price)}
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {inStock ? (
                <span className="text-emerald-800 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-800" />
                  Available for Delivery
                </span>
              ) : (
                <span className="text-red-600 font-medium">Temporarily Out of Stock</span>
              )}
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={!inStock}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
              !inStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-900 text-white hover:bg-emerald-800 hover:shadow-soft active:scale-95'
            }`}
            title={hasVariants ? 'Select Variant' : 'Add to Cart'}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
