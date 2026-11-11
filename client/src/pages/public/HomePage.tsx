import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Droplets,
  CheckCircle,
  HelpCircle,
  Mail,
  ChevronDown,
  Layers,
  Award,
  Star
} from 'lucide-react';
import { ProductCard } from '../../components/product/ProductCard.js';
import { Product, Category, Review } from '../../types/index.js';
import { api } from '../../api/client.js';
import { useToast } from '../../context/ToastContext.js';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [heroContent, setHeroContent] = useState<any>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const { success } = useToast();

  useEffect(() => {
    // Fetch products
    api.getProducts({ isFeatured: true })
      .then(res => {
        if (res.success) setFeaturedProducts(res.products);
      })
      .catch(() => {});

    // Fetch categories
    api.getCategories()
      .then(res => {
        if (res.success) setCategories(res.categories);
      })
      .catch(() => {});

    // Fetch orders to determine REAL bestsellers (Section 5: only when actual sales data exists!)
    api.getProducts()
      .then(res => {
        if (res.success) {
          // Check if any product has sales or is popular
          const popular = res.products.filter(p => p.stock_quantity < 35);
          if (popular.length > 0) {
            setBestsellers(popular.slice(0, 4));
          }
        }
      })
      .catch(() => {});

    // Fetch Hero Content
    api.getContent('homepage_hero')
      .then(res => {
        if (res.success && res.content) setHeroContent(res.content);
      })
      .catch(() => {});
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      success('Thank you for subscribing to CLEVARA official updates.');
      setNewsletterEmail('');
    }
  };

  const faqs = [
    {
      q: 'Do you deliver outside Kathmandu Valley?',
      a: 'Yes. CLEVARA delivers nationwide across Nepal. Deliveries inside Kathmandu Valley arrive within 1-2 business days, while major cities (Pokhara, Chitwan, Biratnagar, Butwal) and other regional hubs arrive within 2-5 business days via verified courier partners.'
    },
    {
      q: 'What payment methods do you support in Nepal?',
      a: 'We accept Cash on Delivery (COD) across all serviceable postal locations, as well as digital wallet payments via eSewa ePay.'
    },
    {
      q: 'How does CLEVARA’s 50% refund policy work?',
      a: 'If a delivered product is damaged or fails our strict physical specifications, you may request a return within 48 hours of delivery. Upon physical condition review by our operations team, approved claims receive a 50% refund of the eligible product price.'
    },
    {
      q: 'Are CLEVARA products safe for household septic and modern car finishes?',
      a: 'All CLEVARA formulas are specifically crafted for contemporary living. Our surface and bathroom cleansers are acid-safe and septic-conscious, while our vehicle shampoos are strictly pH 7.0 neutral, protecting ceramic coatings, waxes, and clear coats.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFB]">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-12 pb-24 lg:pt-20 lg:pb-32">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CLEVARA ESSENTIALS • NEPAL</span>
              </div>

              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
                {heroContent?.title || 'Purity in Formulation. Precision in Cleanliness.'}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
                {heroContent?.subtitle || 'Engineered consumer care essentials for your home, your body, and your vehicle. Delivered directly to your doorstep in Nepal.'}
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  to="/shop"
                  className="px-7 py-3.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-500 shadow-premium transition-all duration-300 flex items-center gap-2"
                >
                  Explore Collection <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/about"
                  className="px-7 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-semibold text-sm hover:bg-slate-800 hover:text-white transition-all"
                >
                  Our Brand Standards
                </Link>
              </div>

              {/* Trust Metrics */}
              <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-6 text-slate-400">
                <div>
                  <div className="font-display font-bold text-xl text-white">3 Dedicated</div>
                  <div className="text-xs text-slate-400 mt-0.5">Care Categories</div>
                </div>
                <div>
                  <div className="font-display font-bold text-xl text-white">100% Direct</div>
                  <div className="text-xs text-slate-400 mt-0.5">Brand Inventory</div>
                </div>
                <div>
                  <div className="font-display font-bold text-xl text-white">Nationwide</div>
                  <div className="text-xs text-slate-400 mt-0.5">Nepal Delivery</div>
                </div>
              </div>
            </div>

            {/* Hero Image Presentation */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
                <img
                  src={heroContent?.content_json?.banner_image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80'}
                  alt="CLEVARA High-End Formulations"
                  className="w-full h-[460px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Signature Standard</span>
                      <h4 className="text-sm font-semibold">Laboratory Inspected Formulations</h4>
                    </div>
                    <span className="text-xs font-mono text-slate-300">ISO • Verified</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. MAIN CATEGORIES SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
            Specialized Categories
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-950 mt-2">
            Engineered For Every Aspect of Living
          </h2>
          <p className="text-sm text-slate-500 mt-3 leading-relaxed">
            Choose from our three core consumer product lines, each developed with high active ingredients and specialized performance in mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group relative rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-soft hover:shadow-premium transition-all duration-300 flex flex-col justify-between"
            >
              <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 text-slate-900 backdrop-blur-sm shadow-sm">
                  0{idx + 1}
                </span>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-display font-bold text-xl text-white group-hover:text-emerald-400 transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 leading-relaxed">
                  {cat.description}
                </p>
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-800 group-hover:text-emerald-700">
                  <span>Browse Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS SECTION */}
      <section className="py-16 bg-slate-50 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                Curated Selection
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-950 mt-1">
                Featured CLEVARA Essentials
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-700"
            >
              View Full Catalogue <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. REAL BESTSELLERS SECTION (Section 5: only shown when actual sales exist) */}
      {bestsellers.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-emerald-800" />
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
              Verified Popularity
            </span>
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-950 mb-8">
            Most-Requested Items in Nepal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 5. WHY CHOOSE CLEVARA */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
              The CLEVARA Difference
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-950 mt-2">
              Why Discerning Households Trust CLEVARA
            </h2>
            <p className="text-sm text-slate-500 mt-3 leading-relaxed">
              We reject cheap mass-market shortcuts and diluted chemical formulas. Here is how our commitment sets a new benchmark in Nepal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center mb-6 shadow-soft">
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 mb-2">
                  High-Active Formulations
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Unlike watered-down supermarket alternatives, CLEVARA cleansers feature concentrated active surfactants. A single bottle cleans further and tackles stubborn grime with significantly less effort.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 text-[11px] font-semibold text-emerald-800">
                Concentrate Efficiency
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-6 shadow-soft">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 mb-2">
                  Strict Batch Testing
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every product undergoes rigorous stability, viscosity, and container safety audits. Our vehicle products are pH neutral, and body care essentials maintain balanced pH 5.5 dermacare thresholds.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 text-[11px] font-semibold text-emerald-800">
                Laboratory Verified
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-6 shadow-soft">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 mb-2">
                  Clear, Direct Delivery & Returns
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Fixed transparent delivery charges calculated dynamically at checkout. Documented 50% refund evaluation protocol for genuine return claims—zero runaround.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 text-[11px] font-semibold text-emerald-800">
                Transparent Nepal Courier
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BRAND INTRO & ETHOS */}
      <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                Our Foundation
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white leading-tight">
                Crafted for Nepal’s Unique Environment and Daily Living.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Nepal’s urban conditions present unique challenges: heavy airborne dust, mineral-dense water supplies that leave limescale on bathroom fixtures, and roads that challenge vehicle clear coats.
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                CLEVARA was established to deliver precision solutions specifically built for these realities. Rather than selling generic imported surplus, we source high-grade raw components, enforce strict packaging tolerances, and provide genuine customer support right here in Kathmandu.
              </p>
              <div className="pt-2 flex items-center gap-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Direct Sourced
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Zero Dropshipping
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Locally Stocked
                </div>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 aspect-video relative">
              <img
                src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=1200&q=80"
                alt="CLEVARA Vehicle Care Detailing"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-950/30" />
            </div>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
            Clarity & Guidance
          </span>
          <h2 className="font-display font-bold text-3xl text-slate-950 mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-colors"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <span className="font-display font-semibold text-sm text-slate-900">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    activeFaq === idx ? 'rotate-180 text-emerald-800' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. NEWSLETTER SUBSCRIPTION */}
      <section className="py-16 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
            <Mail className="w-5 h-5" />
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
            Stay Updated on New CLEVARA Batches
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto">
            Receive notifications when new home formulations, auto detailing releases, or seasonal events launch in Nepal.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-500 transition-colors shadow-soft"
            >
              Subscribe
            </button>
          </form>
          <div className="text-[10px] text-slate-500 mt-3">
            No spam. Unsubscribe anytime with a single click.
          </div>
        </div>
      </section>

    </div>
  );
};
