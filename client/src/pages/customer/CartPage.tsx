import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Truck, Tag, ShieldCheck, X } from 'lucide-react';
import { useCart } from '../../context/CartContext.js';
import { formatNPR } from '../../utils/format.js';
import { api } from '../../api/client.js';
import { DeliveryZone } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    deliveryZone,
    setDeliveryZone,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    deliveryFee,
    finalTotal
  } = useCart();

  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const { success, error } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    api.getDeliveryZones()
      .then(res => {
        if (res.success) {
          setZones(res.zones);
          if (!deliveryZone && res.zones.length > 0) {
            setDeliveryZone(res.zones[0]);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    const res = await applyCoupon(couponCode);
    if (res.success) {
      success(res.message);
      setCouponCode('');
    } else {
      error(res.message);
    }
    setCouponLoading(false);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] py-20">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900 mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-xs text-slate-500 mb-8 leading-relaxed">
            Discover our laboratory-crafted essentials across Home Cleaning, Personal Hygiene, and Vehicle Maintenance in Nepal.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-950 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors shadow-soft"
          >
            Explore Catalogue <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-950">
              Your Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Review your items and select your delivery location for Nepal.
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-red-600 hover:text-red-700 font-semibold underline underline-offset-2"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft divide-y divide-slate-100">
            {cart.map(item => (
              <div key={item.sku} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900 leading-snug">
                      {item.name}
                    </h3>
                    {item.variantName && (
                      <span className="text-xs text-emerald-800 font-semibold block mt-0.5">
                        Option: {item.variantName}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                      SKU: {item.sku}
                    </span>
                    <span className="text-xs font-bold text-slate-900 block mt-1">
                      {formatNPR(item.price)}
                    </span>
                  </div>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-xs font-bold text-slate-900 min-w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                      disabled={item.quantity >= item.maxStock}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold transition-colors disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right min-w-24">
                    <span className="font-display font-bold text-sm text-slate-900 block">
                      {formatNPR(item.price * item.quantity)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.sku)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary & Checkout Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Delivery Zone Selector */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-800" />
                <h2 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900">
                  Select Delivery Location (Nepal)
                </h2>
              </div>

              <div className="space-y-2">
                {zones.map(z => {
                  const isSelected = deliveryZone?.id === z.id;
                  return (
                    <button
                      key={z.id}
                      onClick={() => setDeliveryZone(z)}
                      className={`w-full p-3.5 rounded-2xl text-left border text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-50/60 border-emerald-800 ring-1 ring-emerald-800'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div>
                        <span className="font-semibold text-slate-900 block">{z.name}</span>
                        <span className="text-[10px] text-slate-500 block">{z.estimated_delivery_time}</span>
                      </div>
                      <span className="font-bold text-slate-900">{formatNPR(z.fee)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Coupon Code Form */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-800" />
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900">
                  Promotional Coupon
                </h3>
              </div>

              {appliedCoupon ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                  <div>
                    <span className="font-bold block">Coupon Applied: {appliedCoupon.code}</span>
                    <span className="text-[10px] text-emerald-700">Discount: -{formatNPR(appliedCoupon.discount)}</span>
                  </div>
                  <button onClick={removeCoupon} className="text-emerald-700 hover:text-emerald-900">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. CLEVARA10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs uppercase tracking-wider font-mono focus:ring-2 focus:ring-emerald-700"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="px-4 py-2 rounded-xl bg-slate-950 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors disabled:opacity-50"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Order Total Breakdown */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400">
                Order Summary
              </h3>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Product Subtotal:</span>
                  <span className="font-semibold text-slate-900">{formatNPR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span className="font-semibold text-slate-900">{formatNPR(deliveryFee)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Discount:</span>
                    <span>-{formatNPR(appliedCoupon.discount)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                  <span>Payable Total:</span>
                  <span className="font-display text-emerald-800 text-base">{formatNPR(finalTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 px-6 rounded-xl bg-slate-950 text-white font-semibold text-xs sm:text-sm hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 shadow-soft"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-[10px] text-slate-400 text-center leading-relaxed">
                Delivery fees are calculated separately based on real Nepal transport logistics.
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
