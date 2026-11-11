import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Phone, Mail, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FAQPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const categories = [
    {
      category: 'Ordering & Payment',
      items: [
        {
          q: 'What payment options are available in Nepal?',
          a: 'We offer Cash on Delivery (COD) nationwide for all serviceable courier postcodes, as well as digital wallet payments via eSewa ePay.'
        },
        {
          q: 'Can I cancel an order after placing it?',
          a: 'Yes. You can submit a cancellation request through our Track Order page or Cancellation portal as long as the order has not been marked as "Shipped" or "Out for Delivery". Once dispatched with the courier, cancellation is no longer possible, but you can file a return upon receipt.'
        },
        {
          q: 'Do you offer bulk or commercial orders for hotels and auto detailers?',
          a: 'Yes. For commercial or bulk volume inquiries for detailing centers, hotels, or offices, please reach out directly via our Contact page or WhatsApp.'
        }
      ]
    },
    {
      category: 'Shipping & Delivery',
      items: [
        {
          q: 'How long does delivery take inside Kathmandu Valley?',
          a: 'Orders within Kathmandu, Lalitpur, and Bhaktapur are typically delivered within 1 to 2 business days from the time of order confirmation.'
        },
        {
          q: 'How long does nationwide delivery take?',
          a: 'Shipments to major regional hubs such as Pokhara, Chitwan, Biratnagar, and Butwal take 2 to 4 business days. Outlying provincial areas may require 3 to 6 business days depending on road transit conditions.'
        },
        {
          q: 'How are delivery fees calculated?',
          a: 'Delivery fees are calculated separately based on your specific geographical zone (e.g. Inside Ring Road: Rs. 100, Outside Ring Road / Suburbs: Rs. 150, Major Regional Hubs: Rs. 200, Rest of Nepal: Rs. 250). Delivery fees are never hidden or bundled deceptively into product retail prices.'
        }
      ]
    },
    {
      category: 'Returns, Damaged Goods & 50% Refund Standard',
      items: [
        {
          q: 'What is CLEVARA’s return policy?',
          a: 'Returns may be initiated within 48 hours of delivery if an item arrives damaged, defective, or noticeably differs from its catalog specifications. Customers must submit photographic evidence through our Return Request portal.'
        },
        {
          q: 'How does the 50% refund policy apply?',
          a: 'Under CLEVARA’s verified return standard, approved claims are refunded at 50% of the eligible product purchase price upon physical inspection by our operations team. Delivery courier fees are non-refundable.'
        },
        {
          q: 'What should I do if my bottle arrives leaking or damaged?',
          a: 'Immediately take clear photographs of the courier package and damaged bottle, and submit them through our "Report Damaged Product" form under Customer Care. Our support team will inspect and respond within 24 business hours.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
            Support Center
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-950 mt-1">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-lg mx-auto">
            Find immediate answers regarding product formulations, nationwide delivery schedules, payment options, and return procedures in Nepal.
          </p>
        </div>

        <div className="space-y-8">
          {categories.map((cat, cIdx) => (
            <div key={cIdx} className="space-y-3">
              <h2 className="font-display font-bold text-base text-slate-900 border-b border-slate-200 pb-2">
                {cat.category}
              </h2>
              <div className="space-y-2">
                {cat.items.map((item, iIdx) => {
                  const globalIdx = cIdx * 10 + iIdx;
                  const isOpen = openIdx === globalIdx;

                  return (
                    <div
                      key={iIdx}
                      className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => setOpenIdx(isOpen ? null : globalIdx)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-display font-semibold text-xs sm:text-sm text-slate-900">
                          {item.q}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-emerald-800' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Assistance Card */}
        <div className="mt-14 p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-bold text-lg text-white">Still have questions?</h3>
            <p className="text-xs text-slate-400 mt-1">
              Our Kathmandu-based customer service team is available Sunday through Friday.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors shrink-0 shadow-soft"
          >
            Contact Customer Care
          </Link>
        </div>

      </div>
    </div>
  );
};
