'use client';

import React, { useState } from 'react';
import { Building, Save, CheckCircle2, ShieldCheck } from 'lucide-react';
import { CompanyProfile } from '@/types';

interface CompanySettingsViewProps {
  company: CompanyProfile;
  onUpdateCompany: (updated: Partial<CompanyProfile>) => void;
}

export default function CompanySettingsView({
  company,
  onUpdateCompany,
}: CompanySettingsViewProps) {
  const [formData, setFormData] = useState<CompanyProfile>(company);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCompany(formData);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Company Profile & GST Configuration</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure legal business information, statutory tax identifiers, bank accounts and prefix sequencing
          </p>
        </div>

        {savedNotice && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-md text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Section 1: Business Identity */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-2 border-slate-100">
            1. Commercial Identity & Registered Address
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Display Brand Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 font-medium"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Legal Corporate Entity Name *</label>
              <input
                type="text"
                value={formData.legal_name}
                onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Registered Office Address *</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">City *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">State *</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 font-medium"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">GST State Code *</label>
              <input
                type="text"
                value={formData.state_code}
                onChange={(e) => setFormData({ ...formData, state_code: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 font-mono"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">PIN Code *</label>
              <input
                type="text"
                value={formData.pin_code}
                onChange={(e) => setFormData({ ...formData, pin_code: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Primary Phone *</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Billing Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Corporate Website</label>
              <input
                type="text"
                value={formData.website || ''}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Statutory Tax Identifiers */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-2 border-slate-100">
            2. Statutory Tax & Regulatory Identifiers
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">GSTIN (15 Digits) *</label>
              <input
                type="text"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 font-mono uppercase font-bold"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Income Tax PAN *</label>
              <input
                type="text"
                value={formData.pan}
                onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 font-mono uppercase"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Corporate CIN (Optional)</label>
              <input
                type="text"
                value={formData.cin || ''}
                onChange={(e) => setFormData({ ...formData, cin: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 font-mono uppercase"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Banking Remittance Details */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-2 border-slate-100">
            3. Remittance Bank Details (Printed on Invoices)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Bank Name *</label>
              <input
                type="text"
                value={formData.bank_name}
                onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Current Account Number *</label>
              <input
                type="text"
                value={formData.account_number}
                onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 font-mono font-bold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">IFSC Code *</label>
              <input
                type="text"
                value={formData.ifsc}
                onChange={(e) => setFormData({ ...formData, ifsc: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 font-mono uppercase"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Bank Branch *</label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
                required
              />
            </div>
          </div>

          {/* UPI VPA & Merchant Settings for Dynamic QR */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <span>⚡ Dynamic UPI QR Settings</span>
              <span className="text-[10px] font-normal text-slate-500 normal-case">(Used for customer scan-to-pay QR generation)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">UPI ID / VPA *</label>
                <input
                  type="text"
                  placeholder="e.g. yourbusiness@hdfcbank"
                  value={formData.upi_id || ''}
                  onChange={(e) => setFormData({ ...formData, upi_id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">UPI Payee Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Zenith Apex Technologies"
                  value={formData.upi_payee_name || ''}
                  onChange={(e) => setFormData({ ...formData, upi_payee_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Merchant Category Code (MCC)</label>
                <input
                  type="text"
                  placeholder="e.g. 5411"
                  value={formData.merchant_code || ''}
                  onChange={(e) => setFormData({ ...formData, merchant_code: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Document Prefixes & Accounting Controls */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-2 border-slate-100">
            4. Document Numbering & Stock Invariant Controls
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Tax Invoice Prefix</label>
              <input
                type="text"
                value={formData.invoice_prefix}
                onChange={(e) => setFormData({ ...formData, invoice_prefix: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Delivery Challan Prefix</label>
              <input
                type="text"
                value={formData.challan_prefix}
                onChange={(e) => setFormData({ ...formData, challan_prefix: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Purchase PO Prefix</label>
              <input
                type="text"
                value={formData.purchase_prefix}
                onChange={(e) => setFormData({ ...formData, purchase_prefix: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900">Allow Negative Inventory Dispatch</p>
              <p className="text-slate-500 text-[11px]">
                When disabled, the ERP will strictly prevent generating invoices or stock issues if physical stock is insufficient.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allow_negative_inventory}
                onChange={(e) => setFormData({ ...formData, allow_negative_inventory: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Company Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
