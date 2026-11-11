import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Boxes,
  ArrowRight,
  TrendingUp,
  Package
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { api } from '../../api/client.js';
import { formatNPR, formatDate } from '../../utils/format.js';

export const AdminOverviewPage: React.FC = () => {
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminOverview()
      .then(res => {
        if (res.success && res.overview) {
          setOverview(res.overview);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-2xl text-slate-900">
              Operations Overview
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time sales, order fulfillment, and inventory health for CLEVARA Nepal.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/products"
              className="px-4 py-2 rounded-xl bg-slate-950 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors"
            >
              + Add New Product
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading metrics...</p>
          </div>
        ) : (
          <>
            {/* Top Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Total Revenue */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Sales Revenue</span>
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-display font-black text-2xl text-slate-900">
                  {formatNPR(overview?.totalSalesRevenue || 0)}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Excludes cancelled orders</div>
              </div>

              {/* Total Orders */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Orders Placed</span>
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-display font-black text-2xl text-slate-900">
                  {overview?.totalOrders || 0}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Lifetime customer purchases</div>
              </div>

              {/* Pending Orders */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Fulfillment</span>
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-display font-black text-2xl text-amber-600">
                  {overview?.pendingOrders || 0}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Requires courier dispatch</div>
              </div>

              {/* Inventory Valuation */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Warehouse Valuation</span>
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
                    <Boxes className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-display font-black text-2xl text-slate-900">
                  {formatNPR(overview?.inventoryValuation || 0)}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Estimated stock at retail value</div>
              </div>

            </div>

            {/* Low-Stock Warning Panel (Section 15) */}
            {overview?.lowStockAlerts && overview.lowStockAlerts.length > 0 && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 shadow-soft space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-700" />
                  <h2 className="font-display font-bold text-sm text-amber-950">
                    Low Stock Warnings ({overview.lowStockAlerts.length} Items Require Restock)
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {overview.lowStockAlerts.map((alert: any) => (
                    <div key={alert.id} className="bg-white p-3.5 rounded-xl border border-amber-200/60 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-900 block">{alert.name}</span>
                        <span className="font-mono text-[10px] text-slate-400">SKU: {alert.sku}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        {alert.stock} left
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Orders Section */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-base text-slate-950">
                    Recent Customer Orders
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Most recent transactions across Nepal</p>
                </div>
                <Link
                  to="/admin/orders"
                  className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1"
                >
                  Manage All Orders <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {!overview?.recentOrders || overview.recentOrders.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                  No orders recorded yet. Orders placed by customers will appear here in real time.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                        <th className="pb-3 font-semibold">Order Ref</th>
                        <th className="pb-3 font-semibold">Customer</th>
                        <th className="pb-3 font-semibold">Location</th>
                        <th className="pb-3 font-semibold">Total</th>
                        <th className="pb-3 font-semibold">Payment</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {overview.recentOrders.map((ord: any) => (
                        <tr key={ord.id} className="hover:bg-slate-50/50">
                          <td className="py-3.5 font-mono font-bold text-slate-900">{ord.order_number}</td>
                          <td className="py-3.5 text-slate-700">{ord.customer_name}</td>
                          <td className="py-3.5 text-slate-500">{ord.city}</td>
                          <td className="py-3.5 font-bold text-slate-900">{formatNPR(ord.total_amount)}</td>
                          <td className="py-3.5">
                            <span className="uppercase text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                              {ord.payment_method}
                            </span>
                          </td>
                          <td className="py-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              ord.order_status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.order_status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {ord.order_status}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            <Link
                              to={`/admin/orders?search=${encodeURIComponent(ord.order_number)}`}
                              className="text-emerald-800 hover:text-emerald-700 font-semibold"
                            >
                              Manage
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </>
        )}

      </div>
    </AdminLayout>
  );
};
