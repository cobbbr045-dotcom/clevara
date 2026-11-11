import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useCart } from '../../context/CartContext.js';
import { formatNPR } from '../../utils/format.js';
import { api } from '../../api/client.js';
import { DeliveryZone } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    subtotal,
    deliveryZone,
    setDeliveryZone,
    deliveryFee,
    appliedCoupon,
    finalTotal,
    clearCart
  } = useCart();

  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loadingZones, setLoadingZones] = useState(true);

  // Form Fields (Required by Section 10)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Kathmandu');
  const [address, setAddress] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState('');

  // Optional Contact & Instructions Fields
  const [instagram, setInstagram] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [viber, setViber] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  // Payment method: 'cod' or 'esewa'
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'esewa'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // eSewa hidden form auto-submit state
  const [esewaFormData, setEsewaFormData] = useState<any>(null);
  const [esewaActionUrl, setEsewaActionUrl] = useState('');

  const { success, error } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    api.getDeliveryZones()
      .then(res => {
        if (res.success && res.zones) {
          setZones(res.zones);
          const initialZone = deliveryZone || res.zones[0];
          if (initialZone) {
            setSelectedZoneId(initialZone.id);
            setDeliveryZone(initialZone);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoadingZones(false));
  }, []);

  const handleZoneChange = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    const matched = zones.find(z => z.id === zoneId);
    if (matched) {
      setDeliveryZone(matched);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (cart.length === 0) {
      error('Your cart is empty.');
      navigate('/shop');
      return;
    }

    if (!fullName || !email || !phone || !address || !city || !selectedZoneId) {
      setErrorMsg('Please complete all required shipping fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Submit order to server with atomic validation & stock deduction (TEST 6, 7, 8)
      const orderPayload = {
        customer_name: fullName,
        customer_email: email,
        customer_phone: phone,
        delivery_address: address,
        city: city,
        delivery_zone_id: selectedZoneId,
        delivery_instructions: deliveryInstructions || undefined,
        instagram_username: instagram || undefined,
        whatsapp_number: whatsapp || undefined,
        viber_number: viber || undefined,
        payment_method: paymentMethod,
        coupon_code: appliedCoupon?.code,
        items: cart.map(item => ({
          product_id: item.productId,
          variant_id: item.variantId || null,
          quantity: item.quantity
        }))
      };

      const result = await api.submitOrder(orderPayload);

      if (!result.success || !result.order) {
        throw new Error(result.error || 'Failed to place order.');
      }

      const placedOrder = result.order;

      // 2. Handle payment routing
      if (paymentMethod === 'esewa') {
        // Initiate eSewa payment request
        const esewaInit = await api.initiateEsewa(
          placedOrder.id,
          `${window.location.origin}/order-confirmation?order=${placedOrder.order_number}&status=success`,
          `${window.location.origin}/checkout?payment=failed`
        );

        if (esewaInit.success && esewaInit.payment) {
          clearCart();
          setEsewaActionUrl(esewaInit.payment.gatewayUrl);
          setEsewaFormData(esewaInit.payment.formData);
          // Wait briefly for hidden form rendering then auto-submit to eSewa
          setTimeout(() => {
            const form = document.getElementById('esewaAutoForm') as HTMLFormElement;
            if (form) form.submit();
          }, 300);
          return;
        }
      }

      // COD or normal flow
      clearCart();
      success(`Order ${placedOrder.order_number} confirmed!`);
      navigate(`/order-confirmation?order=${placedOrder.order_number}`);

    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during checkout.');
      error(err.message || 'Checkout failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !isSubmitting && !esewaFormData) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] py-20 text-center">
        <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">Cart is empty</h2>
        <p className="text-xs text-slate-500 mb-6">Add products before proceeding to checkout.</p>
        <Link to="/shop" className="px-5 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-semibold">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
            Secure Nepal Checkout
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-950 mt-1">
            Shipping & Payment Information
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <Lock className="w-3.5 h-3.5 text-emerald-800" />
            <span>Encrypted Server-Side Processing | Authentic CLEVARA Logistics</span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Customer Info & Address */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Required Customer Details */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-4">
              <h2 className="font-display font-bold text-base text-slate-950 border-b border-slate-100 pb-3">
                1. Recipient Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Roshan Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number (Nepal Mobile) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9841234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (For Order Tracking & Invoices) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. roshan@example.np"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            {/* Delivery Address & Zone Selection */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-4">
              <h2 className="font-display font-bold text-base text-slate-950 border-b border-slate-100 pb-3">
                2. Shipping Destination & Logistics Zone
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivery Zone (Determines courier fee) *
                </label>
                <select
                  value={selectedZoneId}
                  onChange={(e) => handleZoneChange(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700 font-medium cursor-pointer"
                >
                  {zones.map(z => (
                    <option key={z.id} value={z.id}>
                      {z.name} — {formatNPR(z.fee)} ({z.estimated_delivery_time})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Delivery charges are billed separately from product retail prices as per CLEVARA policy.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Municipality *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kathmandu, Pokhara, Lalitpur"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Street Address / House No. / Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ward 4, Near Bhatbhateni Supermarket"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivery Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Gate code, specific delivery hour preference, or courier instructions..."
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            {/* Optional Social Contacts */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-4">
              <div>
                <h2 className="font-display font-bold text-base text-slate-950">
                  3. Optional Messaging Channels
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Helps our delivery dispatchers coordinate parcel arrival via your preferred app.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    placeholder="@username"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="98XXXXXXXX"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Viber Number
                  </label>
                  <input
                    type="tel"
                    placeholder="98XXXXXXXX"
                    value={viber}
                    onChange={(e) => setViber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-4">
              <h2 className="font-display font-bold text-base text-slate-950 border-b border-slate-100 pb-3">
                4. Select Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cash On Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl text-left border transition-all flex items-start gap-3 ${
                    paymentMethod === 'cod'
                      ? 'bg-emerald-50/70 border-emerald-800 ring-2 ring-emerald-800'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white border border-slate-200 text-emerald-800 shrink-0">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">Cash on Delivery (COD)</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">Pay in cash upon doorstep delivery</span>
                  </div>
                </button>

                {/* eSewa */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('esewa')}
                  className={`p-4 rounded-2xl text-left border transition-all flex items-start gap-3 ${
                    paymentMethod === 'esewa'
                      ? 'bg-emerald-50/70 border-emerald-800 ring-2 ring-emerald-800'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-[#60BB46] text-white shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">eSewa Digital Wallet</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">Instant online payment via ePay v2</span>
                  </div>
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary & Placement */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-premium space-y-6">
              <h2 className="font-display font-bold text-base text-slate-950 border-b border-slate-100 pb-3">
                Order Review ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map(item => (
                  <div key={item.sku} className="flex items-center justify-between text-xs py-2 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-900 block line-clamp-1">{item.name}</span>
                        {item.variantName && (
                          <span className="text-[10px] text-emerald-800 font-semibold">{item.variantName}</span>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono block">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">{formatNPR(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Cost Calculation (Separately calculated as required by Section 10) */}
              <div className="space-y-2 text-xs border-t border-slate-100 pt-4 text-slate-600">
                <div className="flex justify-between">
                  <span>Product Subtotal:</span>
                  <span className="font-semibold text-slate-900">{formatNPR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge ({deliveryZone?.name || 'Nepal Courier'}):</span>
                  <span className="font-semibold text-slate-900">{formatNPR(deliveryFee)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Coupon ({appliedCoupon.code}):</span>
                    <span>-{formatNPR(appliedCoupon.discount)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                  <span>Payable Total:</span>
                  <span className="font-display text-emerald-800 text-lg">{formatNPR(finalTotal)}</span>
                </div>
              </div>

              {/* Complete Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl bg-slate-950 text-white font-semibold text-xs sm:text-sm hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 shadow-soft disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Securing Order...</span>
                ) : (
                  <>
                    <span>Confirm Order ({paymentMethod === 'esewa' ? 'Pay with eSewa' : 'Cash on Delivery'})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                <span>
                  All orders are verified and stocked locally in Nepal. Stock is reserved atomically upon placement.
                </span>
              </div>
            </div>

          </div>

        </form>

        {/* Hidden eSewa Auto-Redirect Form */}
        {esewaFormData && (
          <form id="esewaAutoForm" method="POST" action={esewaActionUrl} className="hidden">
            {Object.entries(esewaFormData).map(([k, v]) => (
              <input key={k} type="hidden" name={k} value={v as string} />
            ))}
          </form>
        )}

      </div>
    </div>
  );
};
