import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  XCircle,
  Eye,
  MapPin,
  Phone,
  Mail,
  User,
  X
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { api } from '../../api/client.js';
import { formatNPR, formatDate } from '../../utils/format.js';
import { Order, OrderStatus, PaymentStatus } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminOrdersPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Selected Order for Modal View & Status Update
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending');
  const [newPaymentStatus, setNewPaymentStatus] = useState<PaymentStatus>('pending');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const { success, error } = useToast();

  const loadOrders = () => {
    setLoading(true);
    api.getAdminOrders({
      search: search || undefined,
      status: statusFilter || undefined
    })
      .then(res => {
        if (res.success) {
          setOrders(res.orders);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, [search, statusFilter]);

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.order_status);
    setNewPaymentStatus(order.payment_status);
    setAdminNotes(order.admin_notes || '');
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setUpdating(true);
    try {
      const res = await api.updateOrderStatus(selectedOrder.id, newStatus, newPaymentStatus, adminNotes);
      if (res.success && res.order) {
        success(`Order ${res.order.order_number} status updated to "${res.order.order_status}".`);
        setSelectedOrder(res.order);
        loadOrders();
      }
    } catch (err: any) {
      error(err.message || 'Failed to update order status.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-100 text-emerald-800';
      case 'shipped': case 'out_for_delivery': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'confirmed': return 'bg-teal-100 text-teal-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'refunded': case 'returned': return 'bg-amber-100 text-amber-800';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-2xl text-slate-900">
              Customer Order Management
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Fulfill orders, track customer contact details, manage Nepal delivery statuses, and audit payment methods.
            </p>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by order #, customer name, phone, or tracking..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
              <option value="refunded">Refunded</option>
            </select>
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
              {orders.length} Orders Found
            </span>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              No orders found matching the filter criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4 font-semibold">Order Ref</th>
                    <th className="py-3.5 px-4 font-semibold">Date</th>
                    <th className="py-3.5 px-4 font-semibold">Customer</th>
                    <th className="py-3.5 px-4 font-semibold">Phone</th>
                    <th className="py-3.5 px-4 font-semibold">City & Zone</th>
                    <th className="py-3.5 px-4 font-semibold">Total Amount</th>
                    <th className="py-3.5 px-4 font-semibold">Payment</th>
                    <th className="py-3.5 px-4 font-semibold">Order Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {order.order_number}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {order.customer_name}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        {order.customer_phone}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {order.city}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {formatNPR(order.total_amount)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="uppercase text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded mr-1">
                          {order.payment_method}
                        </span>
                        <span className="capitalize text-[10px] text-slate-500">
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.order_status)}`}>
                          {order.order_status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => openOrderModal(order)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Details & Status Update Modal (TEST 10) */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    Order Inspection & Status Control
                  </span>
                  <h2 className="font-display font-bold text-xl text-slate-900 font-mono">
                    {selectedOrder.order_number}
                  </h2>
                  <span className="text-xs text-slate-400">Tracking Code: {selectedOrder.tracking_code}</span>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer Information */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                  Customer Information & Contacts
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                  <div><strong>Name:</strong> {selectedOrder.customer_name}</div>
                  <div><strong>Email:</strong> {selectedOrder.customer_email}</div>
                  <div><strong>Phone:</strong> {selectedOrder.customer_phone}</div>
                  <div><strong>City:</strong> {selectedOrder.city}</div>
                  <div className="sm:col-span-2"><strong>Address:</strong> {selectedOrder.delivery_address}</div>
                  {selectedOrder.instagram_username && <div><strong>Instagram:</strong> {selectedOrder.instagram_username}</div>}
                  {selectedOrder.whatsapp_number && <div><strong>WhatsApp:</strong> {selectedOrder.whatsapp_number}</div>}
                  {selectedOrder.viber_number && <div><strong>Viber:</strong> {selectedOrder.viber_number}</div>}
                  {selectedOrder.delivery_instructions && (
                    <div className="sm:col-span-2 text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                      <strong>Delivery Instructions:</strong> {selectedOrder.delivery_instructions}
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider mb-2">
                  Ordered Products ({selectedOrder.items?.length || 0})
                </span>
                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                  {selectedOrder.items?.map(it => (
                    <div key={it.id} className="p-3 text-xs flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-900 block">{it.product_name}</span>
                        {it.variant_name && <span className="text-[11px] text-slate-500">Option: {it.variant_name}</span>}
                        <span className="text-[10px] text-slate-400 font-mono block">SKU: {it.sku}</span>
                      </div>
                      <div className="text-right">
                        <span>{it.quantity} x {formatNPR(it.unit_price)}</span>
                        <span className="font-bold text-slate-900 block">{formatNPR(it.subtotal)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 text-xs space-y-1 text-slate-600 border-t border-slate-100 mt-3">
                  <div className="flex justify-between"><span>Subtotal:</span><span>{formatNPR(selectedOrder.subtotal)}</span></div>
                  <div className="flex justify-between"><span>Delivery Fee:</span><span>{formatNPR(selectedOrder.delivery_fee)}</span></div>
                  {selectedOrder.discount_amount > 0 && (
                    <div className="flex justify-between text-emerald-800 font-semibold">
                      <span>Discount:</span><span>-{formatNPR(selectedOrder.discount_amount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-slate-900 text-sm pt-1 border-t border-slate-100">
                    <span>Total Amount:</span><span>{formatNPR(selectedOrder.total_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Status Update Form (TEST 10) */}
              <form onSubmit={handleUpdateStatus} className="border-t border-slate-200 pt-4 space-y-4">
                <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                  Update Order Fulfillment Status
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Fulfillment Status *
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700 cursor-pointer font-medium"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing (Packaging)</option>
                      <option value="shipped">Shipped (Dispatched to Courier)</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled (Restocks Item)</option>
                      <option value="returned">Returned</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Payment Status *
                    </label>
                    <select
                      value={newPaymentStatus}
                      onChange={(e) => setNewPaymentStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700 cursor-pointer font-medium"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="partially_refunded">Partially Refunded (50%)</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Internal Operations Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Log dispatcher tracking notes or customer requests..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-6 py-2.5 rounded-xl bg-slate-950 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors shadow-soft disabled:opacity-50"
                  >
                    {updating ? 'Updating...' : 'Save Order Changes'}
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
