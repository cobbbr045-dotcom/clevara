import React, { useState, useEffect } from 'react';
import { Star, Check, X, ShieldAlert } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { api } from '../../api/client.js';
import { formatDate } from '../../utils/format.js';
import { Review } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  const loadReviews = () => {
    setLoading(true);
    api.getAdminReviews()
      .then(res => {
        if (res.success) setReviews(res.reviews);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const toggleApproval = async (id: string, current: boolean) => {
    try {
      const res = await api.adminModerateReview(id, !current);
      if (res.success) {
        success(`Review ${!current ? 'approved for display' : 'hidden from public view'}.`);
        loadReviews();
      }
    } catch (err: any) {
      error(err.message || 'Failed to moderate review.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-slate-900">
            Customer Reviews Moderation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit and moderate genuine customer reviews. We never fabricate reviews or ratings.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-xs text-slate-500">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              No product reviews submitted yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4 font-semibold">Date</th>
                    <th className="py-3.5 px-4 font-semibold">Customer</th>
                    <th className="py-3.5 px-4 font-semibold">Rating</th>
                    <th className="py-3.5 px-4 font-semibold">Review Comment</th>
                    <th className="py-3.5 px-4 font-semibold">Verified</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reviews.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">{formatDate(r.created_at)}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{r.customer_name}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-amber-400' : 'text-slate-200'}`} />
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-sm">{r.comment}</td>
                      <td className="py-3.5 px-4">
                        {r.is_verified_purchase ? (
                          <span className="text-[10px] text-emerald-800 font-semibold">Verified Buyer</span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Reviewer</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => toggleApproval(r.id, r.is_approved)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                            r.is_approved
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {r.is_approved ? 'Publicly Visible' : 'Hidden'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
