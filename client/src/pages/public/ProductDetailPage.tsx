import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  CheckCircle,
  Star,
  ChevronRight,
  ArrowLeft,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Product, ProductVariant, Review } from '../../types/index.js';
import { api } from '../../api/client.js';
import { formatNPR } from '../../utils/format.js';
import { useCart } from '../../context/CartContext.js';
import { useToast } from '../../context/ToastContext.js';
import { ProductCard } from '../../components/product/ProductCard.js';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Review form states
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { success, error } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    api.getProduct(slug)
      .then(res => {
        if (res.success && res.product) {
          const prod: Product = res.product;
          setProduct(prod);

          // Select first variant if exists
          if (prod.variants && prod.variants.length > 0) {
            setSelectedVariant(prod.variants[0]);
            setSelectedImage(prod.variants[0].image_url || prod.images[0]);
          } else {
            setSelectedVariant(null);
            setSelectedImage(prod.images[0] || '');
          }

          // Fetch reviews
          api.getProductReviews(prod.id)
            .then(revRes => {
              if (revRes.success) setReviews(revRes.reviews);
            })
            .catch(() => {});

          // Fetch related products
          if (prod.category_id) {
            api.getProducts({ categoryId: prod.category_id })
              .then(relRes => {
                if (relRes.success) {
                  setRelatedProducts(relRes.products.filter(p => p.id !== prod.id).slice(0, 4));
                }
              })
              .catch(() => {});
          }
        }
      })
      .catch(err => {
        console.error('Failed to load product:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen py-24 text-center">
        <div className="w-8 h-8 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen py-24 text-center max-w-md mx-auto px-4">
        <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">Product Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">The item you requested does not exist in our catalogue.</p>
        <Link to="/shop" className="px-5 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-semibold">
          Browse Products
        </Link>
      </div>
    );
  }

  // Calculate current price and stock based on variant
  const currentPrice = selectedVariant?.price_override != null
    ? selectedVariant.price_override
    : product.selling_price;

  const currentSku = selectedVariant ? selectedVariant.sku : product.sku;
  const currentStock = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity;
  const inStock = currentStock > 0;

  const discountPercent = product.original_price && product.original_price > currentPrice
    ? Math.round(((product.original_price - currentPrice) / product.original_price) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!inStock) {
      error('This item is currently out of stock.');
      return;
    }

    addToCart({
      productId: product.id,
      variantId: selectedVariant?.id || null,
      name: product.name,
      variantName: selectedVariant?.variant_name || null,
      sku: currentSku,
      price: currentPrice,
      image: selectedImage || product.images[0],
      quantity: quantity,
      maxStock: currentStock
    });

    success(`Added ${quantity}x "${product.name}${selectedVariant ? ` (${selectedVariant.variant_name})` : ''}" to your cart.`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) {
      error('Please provide your name and comments.');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.submitReview({
        product_id: product.id,
        customer_name: reviewName,
        rating: reviewRating,
        comment: reviewComment,
        is_verified_purchase: false
      });

      if (res.success && res.review) {
        setReviews(prev => [res.review, ...prev]);
        success('Thank you! Your verified review has been published.');
        setReviewName('');
        setReviewComment('');
        setReviewRating(5);
      }
    } catch (err: any) {
      error(err.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/shop" className="hover:text-slate-900 transition-colors">Shop</Link>
          {product.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link to={`/category/${product.category.slug}`} className="hover:text-slate-900 transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Main Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-soft">
          
          {/* Left: Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 relative shadow-inner">
              <img
                src={selectedImage || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {discountPercent > 0 && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-800 text-white shadow-sm">
                    Save {discountPercent}%
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Row */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === img
                        ? 'border-emerald-800 ring-2 ring-emerald-800/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Purchase Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-emerald-800 uppercase tracking-wider">
                  {product.category?.name || 'CLEVARA Collection'}
                </span>
                <span className="font-mono text-[11px] text-slate-500">SKU: {currentSku}</span>
              </div>

              {/* Title */}
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-950 leading-tight">
                {product.name}
              </h1>

              {/* Pricing Section */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="font-display font-black text-3xl text-slate-950">
                  {formatNPR(currentPrice)}
                </span>
                {product.original_price && product.original_price > currentPrice && (
                  <span className="text-base text-slate-400 line-through">
                    {formatNPR(product.original_price)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
                {product.description}
              </p>

              {/* Variant Selector (Blue, White, Orange / Eucalyptus, Citrus, etc.) */}
              {product.variants && product.variants.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Select Option / Variant:
                    </span>
                    <span className="text-xs font-semibold text-emerald-800">
                      {selectedVariant?.variant_name}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map(variant => {
                      const isSelected = selectedVariant?.id === variant.id;
                      const hasStock = variant.stock_quantity > 0;

                      return (
                        <button
                          key={variant.id}
                          onClick={() => {
                            setSelectedVariant(variant);
                            if (variant.image_url) setSelectedImage(variant.image_url);
                          }}
                          disabled={!hasStock}
                          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                            isSelected
                              ? 'bg-slate-950 text-white border-slate-950 shadow-soft'
                              : hasStock
                              ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                              : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                          }`}
                        >
                          {variant.variant_name}
                          {!hasStock && ' (Out of Stock)'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector & Stock Indicator */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Quantity:</span>
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || !inStock}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold transition-colors disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-xs font-bold text-slate-900 min-w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                      disabled={quantity >= currentStock || !inStock}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold transition-colors disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  {inStock ? (
                    <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-800" />
                      In Stock ({currentStock} available)
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-red-600">
                      Temporarily Sold Out
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="pt-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!inStock}
                    className="w-full py-3.5 px-6 rounded-xl bg-slate-950 text-white font-semibold text-xs sm:text-sm hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={!inStock}
                    className="w-full py-3.5 px-6 rounded-xl bg-emerald-800 text-white font-semibold text-xs sm:text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Zap className="w-4 h-4" /> Buy Now
                  </button>
                </div>
              </div>

              {/* Delivery & Warranty Information */}
              <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <Truck className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Nepal Delivery</span>
                    <span>1-2 Days in Kathmandu Valley. 2-5 Days Nationwide.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <RotateCcw className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">50% Refund Guarantee</span>
                    <span>Documented return coverage on damaged claims.</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Specifications Table */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="mt-12 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-soft">
            <h2 className="font-display font-bold text-xl text-slate-950 mb-6">
              Product Specifications & Formulation
            </h2>
            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
              {Object.entries(product.specifications).map(([key, val], idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs hover:bg-slate-50 transition-colors">
                  <span className="font-bold text-slate-900">{key}</span>
                  <span className="sm:col-span-2 text-slate-600 font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customer Reviews Section */}
        <div className="mt-12 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-soft">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display font-bold text-xl text-slate-950">
                Customer Reviews ({reviews.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Authentic feedback from verified purchasers in Nepal.
              </p>
            </div>
          </div>

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl mb-8">
              No reviews yet for this formulation. Be the first to share your experience below.
            </div>
          ) : (
            <div className="space-y-4 mb-8 divide-y divide-slate-100">
              {reviews.map(rev => (
                <div key={rev.id} className="pt-4 first:pt-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-display font-bold text-xs text-slate-900">{rev.customer_name}</span>
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add Review Form */}
          <form onSubmit={handleReviewSubmit} className="pt-6 border-t border-slate-100 space-y-4 max-w-xl">
            <h3 className="font-display font-bold text-sm text-slate-900">Write a Review</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suman Thapa"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700 cursor-pointer"
                >
                  <option value={5}>5 Stars - Outstanding</option>
                  <option value={4}>4 Stars - High Quality</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Below Expectation</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Review Comment</label>
              <textarea
                required
                rows={3}
                placeholder="Share your experience with this product..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="px-5 py-2.5 rounded-xl bg-slate-950 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors shadow-soft disabled:opacity-50"
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display font-bold text-2xl text-slate-950 mb-8">
              Complementary CLEVARA Formulations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(rel => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
