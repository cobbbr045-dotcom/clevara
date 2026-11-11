import React, { useState, useEffect } from 'react';
import { FileText, Save, CheckCircle2 } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { api } from '../../api/client.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminContentPage: React.FC = () => {
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementLink, setAnnouncementLink] = useState('/shop');
  
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroBanner, setHeroBanner] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    Promise.all([
      api.getContent('announcement_bar'),
      api.getContent('homepage_hero')
    ])
      .then(([annRes, heroRes]) => {
        if (annRes.success && annRes.content) {
          setAnnouncementTitle(annRes.content.title);
          setAnnouncementLink(annRes.content.content_json?.link || '/shop');
        }
        if (heroRes.success && heroRes.content) {
          setHeroTitle(heroRes.content.title);
          setHeroSubtitle(heroRes.content.subtitle || '');
          setHeroBanner(heroRes.content.content_json?.banner_image || '');
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.adminUpdateContent('announcement_bar', {
        title: announcementTitle,
        content_json: { badge: 'OFFICIAL STORE', link: announcementLink }
      });
      success('Top announcement bar content updated.');
    } catch (err: any) {
      error(err.message || 'Failed to update content.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.adminUpdateContent('homepage_hero', {
        title: heroTitle,
        subtitle: heroSubtitle,
        content_json: {
          banner_image: heroBanner,
          cta_primary: { text: 'Explore Collection', url: '/shop' },
          cta_secondary: { text: 'Our Standards', url: '/about' }
        }
      });
      success('Homepage Hero section updated.');
    } catch (err: any) {
      error(err.message || 'Failed to update hero.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-slate-900">
            Website Content Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Modify live storefront text, top announcement ribbons, and hero showcase media without code edits.
          </p>
        </div>

        {/* Announcement Bar Editor */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-display font-bold text-base text-slate-950">
              1. Top Announcement Bar
            </h2>
            <p className="text-xs text-slate-400">Displayed at the very top of all public pages.</p>
          </div>

          <form onSubmit={handleSaveAnnouncement} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Message Text *</label>
              <input
                type="text"
                required
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Link URL</label>
              <input
                type="text"
                value={announcementLink}
                onChange={(e) => setAnnouncementLink(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-slate-950 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors shadow-soft"
              >
                Save Announcement Bar
              </button>
            </div>
          </form>
        </div>

        {/* Hero Section Editor */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-display font-bold text-base text-slate-950">
              2. Homepage Hero Showcase
            </h2>
            <p className="text-xs text-slate-400">High-impact brand positioning headline and banner.</p>
          </div>

          <form onSubmit={handleSaveHero} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Main Heading *</label>
              <input
                type="text"
                required
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Subtitle Paragraph *</label>
              <textarea
                rows={3}
                required
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Featured Showcase Image URL</label>
              <input
                type="url"
                value={heroBanner}
                onChange={(e) => setHeroBanner(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-slate-950 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors shadow-soft"
              >
                Save Homepage Hero
              </button>
            </div>
          </form>
        </div>

      </div>
    </AdminLayout>
  );
};
