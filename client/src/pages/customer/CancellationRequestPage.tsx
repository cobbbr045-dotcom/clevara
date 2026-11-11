import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Ban, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../../api/client.js';
import { useToast } from '../../context/ToastContext.js';

export const CancellationRequestPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialOrder = searchParams.get('order') || '';
  const [orderNumber, setOrderNumber] = useState(initialOrder);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber || !reason) {
      error('Please provide your order reference and cancellation reason.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await api.submitCancellation({
        order_number: orderNumber.trim(),
        reason: reason.trim()
      });

      if (res.success && res.request) {
        setSuccessResult(res.request);
        success('Cancellation request submitted for operations review.');
      } else {
        setErrorMsg(res.error || 'Failed to submit cancellation request.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not process cancellation request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-14">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto mb-3">
            <Ban className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
            Order Cancellation Request
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-950 mt-1">
            Cancel an Unshipped Order
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
            Orders can be cancelled before being dispatched to our courier network. Once marked "Shipped", please initiate a return upon delivery.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-soft">
          
          {successResult ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="font-display font-bold text-lg text-slate-900">
                Cancellation Request Received
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                Your cancellation ticket for Order <strong className="font-mono text-slate-900">{successResult.order_number}</strong> is currently pending administrative review. We will notify you once processed.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <Link
                  to={`/track-order?ref=${encodeURIComponent(successResult.order_number)}`}
                  className="px-5 py-2.5 rounded-xl bg-slate-950 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors"
                >
                  Track Order Status
                </Link>
                <Link
                  to="/"
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors"
                >
                  Return Home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Order Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CLV-123456-789"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Cancellation *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Please state why you wish to cancel this order..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 leading-relaxed">
                Note: Upon cancellation approval by the operations manager, allocated item stock is automatically restored to our Nepal inventory.
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-xl bg-slate-950 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors shadow-soft disabled:opacity-50"
              >
                {submitting ? 'Submitting Request...' : 'Submit Cancellation Request'}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
