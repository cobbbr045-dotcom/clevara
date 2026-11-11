import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Droplet, Sparkles, Award, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FBFBFB] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
            About CLEVARA
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-950 mt-2">
            Purity in Formulation. Precision in Cleanliness.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-4 leading-relaxed max-w-2xl mx-auto">
            Founded with a clear mandate: to end the compromise between cheap, watered-down supermarket chemicals and expensive foreign imports with uncertain supply chains in Nepal.
          </p>
        </div>

        {/* Narrative Section */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-soft space-y-8 mb-12">
          <div>
            <h2 className="font-display font-bold text-xl text-slate-900 mb-3">
              The Nepali Consumer Reality
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Living in Nepal brings unique environmental realities. Urban areas face persistent airborne dust, groundwater and municipal supplies are heavily saturated with minerals that cause stubborn white limescale, and vehicular travel on mixed terrains subjects car clear coats to extreme abrasion.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3">
              Standard commercial products sold in retail stores are frequently formulated with minimal active surfactants, leaving households and vehicle owners frustrated. CLEVARA was founded to build private-label formulations specifically engineered to overcome these conditions.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-8">
            <h2 className="font-display font-bold text-xl text-slate-900 mb-3">
              Our Core Product Pillars
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-xs text-emerald-800 uppercase block mb-1">01. Home Cleaning</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Heavy-duty concentrates, non-corrosive kitchen degreasers, and botanical multi-surface sprays safe for marble, wood, and tiles.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-xs text-emerald-800 uppercase block mb-1">02. Body Cleaning</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  pH-balanced 5.5 formulations with gentle natural surfactants, soothing extracts, and zero skin-stripping sulfates.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-xs text-emerald-800 uppercase block mb-1">03. Car Cleaning</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ceramic-safe pH 7.0 auto shampoos, UV-blocking satin interior dressings, and heavy Korean-fiber 1200 GSM drying towels.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8">
            <h2 className="font-display font-bold text-xl text-slate-900 mb-3">
              Our Pledge: Zero Dropshipping & Authentic Inventory
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every CLEVARA product is physically warehoused, quality-audited, and dispatched directly from our Kathmandu operations facility. We do not dropship or fabricate certifications, claims, or reviews. What you see is what has been physically inspected and prepared for shipment.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-8 rounded-3xl bg-slate-950 text-white text-center shadow-premium">
          <h3 className="font-display font-bold text-xl text-white mb-2">Experience CLEVARA Standards Today</h3>
          <p className="text-xs text-slate-400 mb-6 max-w-md mx-auto">
            Order directly with verified nationwide Nepal delivery, Cash on Delivery, or secure eSewa checkout.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
          >
            Explore Catalogue <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};
