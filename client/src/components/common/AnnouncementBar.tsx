import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, ChevronRight } from 'lucide-react';
import { api } from '../../api/client.js';

export const AnnouncementBar: React.FC = () => {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    api.getContent('announcement_bar')
      .then(res => {
        if (res.success && res.content) {
          setContent(res.content);
        }
      })
      .catch(() => {});
  }, []);

  const title = content?.title || 'Free delivery across Kathmandu Valley on orders over Rs. 2,000 | Authentic CLEVARA Formulations';
  const badge = content?.content_json?.badge || 'OFFICIAL STORE';
  const link = content?.content_json?.link || '/shop';

  return (
    <div className="bg-slate-950 text-white text-xs border-b border-slate-800 py-2.5 px-4 relative z-40 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="hidden sm:flex items-center gap-2 text-slate-400">
          <Truck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Nationwide Courier Delivery Throughout Nepal</span>
        </div>

        <div className="flex-1 sm:flex-initial flex items-center justify-center gap-2.5 text-center">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 tracking-wider">
            {badge}
          </span>
          <span className="font-medium text-slate-200">{title}</span>
          <Link
            to={link}
            className="inline-flex items-center text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 ml-1"
          >
            Shop Now <ChevronRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-2 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Direct From Brand</span>
        </div>
      </div>
    </div>
  );
};
