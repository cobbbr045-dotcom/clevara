import React, { useState, useEffect } from 'react';
import { Tag, Sparkles, Plus, Calendar, Clock, X, Check, Trash2 } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { api } from '../../api/client.js';
import { formatDate, formatNPR } from '../../utils/format.js';
import { Promotion, PromotionalEvent } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminPromotionsPage: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [events, setEvents] = useState<PromotionalEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'events' | 'coupons'>('events');
  const [loading, setLoading] = useState(true);

  // New Event Modal
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [evTitle, setEvTitle] = useState('');
  const [evDesc, setEvDesc] = useState('');
  const [evBanner, setEvBanner] = useState('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80');
  const [evDiscount, setEvDiscount] = useState('15');
  const [evStart, setEvStart] = useState(new Date().toISOString().slice(0, 10));
  const [evEnd, setEvEnd] = useState(new Date(Date.now() + 86400000 * 30).toISOString().slice(0, 10));
  const [evLimited, setEvLimited] = useState(true);
  const [savingEvent, setSavingEvent] = useState(false);

  // New Coupon Modal
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [cpCode, setCpCode] = useState('');
  const [cpTitle, setCpTitle] = useState('');
  const [cpType, setCpType] = useState<'percentage' | 'fixed'>('percentage');
  const [cpValue, setCpValue] = useState('10');
  const [cpMinOrder, setCpMinOrder] = useState('1000');
  const [savingCoupon, setSavingCoupon] = useState(false);

  const { success, error } = useToast();

  const loadData = () => {
    setLoading(true);
    Promise.all([
      apiFetchEvents(),
      apiFetchPromos()
    ]).finally(() => setLoading(false));
  };

  const apiFetchEvents = async () => {
    try {
      const res = await fetch('/api/events?all=true').then(r => r.json());
      if (res.success) setEvents(res.events);
    } catch {}
  };

  const apiFetchPromos = async () => {
    try {
      const res = await fetch('/api/promotions?all=true').then(r => r.json());
      if (res.success) setPromotions(res.promotions);
    } catch {}
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEvent(true);
    try {
      const res = await api.adminCreateEvent({
        title: evTitle,
        description: evDesc,
        banner_url: evBanner,
        discount_percent: Number(evDiscount),
        start_date: new Date(evStart).toISOString(),
        end_date: new Date(evEnd).toISOString(),
        is_active: true,
        is_limited_time: evLimited
      });

      if (res.success) {
        success(`Promotional event "${res.event.title}" activated!`);
        setIsEventModalOpen(false);
        setEvTitle('');
        setEvDesc('');
        loadData();
      }
    } catch (err: any) {
      error(err.message || 'Failed to create event.');
    } finally {
      setSavingEvent(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCoupon(true);
    try {
      const res = await api.adminCreatePromotion({
        code: cpCode,
        title: cpTitle,
        discount_type: cpType,
        discount_value: Number(cpValue),
        min_order_amount: Number(cpMinOrder),
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 86400000 * 90).toISOString(),
        is_active: true,
        usage_limit: 500
      });

      if (res.success) {
        success(`Coupon ${res.promotion.code} created!`);
        setIsCouponModalOpen(false);
        setCpCode('');
        setCpTitle('');
        loadData();
      }
    } catch (err: any) {
      error(err.message || 'Failed to create coupon.');
    } finally {
      setSavingCoupon(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-2xl text-slate-900">
              Promotions, Events & Seasonal Offers
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Launch limited-time promotional events, banners, discount percentages, and coupon vouchers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEventModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-950 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors shadow-soft inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" /> Create Event
            </button>
            <button
              onClick={() => setIsCouponModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors shadow-soft inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create Coupon
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'events' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Events & Banners ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'coupons' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tag className="w-3.5 h-3.5" /> Checkout Coupons ({promotions.length})
          </button>
        </div>

        {/* Events Cards */}
        {activeTab === 'events' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map(ev => (
              <div key={ev.id} className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-soft flex flex-col justify-between">
                <div className="aspect-video bg-slate-950 relative overflow-hidden">
                  {ev.banner_url && (
                    <img src={ev.banner_url} alt={ev.title} className="w-full h-full object-cover opacity-80" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-800 text-white shadow-sm">
                    {ev.discount_percent}% Promotional Discount
                  </span>
                  {ev.is_limited_time && (
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-sm">
                      Limited Time
                    </span>
                  )}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-display font-bold text-lg text-white">{ev.title}</h3>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed">{ev.description}</p>
                  <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span>Valid: {formatDate(ev.start_date)} – {formatDate(ev.end_date)}</span>
                    <span className="font-semibold text-emerald-800">Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Coupons Table */}
        {activeTab === 'coupons' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4 font-semibold">Coupon Code</th>
                    <th className="py-3.5 px-4 font-semibold">Title & Offer</th>
                    <th className="py-3.5 px-4 font-semibold">Discount Type</th>
                    <th className="py-3.5 px-4 font-semibold">Min Order</th>
                    <th className="py-3.5 px-4 font-semibold">Usage Count</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {promotions.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-800 text-sm">{p.code}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-900 block">{p.title}</span>
                        <span className="text-[10px] text-slate-500">{p.description}</span>
                      </td>
                      <td className="py-3.5 px-4 capitalize text-slate-700">
                        {p.discount_type === 'percentage' ? `${p.discount_value}% Off` : `Rs. ${p.discount_value} Flat`}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-900">
                        {formatNPR(p.min_order_amount)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{p.times_used} times</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Create Event */}
        {isEventModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display font-bold text-base text-slate-900">Launch Promotional Event</h3>
                <button onClick={() => setIsEventModalOpen(false)} className="text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CLEVARA Monsoon Special"
                    value={evTitle}
                    onChange={(e) => setEvTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description *</label>
                  <textarea
                    rows={2}
                    required
                    value={evDesc}
                    onChange={(e) => setEvDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Discount (%) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={90}
                      value={evDiscount}
                      onChange={(e) => setEvDiscount(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="limCheck"
                      checked={evLimited}
                      onChange={(e) => setEvLimited(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-800"
                    />
                    <label htmlFor="limCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                      Limited Time Tag
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Banner Image URL</label>
                  <input
                    type="url"
                    value={evBanner}
                    onChange={(e) => setEvBanner(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button type="button" onClick={() => setIsEventModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
                  <button type="submit" disabled={savingEvent} className="px-5 py-2 rounded-xl bg-slate-950 text-white text-xs font-semibold hover:bg-emerald-800 disabled:opacity-50">
                    {savingEvent ? 'Creating...' : 'Activate Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Create Coupon */}
        {isCouponModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display font-bold text-base text-slate-900">Create Promotional Coupon</h3>
                <button onClick={() => setIsCouponModalOpen(false)} className="text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CLEVARA20"
                    value={cpCode}
                    onChange={(e) => setCpCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Offer Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 20% Off Orders Above Rs. 2,000"
                    value={cpTitle}
                    onChange={(e) => setCpTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Discount Value</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={cpValue}
                      onChange={(e) => setCpValue(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Min Order Amount (Rs.)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={cpMinOrder}
                      onChange={(e) => setCpMinOrder(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button type="button" onClick={() => setIsCouponModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
                  <button type="submit" disabled={savingCoupon} className="px-5 py-2 rounded-xl bg-slate-950 text-white text-xs font-semibold hover:bg-emerald-800 disabled:opacity-50">
                    {savingCoupon ? 'Saving...' : 'Save Coupon'}
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
