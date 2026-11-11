import React from 'react';
import { Settings, Shield, Database, CreditCard, CheckCircle2, Lock } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';

export const AdminSettingsPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-slate-900">
            System & Operations Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Architecture parameters, Nepal payment gateway integrations, and database synchronizations.
          </p>
        </div>

        {/* Database & Supabase Integration Panel */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-slate-900">
                Supabase PostgreSQL Configuration
              </h2>
              <span className="text-xs text-slate-400">Database & Row Level Security (RLS)</span>
            </div>
          </div>

          <div className="text-xs text-slate-600 leading-relaxed space-y-3">
            <p>
              CLEVARA includes production-ready SQL migration scripts in <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-800 font-mono">supabase/migrations/</code> containing full normalized tables, foreign keys, triggers, and Row Level Security policies.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-slate-700">
                <span>Database Engine:</span>
                <span className="font-mono font-bold text-emerald-800">PostgreSQL / Supabase Dual-Mode</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span>Row Level Security (RLS):</span>
                <span className="font-mono font-bold text-emerald-800">18 Policies Configured</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span>Concurrency Protection:</span>
                <span className="font-mono font-bold text-emerald-800">Atomic Stock Validation Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nepal Payment Gateways Architecture */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-slate-900">
                Nepal Payment Architecture (eSewa & COD)
              </h2>
              <span className="text-xs text-slate-400">HMAC-SHA256 Cryptographic Signature Verification</span>
            </div>
          </div>

          <div className="text-xs text-slate-600 leading-relaxed space-y-3">
            <p>
              In accordance with Section 12, digital payments are verified on the server using HMAC-SHA256 hashes generated from the official eSewa secret key. No transaction is accepted from frontend declarations alone.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-[11px]">
              <div className="flex items-center justify-between">
                <span>eSewa Merchant Code:</span>
                <span className="text-slate-900 font-bold">EPAYTEST (Test Environment Active)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Signature Standard:</span>
                <span className="text-slate-900 font-bold">HMAC-SHA256 Base64</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Cash on Delivery:</span>
                <span className="text-emerald-800 font-bold">Active Nationwide</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
