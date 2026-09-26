'use client';

import React, { useState } from 'react';
import { X, Boxes, AlertCircle } from 'lucide-react';
import { Product, Warehouse } from '@/types';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  warehouses: Warehouse[];
  onSaveProduct: (product: Partial<Product> & { name: string; sku: string; category: string; selling_price: number }) => void;
}

export default function CreateProductModal({
  isOpen,
  onClose,
  warehouses,
  onSaveProduct,
}: CreateProductModalProps) {
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Server Hardware');
  const [subcategory, setSubcategory] = useState('');
  const [brand, setBrand] = useState('Zenith Industrial');
  const [hsnCode, setHsnCode] = useState('84715000');
  const [barcode, setBarcode] = useState('');
  const [unit, setUnit] = useState('Units');
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [mrp, setMrp] = useState<number>(0);
  const [gstRate, setGstRate] = useState<number>(18);
  const [openingStock, setOpeningStock] = useState<number>(10);
  const [minStock, setMinStock] = useState<number>(5);
  const [maxStock, setMaxStock] = useState<number>(200);
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id || 'wh-1');
  const [rack, setRack] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) return;

    onSaveProduct({
      sku: sku.trim().toUpperCase(),
      name: name.trim(),
      description: description.trim(),
      category,
      subcategory: subcategory.trim(),
      brand: brand.trim(),
      hsn_sac_code: hsnCode.trim(),
      barcode: barcode.trim() || undefined,
      unit,
      purchase_price: purchasePrice,
      selling_price: sellingPrice,
      mrp: mrp || sellingPrice,
      discount_percent: 0,
      gst_rate: gstRate,
      opening_stock: openingStock,
      min_stock: minStock,
      max_stock: maxStock,
      warehouse_id: warehouseId,
      rack: rack.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <Boxes className="w-5 h-5 text-amber-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Add New Product / Inventory Item</h2>
              <p className="text-xs text-slate-500">Configure SKU, pricing, GST tax slab & stock reorder levels</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Identifiers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">SKU / Item Code *</label>
              <input
                type="text"
                placeholder="e.g. ZEN-SVR-01"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono uppercase text-slate-900"
                required
              />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-slate-700">Product / Item Name *</label>
              <input
                type="text"
                placeholder="e.g. Managed 24-Port Gigabit Switch"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 font-medium"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Technical specs, dimensions, packaging details..."
              className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-slate-800"
            />
          </div>

          {/* Classification & Taxation */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-900"
              >
                <option value="Server Hardware">Server Hardware</option>
                <option value="Networking">Networking</option>
                <option value="Memory & Storage">Memory & Storage</option>
                <option value="Power Management">Power Management</option>
                <option value="Cabling & SAN">Cabling & SAN</option>
                <option value="Industrial Spares">Industrial Spares</option>
                <option value="Office Equipment">Office Equipment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">HSN/SAC Code *</label>
              <input
                type="text"
                value={hsnCode}
                onChange={(e) => setHsnCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono text-slate-900"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">GST Slab Rate *</label>
              <select
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-900 font-mono"
              >
                <option value={0}>0% (Exempt)</option>
                <option value={5}>5%</option>
                <option value={12}>12%</option>
                <option value={18}>18% (Standard)</option>
                <option value={28}>28%</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Unit of Measurement</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-900"
              >
                <option value="Units">Units (Pcs)</option>
                <option value="Rolls">Rolls</option>
                <option value="Meters">Meters</option>
                <option value="Boxes">Boxes</option>
                <option value="Kgs">Kgs</option>
                <option value="Sets">Sets</option>
              </select>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Purchase Price (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value) || 0)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white font-mono text-slate-900 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Selling Price (₹) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value) || 0)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white font-mono text-slate-900 font-bold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">MRP (Max Retail) (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={mrp}
                onChange={(e) => setMrp(Number(e.target.value) || 0)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white font-mono text-slate-900"
              />
            </div>
          </div>

          {/* Stock Levels */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Initial Opening Stock</label>
              <input
                type="number"
                min="0"
                value={openingStock}
                onChange={(e) => setOpeningStock(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono text-slate-900 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Min Reorder Level</label>
              <input
                type="number"
                min="0"
                value={minStock}
                onChange={(e) => setMinStock(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Default Warehouse</label>
              <select
                value={warehouseId}
                onChange={(e) => setWarehouseId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-900"
              >
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Rack / Shelf Location</label>
              <input
                type="text"
                placeholder="e.g. Bay-04-A"
                value={rack}
                onChange={(e) => setRack(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs"
            >
              Save Product to Catalog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
