import React, { useState, useEffect } from 'react';
import { RotateCcw, AlertCircle, CheckCircle2, Clock, Eye, DollarSign, X, Image as ImageIcon } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { api } from '../../api/client.js';
import { formatNPR, formatDate } from '../../utils/format.js';
import { RefundRequest, ReturnRequest } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminRefundsPage: React.FC = () => {
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Review
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [statusVal, setStatusVal] = useState<'approved' | 'processed' | 'completed' | 'rejected'>('approved');
  const [amountVal, setAmountVal] = useState('');
  const [notesVal, setNotesVal] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { success, error } = useToast();

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.getAdminRefunds(),
      api.getAdminReturns()
    ])
      .then(([rfRes, rtRes]) => {
        if (rfRes.success) setRefunds(rfRes.requests);
        if (rtRes.success) setReturns(rtRes.requests);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openReviewModal = (rf: RefundRequest) => {
    setSelectedRefund(rf);
    setStatusVal(rf.status === 'requested' ? 'approved' : rf.status);
    setAmountVal(String(rf.approved_refund_amount || rf.requested_amount));
    setNotesVal(rf.admin_notes || '');
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRefund) return;

    setSubmitting(true);
    try {
      const res = await api.adminReviewRefund(
        selectedRefund.id,
        statusVal,
        Number(amountVal || 0),
        notesVal
      );

      if (res.success && res.request) {
        success(`Refund claim for Order ${selectedRefund.order_number} updated to "${statusVal}".`);
        setSelectedRefund(null);
        loadData();
      }
    } catch (err: any) {
      error(err.message || 'Failed to update refund status.');
    } finally {
      setSubmitting(false);
    }
  };

  const matchedReturn = selectedRefund?.return_request_id
    ? returns.find(r => r.id === selectedRefund.return_request_id)
    : null;

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-2xl text-slate-900">
              50% Refund & Return Evaluation Console
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review customer photo evidence, calculate eligible 50% refund amounts, record audit notes, and disburse reimbursements.
            </p>
          </div>
        </div>

        {/* Refunds Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-xs text-slate-500">Loading refund evaluations...</div>
          ) : refunds.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              No refund requests logged. Claims appear when customers initiate returns.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4 font-semibold">Order Ref</th>
                    <th className="py-3.5 px-4 font-semibold">Logged Date</th>
                    <th className="py-3.5 px-4 font-semibold">50% Standard Amount</th>
                    <th className="py-3.5 px-4 font-semibold">Approved Amount</th>
                    <th className="py-3.5 px-4 font-semibold">Evaluation Status</th>
                    <th className="py-3.5 px-4 font-semibold">Notes</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {refunds.map(rf => (
                    <tr key={rf.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{rf.order_number}</td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">{formatDate(rf.created_at)}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{formatNPR(rf.requested_amount)}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-800">
                        {rf.approved_refund_amount > 0 ? formatNPR(rf.approved_refund_amount) : 'Pending Review'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          rf.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rf.status === 'processed' || rf.status === 'approved'
                            ? 'bg-blue-100 text-blue-800'
                            : rf.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rf.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{rf.admin_notes || '—'}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => openReviewModal(rf)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold"
                        >
                          Audit Claim
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: Review Refund & Inspect Evidence */}
        {selectedRefund && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    CLEVARA 50% Standard Audit
                  </span>
                  <h3 className="font-display font-bold text-base text-slate-900">
                    Claim for Order {selectedRefund.order_number}
                  </h3>
                </div>
                <button onClick={() => setSelectedRefund(null)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Photo Evidence if return request exists */}
              {matchedReturn && matchedReturn.photo_urls && matchedReturn.photo_urls.length > 0 && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-900 block">Customer Photo Evidence:</span>
                  <div className="flex flex-wrap gap-2">
                    {matchedReturn.photo_urls.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noreferrer" className="w-20 h-20 rounded-xl overflow-hidden border border-slate-300 block">
                        <img src={url} alt={`Evidence ${i}`} className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-600 pt-1">
                    <strong>Customer Stated Reason:</strong> {matchedReturn.reason}
                  </div>
                </div>
              )}

              <form onSubmit={handleSaveReview} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Refund Status Progression *
                    </label>
                    <select
                      value={statusVal}
                      onChange={(e) => setStatusVal(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700 cursor-pointer font-medium"
                    >
                      <option value="approved">Approved (Awaiting Physical Receipt)</option>
                      <option value="processed">Processed (Payment Queued)</option>
                      <option value="completed">Completed (Funds Disbursed)</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Approved Refund Amount (Rs.) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={amountVal}
                      onChange={(e) => setAmountVal(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-emerald-700"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Standard 50%: {formatNPR(selectedRefund.requested_amount)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Internal Operations Audit Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Physical bottle condition check, bank reference or inspection notes..."
                    value={notesVal}
                    onChange={(e) => setNotesVal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRefund(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-slate-950 text-white text-xs font-semibold hover:bg-emerald-800 disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Record Refund Decision'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
