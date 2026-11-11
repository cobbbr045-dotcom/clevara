import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { RotateCcw, AlertTriangle, CheckCircle2, Upload, AlertCircle, ShieldAlert } from 'lucide-react';
import { api } from '../../api/client.js';
import { useToast } from '../../context/ToastContext.js';

export const ReturnRefundRequestPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialOrder = searchParams.get('order') || '';
  const [orderNumber, setOrderNumber] = useState(initialOrder);
  const [reason, setReason] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submittedReq, setSubmittedReq] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const { success, error } = useToast();

  const handleAddPhoto = () => {
    if (photoUrl.trim() && photoUrl.startsWith('http')) {
      setPhotoUrls(prev => [...prev, photoUrl.trim()]);
      setPhotoUrl('');
    } else {
      error('Please enter a valid image URL (http:// or https://)');
    }
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotoUrls(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber || !reason) {
      error('Order reference and return explanation are required.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await api.submitReturn({
        order_number: orderNumber.trim(),
        reason: reason.trim(),
        photo_urls: photoUrls
      });

      if (res.success && res.request) {
        setSubmittedReq(res.request);
        success('Return & 50% Refund evaluation claim submitted successfully.');
      } else {
        setErrorMsg(res.error || 'Failed to submit return request.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not log return claim.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-14">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
            <RotateCcw className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
            Consumer Return & Refund Protocol
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-950 mt-1">
            Return Request & 50% Refund Claim
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
            Submit photographic evidence and condition details for physical inspection by our Kathmandu quality audit team.
          </p>
        </div>

        {/* 50% Policy Disclosure Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold block">CLEVARA 50% Standard Refund Policy:</span>
            <span>
              Eligible product returns are evaluated for up to <strong>50% refund</strong> of the product purchase price upon physical receipt and verification at our Kathmandu facility. Delivery courier charges are non-refundable. Refunds are never issued automatically without administrative inspection.
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-soft">
          
          {submittedReq ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="font-display font-bold text-lg text-slate-900">
                Return Claim Successfully Filed
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                Return Claim Ticket <strong className="font-mono text-slate-900">{submittedReq.id}</strong> for Order <strong className="font-mono text-slate-900">{submittedReq.order_number}</strong> has been logged into our queue.
              </p>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 text-left">
                <strong>Next Steps:</strong> Our operations manager will inspect the submitted photographs and issue return shipping instructions within 24 to 48 business hours.
              </div>
              <div className="pt-4 flex justify-center gap-3">
                <Link
                  to={`/track-order?ref=${encodeURIComponent(submittedReq.order_number)}`}
                  className="px-5 py-2.5 rounded-xl bg-slate-950 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors"
                >
                  View Order Status
                </Link>
                <Link
                  to="/"
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors"
                >
                  Return to Home
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
                  Reason for Return / Defect Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe in detail the condition of the delivered item (damaged, leaking nozzle, formula inconsistency)..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {/* Supporting Photographs Upload / Links */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Supporting Photo Evidence URLs (Required for Damage Assessment)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    placeholder="Paste image URL (https://...)"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
                  >
                    Add Photo
                  </button>
                </div>

                {photoUrls.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {photoUrls.map((url, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
                        <img src={url} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute inset-0 bg-red-950/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-xl bg-slate-950 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors shadow-soft disabled:opacity-50"
              >
                {submitting ? 'Submitting Return Claim...' : 'Submit Return & 50% Refund Claim'}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
