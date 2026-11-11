import React, { useState, useEffect } from 'react';
import { Truck, Plus, Edit2, Trash2, X, CheckCircle2 } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { api } from '../../api/client.js';
import { formatNPR } from '../../utils/format.js';
import { DeliveryZone } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminDeliveryPage: React.FC = () => {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);

  // Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('1 - 2 Business Days');
  const [fee, setFee] = useState('100');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const { success, error } = useToast();

  const loadZones = () => {
    setLoading(true);
    fetch('/api/delivery-zones?all=true')
      .then(r => r.json())
      .then(res => {
        if (res.success) setZones(res.zones);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadZones();
  }, []);

  const openCreateModal = () => {
    setEditingZone(null);
    setName('');
    setDescription('');
    setDeliveryTime('1 - 2 Business Days');
    setFee('100');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (z: DeliveryZone) => {
    setEditingZone(z);
    setName(z.name);
    setDescription(z.description);
    setDeliveryTime(z.estimated_delivery_time);
    setFee(String(z.fee));
    setIsActive(z.is_active);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !deliveryTime || fee === '') {
      error('Please complete required fields.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name,
        description,
        estimated_delivery_time: deliveryTime,
        fee: Number(fee),
        is_active: isActive
      };

      if (editingZone) {
        const res = await api.adminUpdateDeliveryZone(editingZone.id, payload);
        if (res.success) {
          success(`Delivery zone "${res.zone.name}" updated.`);
          setIsModalOpen(false);
          loadZones();
        }
      } else {
        const res = await api.adminCreateDeliveryZone(payload);
        if (res.success) {
          success(`Delivery zone "${res.zone.name}" created.`);
          setIsModalOpen(false);
          loadZones();
        }
      }
    } catch (err: any) {
      error(err.message || 'Failed to save delivery zone.');
    } finally {
      setSaving(false);
    }
  };

  const toggleZoneActive = async (zone: DeliveryZone) => {
    try {
      await api.adminUpdateDeliveryZone(zone.id, { is_active: !zone.is_active });
      success(`Zone "${zone.name}" status updated.`);
      loadZones();
    } catch (err: any) {
      error(err.message || 'Failed to toggle status.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-2xl text-slate-900">
              Delivery Zones & Courier Rates
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure Nepal transport fees, provincial coverage, and estimated transit times.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors shadow-soft"
          >
            <Plus className="w-4 h-4" /> Add Delivery Zone
          </button>
        </div>

        {/* Zones Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 font-semibold">Zone / Coverage Area</th>
                  <th className="py-3.5 px-4 font-semibold">Description</th>
                  <th className="py-3.5 px-4 font-semibold">Delivery Time</th>
                  <th className="py-3.5 px-4 font-semibold">Courier Fee</th>
                  <th className="py-3.5 px-4 font-semibold">Service Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {zones.map(zone => (
                  <tr key={zone.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{zone.name}</td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs">{zone.description}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{zone.estimated_delivery_time}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">{formatNPR(zone.fee)}</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleZoneActive(zone)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                          zone.is_active
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {zone.is_active ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openEditModal(zone)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                        title="Edit Zone"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Create / Edit Zone */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display font-bold text-base text-slate-900">
                  {editingZone ? 'Edit Delivery Zone' : 'Add Delivery Zone'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Zone Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pokhara Sub-Metropolitan Hub"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="Coverage boundaries and courier notes"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Fee (Rs.) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={fee}
                      onChange={(e) => setFee(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Days *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2 - 3 Days"
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="zoneActCheck"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-800"
                  />
                  <label htmlFor="zoneActCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Enable Area for Customer Checkout
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
                  <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-slate-950 text-white text-xs font-semibold hover:bg-emerald-800 disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Zone'}
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
