import React, { useState, useEffect } from 'react';
import { Users, Search, Phone, Mail, MapPin } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { api } from '../../api/client.js';
import { formatDate } from '../../utils/format.js';
import { Customer } from '../../types/index.js';

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminCustomers()
      .then(res => {
        if (res.success) setCustomers(res.customers);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c =>
    c.full_name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-2xl text-slate-900">
              Customer Registry
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified customer contact profiles, addresses, and social communication handles.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
          <input
            type="text"
            placeholder="Search customer by name, email, phone, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-xs text-slate-500">Loading customers...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              No customer records found yet. Customers are logged when placing orders.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4 font-semibold">Customer</th>
                    <th className="py-3.5 px-4 font-semibold">Email</th>
                    <th className="py-3.5 px-4 font-semibold">Phone</th>
                    <th className="py-3.5 px-4 font-semibold">City / Address</th>
                    <th className="py-3.5 px-4 font-semibold">Messaging Handles</th>
                    <th className="py-3.5 px-4 font-semibold">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(cust => (
                    <tr key={cust.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{cust.full_name}</td>
                      <td className="py-3.5 px-4 text-slate-600">{cust.email}</td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">{cust.phone}</td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="font-semibold text-slate-800 block">{cust.city}</span>
                        <span className="text-[11px] text-slate-500">{cust.address}</span>
                      </td>
                      <td className="py-3.5 px-4 text-[11px] text-slate-500">
                        {cust.instagram_handle && <div>IG: @{cust.instagram_handle}</div>}
                        {cust.whatsapp_number && <div>WA: {cust.whatsapp_number}</div>}
                        {cust.viber_number && <div>Viber: {cust.viber_number}</div>}
                        {!cust.instagram_handle && !cust.whatsapp_number && !cust.viber_number && <span className="text-slate-400">—</span>}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                        {formatDate(cust.created_at)}
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
