import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, PackageCheck, Truck, ArrowRight, ShieldCheck, Calendar, MapPin } from 'lucide-react';
import { api } from '../../api/client.js';
import { formatNPR, formatDate } from '../../utils/format.js';
import { Order } from '../../types/index.js';

export const OrderConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order') || '';
  const statusParam = searchParams.get('status') || '';
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderNumber) {
      api.trackOrder(orderNumber)
        .then(res => {
          if (res.success && res.order) {
            setOrder(res.order);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderNumber]);

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-premium p-8 sm:p-12 text-center space-y-6">
          
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              Order Confirmed & Logged
            </span>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-950 mt-1">
              Thank You for Ordering from CLEVARA
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
              Your order has been recorded into our Kathmandu dispatch center. We are preparing your freshly formulated items for shipment.
            </p>
          </div>

          {order && (
            <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-6 text-left space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Order Reference:</span>
                  <span className="font-mono font-bold text-sm text-slate-900 block">{order.order_number}</span>
                </div>
                <div className="sm:text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Tracking Code:</span>
                  <span className="font-mono font-bold text-sm text-emerald-800 block">{order.tracking_code}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                <div>
                  <span className="font-bold text-slate-900 block mb-1">Recipient & Destination:</span>
                  <div>{order.customer_name}</div>
                  <div>{order.delivery_address}, {order.city}</div>
                </div>

                <div>
                  <span className="font-bold text-slate-900 block mb-1">Payment & Charges:</span>
                  <div>Payment Method: <strong className="uppercase">{order.payment_method}</strong></div>
                  <div>Delivery Fee: {formatNPR(order.delivery_fee)}</div>
                  <div className="font-bold text-slate-900 pt-1">Total: {formatNPR(order.total_amount)}</div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            {order && (
              <Link
                to={`/track-order?ref=${encodeURIComponent(order.order_number)}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-950 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors shadow-soft flex items-center justify-center gap-2"
              >
                <PackageCheck className="w-4 h-4" /> Track This Shipment
              </Link>
            )}
            <Link
              to="/shop"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
