import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, RefreshCw, Truck, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Highlights Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Nationwide Nepal Delivery</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Reliable door-to-door courier dispatch across Kathmandu Valley and all major provinces.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">50% Clear Refund Standard</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Documented, honest return and 50% refund evaluation on eligible claims with photo verification.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Direct Brand Assurance</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Zero dropshipping. Every product is sourced, quality-audited, and stocked directly by CLEVARA.
              </p>
            </div>
          </div>
        </div>

        {/* Links Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-12">
          
          {/* Brand Info */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <span className="font-display font-extrabold text-2xl tracking-[0.16em] text-white">
                CLEVARA
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-6">
              CLEVARA is a specialized private-label consumer goods brand based in Nepal. We formulate and curate high-efficiency essentials for discerning home, personal care, and automotive enthusiasts.
            </p>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Baluwatar / Lazimpat Commercial Hub, Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Customer Care: +977-9841000000 / +977-01-4400000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>support@clevara.com</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Categories</h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/category/home-cleaning" className="text-slate-400 hover:text-white transition-colors">
                  Home Cleaning
                </Link>
              </li>
              <li>
                <Link to="/category/body-cleaning" className="text-slate-400 hover:text-white transition-colors">
                  Body Cleaning
                </Link>
              </li>
              <li>
                <Link to="/category/car-cleaning" className="text-slate-400 hover:text-white transition-colors">
                  Car Cleaning
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-slate-400 hover:text-white transition-colors">
                  Complete Catalogue
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Customer Care</h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/track-order" className="text-slate-400 hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/cancellations" className="text-slate-400 hover:text-white transition-colors">
                  Request Cancellation
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-slate-400 hover:text-white transition-colors">
                  Return & 50% Refund
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-slate-400 hover:text-white transition-colors">
                  Help & FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Contact & Complaints
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Policies & Legal</h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/policies/shipping" className="text-slate-400 hover:text-white transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/policies/payment" className="text-slate-400 hover:text-white transition-colors">
                  Payment Methods
                </Link>
              </li>
              <li>
                <Link to="/policies/refund" className="text-slate-400 hover:text-white transition-colors">
                  50% Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/policies/cancellation" className="text-slate-400 hover:text-white transition-colors">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="/policies/damaged-products" className="text-slate-400 hover:text-white transition-colors">
                  Damaged Product Policy
                </Link>
              </li>
              <li>
                <Link to="/policies/privacy" className="text-slate-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/policies/terms" className="text-slate-400 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Payment Icons & Admin Link */}
        <div className="pt-8 mt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} CLEVARA. All rights reserved. Registered Private-Label Consumer Goods Brand in Nepal.
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-400">Accepted Payment Methods:</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-medium text-[10px]">
              Cash on Delivery (COD)
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 font-medium text-[10px]">
              eSewa ePay
            </span>
            <Link to="/admin/login" className="inline-flex items-center text-slate-500 hover:text-slate-300 ml-2">
              Staff <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
