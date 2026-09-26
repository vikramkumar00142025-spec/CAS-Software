'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Receipt,
  ShoppingCart,
  Wallet,
  Boxes,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import {
  SalesInvoice,
  PurchaseInvoice,
  Payment,
  Expense,
  Product,
  Customer,
  Supplier,
  DeliveryChallan,
} from '@/types';
import { formatINR, formatNumber } from '@/lib/gst-calculator';

interface DashboardViewProps {
  invoices: SalesInvoice[];
  purchases: PurchaseInvoice[];
  payments: Payment[];
  expenses: Expense[];
  products: Product[];
  customers: Customer[];
  suppliers: Supplier[];
  challans: DeliveryChallan[];
  onNavigate: (tab: string) => void;
  onOpenCreateModal: (type: 'invoice' | 'challan' | 'purchase' | 'product') => void;
  onSelectInvoice: (invoice: SalesInvoice) => void;
}

type DateFilter = 'today' | 'yesterday' | 'this_week' | 'this_month' | 'last_month' | 'this_year';

export default function DashboardView({
  invoices,
  purchases,
  payments,
  expenses,
  products,
  customers,
  suppliers,
  challans,
  onNavigate,
  onOpenCreateModal,
  onSelectInvoice,
}: DashboardViewProps) {
  const [dateFilter, setDateFilter] = useState<DateFilter>('this_month');

  // Aggregated KPIs
  const stats = useMemo(() => {
    const totalSales = invoices
      .filter((i) => i.payment_status !== 'Cancelled')
      .reduce((acc, i) => acc + i.grand_total, 0);

    const totalPurchases = purchases
      .filter((p) => p.payment_status !== 'Cancelled')
      .reduce((acc, p) => acc + p.grand_total, 0);

    const totalReceivables = customers.reduce((acc, c) => acc + c.current_balance, 0);
    const totalPayables = suppliers.reduce((acc, s) => acc + s.current_balance, 0);

    const totalExpenses = expenses.reduce((acc, e) => acc + e.total_amount, 0);

    const totalCollections = payments
      .filter((p) => p.payment_type === 'Receipt')
      .reduce((acc, p) => acc + p.amount, 0);

    const stockValue = products.reduce((acc, p) => acc + p.current_stock * p.purchase_price, 0);
    const lowStockProducts = products.filter((p) => p.current_stock > 0 && p.current_stock <= p.min_stock);
    const outOfStockProducts = products.filter((p) => p.current_stock <= 0);

    const pendingInvoices = invoices.filter((i) => i.balance_due > 0 && i.payment_status !== 'Cancelled');
    const pendingChallans = challans.filter((c) => c.status === 'Pending');

    return {
      totalSales,
      totalPurchases,
      totalReceivables,
      totalPayables,
      totalExpenses,
      totalCollections,
      stockValue,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      pendingInvoicesCount: pendingInvoices.length,
      pendingChallansCount: pendingChallans.length,
    };
  }, [invoices, purchases, payments, expenses, products, customers, suppliers, challans]);

  // Top selling products
  const topProducts = useMemo(() => {
    const itemMap: Record<string, { name: string; quantity: number; totalSales: number; sku: string }> = {};

    invoices.forEach((inv) => {
      if (inv.payment_status === 'Cancelled') return;
      inv.items.forEach((item) => {
        if (!itemMap[item.product_id]) {
          const prod = products.find((p) => p.id === item.product_id);
          itemMap[item.product_id] = {
            name: item.product_name,
            quantity: 0,
            totalSales: 0,
            sku: prod?.sku || '',
          };
        }
        itemMap[item.product_id].quantity += item.quantity;
        itemMap[item.product_id].totalSales += item.total;
      });
    });

    return Object.values(itemMap)
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 5);
  }, [invoices, products]);

  // Monthly Sales Bar Visualization
  const monthlyData = [
    { month: 'Apr', sales: 124000, purchases: 98000 },
    { month: 'May', sales: 185000, purchases: 140000 },
    { month: 'Jun', sales: 210000, purchases: 165000 },
    { month: 'Jul', sales: 245000, purchases: 180000 },
    { month: 'Aug', sales: 310000, purchases: 220000 },
    { month: 'Sep', sales: stats.totalSales || 252520, purchases: stats.totalPurchases || 193520 },
  ];

  const maxVal = Math.max(...monthlyData.map((d) => Math.max(d.sales, d.purchases)));

  return (
    <div className="space-y-6">
      {/* Top Header with Date Filter & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Cloud Accounting System</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time accounting, stock movements & receivables summary</p>
        </div>

        {/* Date Filter Bar */}
        <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg shadow-xs overflow-x-auto">
          {[
            { id: 'today', label: 'Today' },
            { id: 'this_week', label: 'This Week' },
            { id: 'this_month', label: 'This Month' },
            { id: 'last_month', label: 'Last Month' },
            { id: 'this_year', label: 'FY 2026-27' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDateFilter(tab.id as DateFilter)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                dateFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Row 1: High Level Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Gross Sales Revenue</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Receipt className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {formatINR(stats.totalSales)}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-600 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% vs last period</span>
            </div>
          </div>
        </div>

        {/* Total Collections */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Collections (Received)</span>
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {formatINR(stats.totalCollections)}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500 font-medium">
              <span>{invoices.filter((i) => i.payment_status === 'Paid').length} invoices fully cleared</span>
            </div>
          </div>
        </div>

        {/* Total Customer Receivables */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Outstanding Receivables</span>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight text-amber-600 font-mono tabular-nums">
              {formatINR(stats.totalReceivables)}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500 font-medium">
              <span>{stats.pendingInvoicesCount} invoices pending payment</span>
            </div>
          </div>
        </div>

        {/* Total Stock Value */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Stock Valuation</span>
            <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Boxes className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {formatINR(stats.stockValue)}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500 font-medium">
              <span>Across {products.length} active SKUs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Secondary Operational Alert Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => onNavigate('inventory-transactions')}
          className="p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 cursor-pointer transition-colors shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Low Stock Alert</span>
            {stats.lowStockCount > 0 && <span className="w-2 h-2 rounded-full bg-amber-500" />}
          </div>
          <p className="mt-1 text-lg font-bold font-mono text-amber-600 tabular-nums">{stats.lowStockCount} items</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Below reorder point</p>
        </div>

        <div
          onClick={() => onNavigate('purchases')}
          className="p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 cursor-pointer transition-colors shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Supplier Payables</span>
            <ShoppingCart className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <p className="mt-1 text-lg font-bold font-mono text-slate-900 tabular-nums">
            {formatINR(stats.totalPayables)}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">{suppliers.length} active vendors</p>
        </div>

        <div
          onClick={() => onNavigate('expenses')}
          className="p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 cursor-pointer transition-colors shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Operating Expenses</span>
            <Wallet className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <p className="mt-1 text-lg font-bold font-mono text-slate-900 tabular-nums">
            {formatINR(stats.totalExpenses)}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">{expenses.length} expense entries</p>
        </div>

        <div
          onClick={() => onNavigate('challans')}
          className="p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 cursor-pointer transition-colors shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Open Challans</span>
            <span className="text-[11px] font-mono text-blue-600 font-semibold">{stats.pendingChallansCount}</span>
          </div>
          <p className="mt-1 text-lg font-bold font-mono text-slate-900 tabular-nums">
            {stats.pendingChallansCount} Pending
          </p>
          <p className="text-[10px] text-blue-600 hover:underline mt-0.5 font-medium">Ready to convert</p>
        </div>
      </div>

      {/* Row 3: Sales Trends Chart & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales vs Purchases Performance */}
        <div className="lg:col-span-2 p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Revenue & Inward Trend (FY 2026-27)</h2>
              <p className="text-xs text-slate-500">Monthly billing vs procurement volume comparison</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-slate-900" />
                <span className="text-slate-600 font-medium">Sales</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-blue-300" />
                <span className="text-slate-600 font-medium">Purchases</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-56 flex items-end justify-between gap-4 pt-6 pb-2 border-b border-slate-100">
            {monthlyData.map((d) => {
              const salesPct = Math.round((d.sales / maxVal) * 100);
              const purchasesPct = Math.round((d.purchases / maxVal) * 100);
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-full">
                    {/* Sales Bar */}
                    <div
                      style={{ height: `${salesPct}%` }}
                      className="w-4 sm:w-6 bg-slate-900 rounded-t-xs hover:bg-slate-800 transition-all relative group-hover:shadow-md"
                      title={`Sales: ${formatINR(d.sales)}`}
                    />
                    {/* Purchases Bar */}
                    <div
                      style={{ height: `${purchasesPct}%` }}
                      className="w-4 sm:w-6 bg-blue-300 rounded-t-xs hover:bg-blue-400 transition-all"
                      title={`Purchases: ${formatINR(d.purchases)}`}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-500">{d.month}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-3 text-xs text-slate-500">
            <span>GST Output Tax Accrued: <strong className="text-slate-900 font-mono">{formatINR(stats.totalSales * 0.18)}</strong></span>
            <button
              onClick={() => onNavigate('reports')}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              <span>View Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Top Performing Items */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Top Moving Inventory</h2>
              <p className="text-xs text-slate-500">Ranked by gross sales volume</p>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              All Items
            </button>
          </div>

          <div className="space-y-3.5">
            {topProducts.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="min-w-0 pr-2">
                  <p className="font-semibold text-slate-900 truncate">{p.name}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{p.sku} · {p.quantity} units dispatched</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono font-bold text-slate-900 tabular-nums">{formatINR(p.totalSales)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Recent Invoices & Direct Shortcuts */}
      <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent Sales Invoices</h2>
            <p className="text-xs text-slate-500">Latest confirmed GST bills and payment statuses</p>
          </div>
          <button
            onClick={() => onNavigate('invoices')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View All Invoices</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold">
                <th className="py-2.5 px-3">Invoice #</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3 text-right">Taxable</th>
                <th className="py-2.5 px-3 text-right">Grand Total</th>
                <th className="py-2.5 px-3 text-right">Due Balance</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.slice(0, 5).map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900 font-mono">{inv.invoice_number}</td>
                  <td className="py-3 px-3 text-slate-600">{inv.invoice_date}</td>
                  <td className="py-3 px-3 font-medium text-slate-900">{inv.customer_name}</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-600 tabular-nums">
                    {formatINR(inv.taxable_amount)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                    {formatINR(inv.grand_total)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-700 tabular-nums">
                    {inv.balance_due > 0 ? (
                      <span className="text-amber-600 font-semibold">{formatINR(inv.balance_due)}</span>
                    ) : (
                      <span className="text-slate-400">₹0.00</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        inv.payment_status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inv.payment_status === 'Partially Paid'
                          ? 'bg-amber-100 text-amber-800'
                          : inv.payment_status === 'Cancelled'
                          ? 'bg-slate-100 text-slate-600 line-through'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {inv.payment_status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onSelectInvoice(inv)}
                      className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                    >
                      View / Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
