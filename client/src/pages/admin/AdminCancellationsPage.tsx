import React, { useState, useEffect } from 'react';
import { Ban, CheckCircle2, XCircle, Clock, AlertCircle, Eye, X } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { api } from '../../api/client.js';
import { formatDate } from '../../utils/format.js';
import { CancellationRequest } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminCancellationsPage: React.FC = () => {
  const [requests, setRequests] = useState<CancellationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState<CancellationRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { success, error } = useToast();

  const loadRequests = () => {
    setLoading(true);
    api.getAdminCancellations()
      .then(res => {
        if (res.success) setRequests(res.requests);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleReviewAction = async (action: 'approve' | 'reject') => {
    if (!selectedReq) return;
    setSubmitting(true);

    try {
      const res = await api.adminReviewCancellation(selectedReq.id, action, adminNotes);
      if (res.success && res.request) {
        success(
          action === 'approve'
            ? `Cancellation approved. Allocated items have been restocked to warehouse inventory.`
            : `Cancellation request rejected.`
        );
        setSelectedReq(null);
        setAdminNotes('');
        loadRequests();
      }
    } catch (err: any) {
      error(err.message || 'Failed to review cancellation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-2xl text-slate-900">
              Order Cancellation Requests
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review customer cancellation requests. Approved cancellations automatically restore allocated units to inventory.
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-xs text-slate-500">Loading cancellation tickets...</div>
          ) : requests.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              No cancellation requests logged.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4 font-semibold">Order Ref</th>
                    <th className="py-3.5 px-4 font-semibold">Requested Date</th>
                    <th className="py-3.5 px-4 font-semibold">Customer</th>
                    <th className="py-3.5 px-4 font-semibold">Stated Reason</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{req.order_number}</td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">{formatDate(req.created_at)}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{req.customer_name}</td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">{req.reason}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          req.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedReq(req);
                            setAdminNotes(req.admin_notes || '');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold"
                        >
                          Review Ticket
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Review Modal */}
        {selectedReq && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display font-bold text-base text-slate-900">
                  Review Cancellation for Order {selectedReq.order_number}
                </h3>
                <button onClick={() => setSelectedReq(null)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div><strong>Customer:</strong> {selectedReq.customer_name} ({selectedReq.customer_email})</div>
                <div><strong>Stated Reason:</strong> {selectedReq.reason}</div>
                <div><strong>Current Status:</strong> <span className="font-bold uppercase text-slate-900">{selectedReq.status}</span></div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Administrative Decision Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Reason for approval or rejection..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReq(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleReviewAction('reject')}
                  className="px-4 py-2 rounded-xl bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 disabled:opacity-50"
                >
                  Reject Cancellation
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleReviewAction('approve')}
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50"
                >
                  Approve & Restock Items
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
