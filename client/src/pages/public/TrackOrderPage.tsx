import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  Calendar,
  XCircle,
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { api } from '../../api/client.js';
import { formatNPR, formatDate } from '../../utils/format.js';
import { Order } from '../../types/index.js';

export const TrackOrderPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRef = searchParams.get('ref') || '';
  const [reference, setReference] = useState(initialRef);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const performLookup = (refToLookup: string) => {
    if (!refToLookup.trim()) return;
    setLoading(true);
    setErrorMsg('');
    setOrder(null);

    api.trackOrder(refToLookup.trim())
      .then(res => {
        if (res.success && res.order) {
          setOrder(res.order);
        } else {
          setErrorMsg('No order found matching the provided reference.');
        }
      })
      .catch(err => {
        setErrorMsg(err.message || 'No matching order found in Nepal operations registry.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (initialRef) {
      performLookup(initialRef);
    }
  }, [initialRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reference.trim()) {
      setSearchParams({ ref: reference.trim() });
      performLookup(reference.trim());
    }
  };

  // Status step progression
  const statuses = [
    { key: 'pending', label: 'Order Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'processing', label: 'Formulating / Packaging' },
    { key: 'shipped', label: 'Dispatched to Courier' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' }
  ];

  const getCurrentStepIndex = (status: string) => {
    if (status === 'cancelled' || status === 'returned' || status === 'refunded') return -1;
    return statuses.findIndex(s => s.key === status);
  };

  const currentStep = order ? getCurrentStepIndex(order.order_status) : -1;

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
            <PackageCheck className="w-6 h-6" />
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-950">
            Track Your CLEVARA Order
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
            Enter your unique Order Reference (e.g. <span className="font-mono text-slate-700">CLV-123456-789</span>) or Courier Tracking Code.
          </p>
        </div>

        {/* Lookup Bar */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-soft mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                required
                placeholder="Enter Order Number (CLV-XXXXXX) or Tracking Code..."
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full px-4 py-3 pl-11 rounded-xl border border-slate-200 text-xs sm:text-sm uppercase tracking-wider focus:ring-2 focus:ring-emerald-700 font-mono"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-slate-950 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors shadow-soft disabled:opacity-50"
            >
              {loading ? 'Searching Registry...' : 'Track Order'}
            </button>
          </form>

          {errorMsg && (
            <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Order Result Card */}
        {order && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-premium overflow-hidden transition-all">
            
            {/* Top Bar */}
            <div className="p-6 bg-slate-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block mb-1">
                  Verified CLEVARA Shipment
                </span>
                <h2 className="font-display font-bold text-xl text-white font-mono">
                  {order.order_number}
                </h2>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Placed on {formatDate(order.created_at)}</span>
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-[10px] text-slate-400 block">Status:</span>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-0.5 ${
                  order.order_status === 'delivered'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : order.order_status === 'cancelled'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {order.order_status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Visual Status Progression */}
            {order.order_status !== 'cancelled' && order.order_status !== 'returned' && order.order_status !== 'refunded' ? (
              <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                  {statuses.map((s, idx) => {
                    const isPassed = currentStep >= idx;
                    const isCurrent = currentStep === idx;

                    return (
                      <div key={s.key} className="flex flex-col items-center text-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-all ${
                          isCurrent
                            ? 'bg-emerald-800 text-white ring-4 ring-emerald-800/20'
                            : isPassed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-400'
                        }`}>
                          {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span className={`text-[11px] leading-tight font-medium ${
                          isCurrent ? 'text-emerald-800 font-bold' : isPassed ? 'text-slate-900' : 'text-slate-400'
                        }`}>
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-6 bg-red-50/60 border-b border-red-100 flex items-center gap-3 text-xs text-red-800">
                <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>
                  This order has been marked as <strong className="uppercase">{order.order_status}</strong>. If you have questions regarding this status, contact our support team.
                </span>
              </div>
            )}

            {/* Shipment & Customer Details */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-100">
              <div className="space-y-3">
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400">
                  Delivery Destination
                </h3>
                <div className="text-xs text-slate-700 space-y-1">
                  <div className="font-bold text-sm text-slate-900">{order.customer_name}</div>
                  <div className="flex items-start gap-1.5 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-emerald-800 shrink-0 mt-0.5" />
                    <span>{order.delivery_address}, {order.city}</span>
                  </div>
                  {order.delivery_zone && (
                    <div className="text-[11px] text-emerald-800 font-semibold pt-1">
                      Zone: {order.delivery_zone.name} ({order.delivery_zone.estimated_delivery_time})
                    </div>
                  )}
                  <div className="text-slate-500 font-mono text-[11px]">Tracking Code: {order.tracking_code}</div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400">
                  Payment Breakdown (Nepal Standard)
                </h3>
                <div className="text-xs space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span>Product Subtotal:</span>
                    <span className="font-semibold text-slate-900">{formatNPR(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span className="font-semibold text-slate-900">{formatNPR(order.delivery_fee)}</span>
                  </div>
                  {order.discount_amount > 0 && (
                    <div className="flex justify-between text-emerald-800 font-medium">
                      <span>Promotional Discount:</span>
                      <span>-{formatNPR(order.discount_amount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-sm text-slate-900">
                    <span>Final Total:</span>
                    <span className="font-display text-emerald-800 text-base">{formatNPR(order.total_amount)}</span>
                  </div>
                  <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Method: <strong className="uppercase text-slate-800">{order.payment_method}</strong></span>
                    <span>Payment Status: <strong className="capitalize text-slate-800">{order.payment_status}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ordered Items */}
            {order.items && order.items.length > 0 && (
              <div className="p-6 sm:p-8 bg-slate-50/50 border-b border-slate-100">
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400 mb-4">
                  Items in this Order ({order.items.length})
                </h3>
                <div className="space-y-3">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-xs bg-white p-3.5 rounded-xl border border-slate-200/80">
                      <div>
                        <span className="font-semibold text-slate-900 block">{item.product_name}</span>
                        {item.variant_name && (
                          <span className="text-[11px] text-slate-500 block">Option: {item.variant_name}</span>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono">SKU: {item.sku}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 block">{item.quantity} x {formatNPR(item.unit_price)}</span>
                        <span className="font-bold text-slate-900 block">{formatNPR(item.subtotal)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Action Buttons for Cancellation / Returns */}
            <div className="p-6 bg-white flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                Need to modify or report an issue with this order?
              </div>
              <div className="flex items-center gap-3">
                {['pending', 'confirmed', 'processing'].includes(order.order_status) && (
                  <Link
                    to={`/cancellations?order=${encodeURIComponent(order.order_number)}`}
                    className="px-4 py-2 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold transition-colors"
                  >
                    Request Cancellation
                  </Link>
                )}
                {['delivered', 'out_for_delivery'].includes(order.order_status) && (
                  <Link
                    to={`/returns?order=${encodeURIComponent(order.order_number)}`}
                    className="px-4 py-2 rounded-xl bg-slate-950 text-white hover:bg-emerald-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Return / 50% Refund
                  </Link>
                )}
                <Link
                  to="/contact"
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors"
                >
                  Contact Support
                </Link>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
