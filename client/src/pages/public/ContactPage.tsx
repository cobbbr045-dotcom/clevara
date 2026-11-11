import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { api } from '../../api/client.js';
import { useToast } from '../../context/ToastContext.js';

export const ContactPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<'inquiry' | 'complaint' | 'damaged_product' | 'order_status' | 'feedback'>('inquiry');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<any>(null);

  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await api.submitContact({
        full_name: fullName,
        email,
        phone,
        category,
        subject,
        message
      });

      if (res.success) {
        success('Your message has been received by CLEVARA customer support.');
        setSubmittedTicket(res.ticket);
        setFullName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
      }
    } catch (err: any) {
      error(err.message || 'Failed to submit message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
            CLEVARA Support & Service
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-950 mt-1">
            Customer Care & Official Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-lg mx-auto">
            Need assistance with an existing order, product formulation questions, or reporting a damaged delivery? Our Kathmandu support team is ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Contact Info & Support Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-6">
              <h2 className="font-display font-bold text-lg text-slate-950 border-b border-slate-100 pb-3">
                Direct Contact Channels
              </h2>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800 shrink-0">
                    <Phone className="w-4 h-4 text-emerald-800" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">Phone Inquiries</span>
                    <span className="text-slate-600 block mt-0.5">+977-9841000000 / +977-01-4400000</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Sun – Fri, 9:00 AM – 6:00 PM NPT</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">WhatsApp Support</span>
                    <span className="text-slate-600 block mt-0.5">+977-9841000000</span>
                    <a
                      href="https://wa.me/9779841000000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-semibold text-emerald-800 hover:underline block mt-0.5"
                    >
                      Chat with a representative on WhatsApp →
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800 shrink-0">
                    <Mail className="w-4 h-4 text-emerald-800" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">Email Support</span>
                    <span className="text-slate-600 block mt-0.5">support@clevara.com</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Response within 24 business hours</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800 shrink-0">
                    <MapPin className="w-4 h-4 text-emerald-800" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">Kathmandu Operations Hub</span>
                    <span className="text-slate-600 block mt-0.5">Baluwatar / Lazimpat Commercial Center, Kathmandu, Nepal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Damaged Product Policy Reminder */}
            <div className="bg-emerald-950 text-white rounded-3xl p-6 border border-emerald-900 shadow-soft">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-emerald-400" />
                <h3 className="font-display font-bold text-sm text-white">Reporting Damaged Deliveries</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                If your parcel arrived broken or leaking during courier transit, select "Damaged Product Report" on the form. Please retain the outer shipping carton and photograph the issue clearly so our operations team can process your claim under our 50% refund evaluation protocol.
              </p>
            </div>
          </div>

          {/* Right: Contact & Complaint Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-soft">
              
              {submittedTicket && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-900">
                    <span className="font-bold block">Support Ticket Logged: {submittedTicket.id}</span>
                    <span>Your inquiry has been assigned to our Kathmandu support queue. We will follow up via your email ({submittedTicket.email}).</span>
                  </div>
                </div>
              )}

              <h2 className="font-display font-bold text-lg text-slate-950 mb-1">
                Send a Message or Report an Issue
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                All inquiries and complaints are recorded and addressed directly by CLEVARA staff.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bipin Adhikari"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. bipin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9841XXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Topic / Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700 cursor-pointer"
                    >
                      <option value="inquiry">General Inquiry</option>
                      <option value="order_status">Order Tracking Inquiry</option>
                      <option value="complaint">Customer Complaint</option>
                      <option value="damaged_product">Damaged Product Report</option>
                      <option value="feedback">Product Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Brief description of your message or order reference"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Message Details *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide full details including your order number or product name if applicable..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-6 rounded-xl bg-slate-950 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2 shadow-soft disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Submitting to Queue...' : 'Submit Support Message'}
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
