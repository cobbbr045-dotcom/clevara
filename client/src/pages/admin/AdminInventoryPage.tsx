import React, { useState, useEffect } from 'react';
import { Boxes, History, AlertTriangle, ArrowUpDown, Edit3, X, Check } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { api } from '../../api/client.js';
import { formatNPR, formatDate } from '../../utils/format.js';
import { Product, ProductVariant } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminInventoryPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stock' | 'movements'>('stock');

  // Quick Stock Edit Modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [targetItem, setTargetItem] = useState<{ id: string; name: string; isVariant: boolean; currentStock: number; productId?: string } | null>(null);
  const [newStockVal, setNewStockVal] = useState('');
  const [saving, setSaving] = useState(false);

  const { success, error } = useToast();

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.getProducts(),
      api.getAdminInventoryMovements()
    ])
      .then(([pRes, mRes]) => {
        if (pRes.success) setProducts(pRes.products);
        if (mRes.success) setMovements(mRes.movements);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openStockModal = (id: string, name: string, stock: number, isVariant: boolean, productId?: string) => {
    setTargetItem({ id, name, isVariant, currentStock: stock, productId });
    setNewStockVal(String(stock));
    setIsEditOpen(true);
  };

  const handleStockUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetItem) return;

    setSaving(true);
    try {
      const stockNum = Number(newStockVal);
      if (isNaN(stockNum) || stockNum < 0) {
        error('Please enter a valid non-negative stock count.');
        return;
      }

      if (targetItem.isVariant && targetItem.productId) {
        await api.adminUpdateVariant(targetItem.productId, targetItem.id, {
          stock_quantity: stockNum
        });
      } else {
        await api.adminUpdateProduct(targetItem.id, {
          stock_quantity: stockNum
        });
      }

      success(`Stock for "${targetItem.name}" updated to ${stockNum} units.`);
      setIsEditOpen(false);
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to update stock.');
    } finally {
      setSaving(false);
    }
  };

  // Compile flat inventory entries
  const flatItems: Array<{
    id: string;
    productId: string;
    name: string;
    variantName?: string;
    sku: string;
    stock: number;
    price: number;
    isVariant: boolean;
  }> = [];

  products.forEach(p => {
    if (p.variants && p.variants.length > 0) {
      p.variants.forEach(v => {
        flatItems.push({
          id: v.id,
          productId: p.id,
          name: p.name,
          variantName: v.variant_name,
          sku: v.sku,
          stock: v.stock_quantity,
          price: v.price_override || p.selling_price,
          isVariant: true
        });
      });
    } else {
      flatItems.push({
        id: p.id,
        productId: p.id,
        name: p.name,
        sku: p.sku,
        stock: p.stock_quantity,
        price: p.selling_price,
        isVariant: false
      });
    }
  });

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-2xl text-slate-900">
              Inventory & Stock Management
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live stock audits, automated order deduction tracking, restock logs, and movement history.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('stock')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'stock' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Boxes className="w-3.5 h-3.5" /> Live Stock Levels
            </button>
            <button
              onClick={() => setActiveTab('movements')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'movements' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" /> Movement Logs ({movements.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Live Stock Table */}
        {activeTab === 'stock' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4 font-semibold">Item & Description</th>
                    <th className="py-3.5 px-4 font-semibold">SKU Reference</th>
                    <th className="py-3.5 px-4 font-semibold">Unit Price</th>
                    <th className="py-3.5 px-4 font-semibold">Available Stock</th>
                    <th className="py-3.5 px-4 font-semibold">Inventory Value</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {flatItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{item.name}</span>
                        {item.variantName && (
                          <span className="text-[11px] text-emerald-800 font-semibold block">
                            Option: {item.variantName}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {item.sku}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {formatNPR(item.price)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.stock <= 5 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.stock} Available
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {formatNPR(item.price * item.stock)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => openStockModal(item.id, `${item.name}${item.variantName ? ` (${item.variantName})` : ''}`, item.stock, item.isVariant, item.productId)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" /> Update Stock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Movement Logs Table */}
        {activeTab === 'movements' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
            {movements.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400">
                No inventory movements recorded yet. Movements automatically log during checkout deductions, restocks, or adjustments.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 uppercase tracking-wider text-[10px]">
                      <th className="py-3.5 px-4 font-semibold">Timestamp</th>
                      <th className="py-3.5 px-4 font-semibold">Change Type</th>
                      <th className="py-3.5 px-4 font-semibold">Quantity</th>
                      <th className="py-3.5 px-4 font-semibold">Previous → New</th>
                      <th className="py-3.5 px-4 font-semibold">Reason / Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {movements.map(m => (
                      <tr key={m.id} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4 text-slate-500 font-sans">{formatDate(m.created_at)}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            m.change_type === 'order_deduction'
                              ? 'bg-blue-100 text-blue-800'
                              : m.change_type === 'cancellation_restock'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {m.change_type.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {m.change_type === 'order_deduction' ? `-${m.quantity}` : `+${m.quantity}`}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">
                          {m.previous_stock} → {m.new_stock}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-sans">
                          {m.reason} {m.reference_id && <span className="font-mono text-[10px] text-slate-400">({m.reference_id})</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Modal: Quick Stock Update */}
        {isEditOpen && targetItem && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display font-bold text-sm text-slate-900">Manual Stock Adjustment</h3>
                <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleStockUpdate} className="space-y-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Target Item:</span>
                  <span className="font-semibold text-xs text-slate-900 block">{targetItem.name}</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    New Stock Count (Units in Warehouse)
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={newStockVal}
                    onChange={(e) => setNewStockVal(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-slate-950 text-white text-xs font-semibold hover:bg-emerald-800 disabled:opacity-50"
                  >
                    {saving ? 'Updating...' : 'Save Stock'}
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
