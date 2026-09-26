'use client';

import React, { useState, useMemo } from 'react';
import {
  Boxes,
  Plus,
  Search,
  Download,
  Upload,
  Filter,
  SlidersHorizontal,
  ArrowRightLeft,
  Trash2,
  AlertTriangle,
  Tag,
  Barcode,
} from 'lucide-react';
import { Product, Warehouse } from '@/types';
import { formatINR } from '@/lib/gst-calculator';

interface ProductListViewProps {
  products: Product[];
  warehouses: Warehouse[];
  onOpenCreateModal: () => void;
  onOpenAdjustmentModal: (product: Product) => void;
  onOpenTransferModal: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

export default function ProductListView({
  products,
  warehouses,
  onOpenCreateModal,
  onOpenAdjustmentModal,
  onOpenTransferModal,
  onDeleteProduct,
}: ProductListViewProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return ['ALL', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        (p.barcode && p.barcode.includes(search)) ||
        p.hsn_sac_code.includes(search);

      const matchCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
      const matchLowStock = !lowStockOnly || p.current_stock <= p.min_stock;

      return matchSearch && matchCategory && matchLowStock;
    });
  }, [products, search, categoryFilter, lowStockOnly]);

  const totalValue = filteredProducts.reduce((acc, p) => acc + p.current_stock * p.purchase_price, 0);
  const lowStockCount = products.filter((p) => p.current_stock <= p.min_stock).length;

  const exportCSV = () => {
    const headers = [
      'SKU',
      'Name',
      'Category',
      'HSN/SAC',
      'Unit',
      'Purchase Price',
      'Selling Price',
      'MRP',
      'GST %',
      'Current Stock',
      'Min Stock',
      'Stock Value',
    ];
    const rows = filteredProducts.map((p) => [
      p.sku,
      `"${p.name}"`,
      `"${p.category}"`,
      p.hsn_sac_code,
      p.unit,
      p.purchase_price,
      p.selling_price,
      p.mrp,
      p.gst_rate,
      p.current_stock,
      p.min_stock,
      (p.current_stock * p.purchase_price).toFixed(2),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inventory_catalog_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Inventory Catalog & Stock Control</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage product master, prices, multi-warehouse stock levels and reorder limits</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item / SKU</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500">Total Active SKUs</span>
          <p className="text-xl font-bold text-slate-900 font-mono mt-1">{filteredProducts.length}</p>
        </div>
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500">Total Inventory Valuation</span>
          <p className="text-xl font-bold text-slate-900 font-mono mt-1 tabular-nums">{formatINR(totalValue)}</p>
        </div>
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500">Low Stock Reorder Alerts</span>
          <p className="text-xl font-bold text-amber-600 font-mono mt-1 tabular-nums">{lowStockCount} SKUs</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, SKU, barcode, HSN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md outline-hidden text-slate-900 placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md text-slate-800"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'ALL' ? 'All Categories' : c}
              </option>
            ))}
          </select>

          {/* Low Stock Toggle */}
          <button
            onClick={() => setLowStockOnly(!lowStockOnly)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              lowStockOnly
                ? 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Low Stock Only ({lowStockCount})
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-semibold">
                <th className="py-3 px-3">Item / SKU</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-center">HSN/SAC</th>
                <th className="py-3 px-3 text-right">Purchase (₹)</th>
                <th className="py-3 px-3 text-right">Selling Price (₹)</th>
                <th className="py-3 px-3 text-center">GST %</th>
                <th className="py-3 px-3 text-center">Stock Level</th>
                <th className="py-3 px-3 text-right">Stock Value (₹)</th>
                <th className="py-3 px-3 text-right">Stock Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No products found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isLow = p.current_stock <= p.min_stock;
                  const isOut = p.current_stock <= 0;
                  const value = p.current_stock * p.purchase_price;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-900 block">{p.name}</span>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500 font-mono">
                          <span>SKU: {p.sku}</span>
                          {p.barcode && <span>· Barcode: {p.barcode}</span>}
                          {p.rack && <span>· Rack: {p.rack}</span>}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{p.category}</td>
                      <td className="py-3 px-3 text-center font-mono text-slate-600">{p.hsn_sac_code}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-600 tabular-nums">
                        {formatINR(p.purchase_price)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                        {formatINR(p.selling_price)}
                      </td>
                      <td className="py-3 px-3 text-center font-mono">{p.gst_rate}%</td>
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-1.5 font-mono">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isOut
                                ? 'bg-red-100 text-red-800'
                                : isLow
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {p.current_stock} {p.unit}
                          </span>
                        </div>
                        {isLow && (
                          <span className="block text-[10px] text-amber-600 font-semibold mt-0.5">
                            Min: {p.min_stock}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-slate-900 tabular-nums">
                        {formatINR(value)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onOpenAdjustmentModal(p)}
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="Adjust Physical Stock"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenTransferModal(p)}
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                            title="Transfer Stock to Another Warehouse"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete product "${p.name}"?`)) {
                                onDeleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
