import React, { useState, useEffect } from 'react';
import { MessageSquare, AlertTriangle, CheckCircle2, Clock, X } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { api } from '../../api/client.js';
import { formatDate } from '../../utils/format.js';
import { ContactMessage } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminComplaintsPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
  const [statusVal, setStatusVal] = useState<ContactMessage['status']>('new');
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { success, error } = useToast();

  const loadData = () => {
    setLoading(true);
    api.getAdminComplaints()
      .then(res => {
        if (res.success) setMessages(res.messages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openModal = (msg: ContactMessage) => {
    setSelectedMsg(msg);
    setStatusVal(msg.status);
    setAdminNotes(msg.admin_notes || '');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMsg) return;

    setSubmitting(true);
    try {
      const res = await api.adminUpdateComplaintStatus(selectedMsg.id, statusVal, adminNotes);
      if (res.success) {
        success(`Ticket ${selectedMsg.id} updated to "${statusVal}".`);
        setSelectedMsg(null);
        loadData();
      }
    } catch (err: any) {
      error(err.message || 'Failed to update ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-slate-900">
            Customer Inquiries & Support Tickets
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage inquiries, customer complaints, damaged parcel alerts, and order status questions.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-xs text-slate-500">Loading inquiries...</div>
          ) : messages.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              No support tickets logged. Messages submitted through the Contact form appear here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4 font-semibold">Date</th>
                    <th className="py-3.5 px-4 font-semibold">Sender</th>
                    <th className="py-3.5 px-4 font-semibold">Topic / Category</th>
                    <th className="py-3.5 px-4 font-semibold">Subject</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {messages.map(msg => (
                    <tr key={msg.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">{formatDate(msg.created_at)}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{msg.full_name}</span>
                        <span className="text-[10px] text-slate-400">{msg.email}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          msg.category === 'damaged_product' || msg.category === 'complaint'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {msg.category.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-900 max-w-xs truncate">{msg.subject}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          msg.status === 'resolved' || msg.status === 'closed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : msg.status === 'under_review'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {msg.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => openModal(msg)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold"
                        >
                          View Ticket
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: View & Update Ticket */}
        {selectedMsg && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display font-bold text-base text-slate-900">Support Ticket Details</h3>
                <button onClick={() => setSelectedMsg(null)} className="text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div><strong>Sender:</strong> {selectedMsg.full_name} ({selectedMsg.email}) {selectedMsg.phone && `• ${selectedMsg.phone}`}</div>
                <div><strong>Category:</strong> <span className="uppercase font-semibold">{selectedMsg.category}</span></div>
                <div><strong>Subject:</strong> {selectedMsg.subject}</div>
                <div className="pt-2 border-t border-slate-200/60 text-slate-700 leading-relaxed">
                  <strong>Message:</strong><br />{selectedMsg.message}
                </div>
              </div>

              <form onSubmit={handleUpdate} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={statusVal}
                    onChange={(e) => setStatusVal(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium cursor-pointer"
                  >
                    <option value="new">New</option>
                    <option value="under_review">Under Review</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Internal Resolution Notes</label>
                  <textarea
                    rows={2}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Log dispatcher response or phone call follow-up..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button type="button" onClick={() => setSelectedMsg(null)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">Close</button>
                  <button type="submit" disabled={submitting} className="px-5 py-2 rounded-xl bg-slate-950 text-white text-xs font-semibold hover:bg-emerald-800 disabled:opacity-50">
                    {submitting ? 'Saving...' : 'Update Ticket'}
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
