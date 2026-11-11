import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Truck, RotateCcw, AlertTriangle, CreditCard, Lock, FileText } from 'lucide-react';

interface PolicyWrapperProps {
  title: string;
  badge: string;
  lastUpdated: string;
  children: React.ReactNode;
}

const PolicyWrapper: React.FC<PolicyWrapperProps> = ({ title, badge, lastUpdated, children }) => (
  <div className="min-h-screen bg-[#FBFBFB] py-14">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-soft space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {badge}
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-950 mt-3">
            {title}
          </h1>
          <span className="text-xs text-slate-400 block mt-1">Last Updated: {lastUpdated} • CLEVARA Nepal Operations</span>
        </div>

        <div className="prose prose-slate text-xs sm:text-sm leading-relaxed space-y-4 text-slate-600 border-t border-slate-100 pt-6">
          {children}
        </div>
      </div>
    </div>
  </div>
);

export const ShippingPolicyPage: React.FC = () => (
  <PolicyWrapper title="Shipping & Delivery Policy" badge="Logistics Standards" lastUpdated="November 2026">
    <p>
      At CLEVARA, we ensure that every bottle and accessory is securely packed and dispatched directly from our Kathmandu operations facility. We partner with vetted courier networks to guarantee transparent transit across Nepal.
    </p>
    <h3 className="font-display font-bold text-slate-900 text-sm">1. Delivery Zones & Timelines</h3>
    <ul className="list-disc pl-5 space-y-1">
      <li><strong>Kathmandu Valley (Inside Ring Road):</strong> Standard courier delivery within 1 to 2 business days. Fee: Rs. 100.</li>
      <li><strong>Kathmandu Valley (Outside Ring Road / Lalitpur / Bhaktapur):</strong> Doorstep delivery within 1 to 2 business days. Fee: Rs. 150.</li>
      <li><strong>Major Regional Hubs (Pokhara, Chitwan, Biratnagar, Butwal):</strong> Express road transit within 2 to 4 business days. Fee: Rs. 200.</li>
      <li><strong>Rest of Nepal (Nationwide Courier):</strong> Comprehensive postal & road courier delivery within 3 to 6 business days. Fee: Rs. 250.</li>
    </ul>
    <h3 className="font-display font-bold text-slate-900 text-sm">2. Separate Delivery Billing</h3>
    <p>
      In accordance with our consumer transparency principles, delivery charges are calculated separately at checkout based on actual transport logistics and are never deceptively bundled into product retail prices.
    </p>
  </PolicyWrapper>
);

export const PaymentPolicyPage: React.FC = () => (
  <PolicyWrapper title="Payment Policy" badge="Financial Terms" lastUpdated="November 2026">
    <p>
      CLEVARA provides secure, verified payment channels tailored specifically for consumers in Nepal.
    </p>
    <h3 className="font-display font-bold text-slate-900 text-sm">1. Supported Payment Channels</h3>
    <ul className="list-disc pl-5 space-y-1">
      <li><strong>Cash on Delivery (COD):</strong> Payable in Nepalese Rupees (NPR) to the delivery agent upon physical parcel receipt.</li>
      <li><strong>eSewa Digital Wallet:</strong> Direct payment via eSewa ePay v2. Payment status is verified cryptographically via server-to-server callback signatures.</li>
    </ul>
    <h3 className="font-display font-bold text-slate-900 text-sm">2. Server-Side Verification</h3>
    <p>
      Payments are never marked as completed based solely on browser redirects. Every digital transaction is validated against cryptographic merchant signatures before orders are cleared for dispatch.
    </p>
  </PolicyWrapper>
);

export const CancellationPolicyPage: React.FC = () => (
  <PolicyWrapper title="Cancellation Policy" badge="Order Adjustments" lastUpdated="November 2026">
    <p>
      We understand that circumstances may require order changes. CLEVARA allows order cancellations under the following criteria:
    </p>
    <h3 className="font-display font-bold text-slate-900 text-sm">1. Cancellation Window</h3>
    <p>
      Customers may submit a cancellation request through our online tracking portal at any time before the order has been handed over to our courier partner (statuses: "Pending", "Confirmed", or "Processing").
    </p>
    <h3 className="font-display font-bold text-slate-900 text-sm">2. In-Transit Exceptions</h3>
    <p>
      Once an order status transitions to "Shipped" or "Out for Delivery", the shipment cannot be intercepted in transit. Customers must receive the package and initiate a standard return.
    </p>
  </PolicyWrapper>
);

export const ReturnsPolicyPage: React.FC = () => (
  <PolicyWrapper title="Returns Policy" badge="Product Exchanges & Returns" lastUpdated="November 2026">
    <p>
      CLEVARA stands behind the craftsmanship of every product line. Due to the personal hygiene and chemical purity of our consumer goods, return conditions are strictly maintained.
    </p>
    <h3 className="font-display font-bold text-slate-900 text-sm">1. Eligibility Criteria</h3>
    <p>
      Items are eligible for return review within 48 hours of confirmed delivery if:
    </p>
    <ul className="list-disc pl-5 space-y-1">
      <li>The product arrived damaged, broken, or actively leaking during courier transit.</li>
      <li>The item materially differs in variant or specification from what was ordered.</li>
      <li>The product container is in its original, unadulterated state with safety seals intact where applicable.</li>
    </ul>
  </PolicyWrapper>
);

export const RefundPolicyPage: React.FC = () => (
  <PolicyWrapper title="Refund Policy (50% Standard)" badge="Consumer Protection" lastUpdated="November 2026">
    <p>
      CLEVARA operates under a transparent, clearly disclosed return and refund standard tailored to private-label consumer goods in Nepal.
    </p>
    <h3 className="font-display font-bold text-slate-900 text-sm">1. The 50% Refund Standard</h3>
    <p>
      Approved return claims are subject to a <strong>50% refund</strong> of the eligible product purchase price. This structure accounts for non-recoverable return inspection, handling, and hazardous disposal protocols associated with chemical and personal hygiene essentials.
    </p>
    <h3 className="font-display font-bold text-slate-900 text-sm">2. Non-Refundable Expenses</h3>
    <p>
      Courier shipping fees paid at checkout or return transit expenses are strictly non-refundable. Refunds are never issued automatically without administrative inspection.
    </p>
    <h3 className="font-display font-bold text-slate-900 text-sm">3. Processing Timelines</h3>
    <p>
      Approved refunds are disbursed to the customer's provided bank account or eSewa digital wallet within 3 to 5 business days following physical receipt and inspection at our Kathmandu operations center.
    </p>
  </PolicyWrapper>
);

export const DamagedProductPolicyPage: React.FC = () => (
  <PolicyWrapper title="Damaged Product Policy" badge="Incident Reporting" lastUpdated="November 2026">
    <p>
      While we enforce heavy bubble-wrap and impact-resistant cartons for all nationwide Nepal deliveries, road transit occasionally causes container distress.
    </p>
    <h3 className="font-display font-bold text-slate-900 text-sm">1. Immediate Photographic Evidence</h3>
    <p>
      If your parcel arrives with liquid leakage or physical breakage, do not discard the outer packaging carton. Take clear photographs of the damage immediately upon receipt.
    </p>
    <h3 className="font-display font-bold text-slate-900 text-sm">2. Submitting Your Claim</h3>
    <p>
      Submit your claim via our "Report Damaged Product" portal within 48 hours. Our operations team reviews all submissions within 24 business hours to authorize return or refund evaluation.
    </p>
  </PolicyWrapper>
);

export const PrivacyPolicyPage: React.FC = () => (
  <PolicyWrapper title="Privacy Policy" badge="Data Governance" lastUpdated="November 2026">
    <p>
      CLEVARA respects the personal privacy of all consumers in Nepal. We collect necessary customer information solely to fulfill orders, arrange courier dispatch, and provide customer support.
    </p>
    <h3 className="font-display font-bold text-slate-900 text-sm">1. Information Collected</h3>
    <p>
      We collect customer names, phone numbers, delivery addresses, and optional communication handles (Instagram, WhatsApp, Viber). We do not store payment card credentials or digital wallet passwords.
    </p>
    <h3 className="font-display font-bold text-slate-900 text-sm">2. Security & RLS</h3>
    <p>
      All data is secured via PostgreSQL Row Level Security (RLS) and encrypted database communication. Customers cannot access other customers' personal records or order information.
    </p>
  </PolicyWrapper>
);

export const TermsPage: React.FC = () => (
  <PolicyWrapper title="Terms & Conditions" badge="Operating Agreement" lastUpdated="November 2026">
    <p>
      By accessing or placing an order through CLEVARA's platform, you agree to comply with our commercial terms and conditions governed by the laws of Nepal.
    </p>
    <h3 className="font-display font-bold text-slate-900 text-sm">1. Product Usage</h3>
    <p>
      CLEVARA formulations are intended solely for their specified household, personal care, and automotive applications. Always consult the product label for dilution ratios and safety guidelines.
    </p>
    <h3 className="font-display font-bold text-slate-900 text-sm">2. Pricing & Availability</h3>
    <p>
      All prices are stated in Nepalese Rupees (NPR). Product availability is subject to physical warehouse stock in Nepal. We reserve the right to cancel orders placed under erroneous typographical pricing.
    </p>
  </PolicyWrapper>
);
