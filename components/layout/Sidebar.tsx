'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Receipt,
  Truck,
  ShoppingCart,
  Boxes,
  Users,
  Building2,
  CreditCard,
  Wallet,
  BookOpen,
  BarChart3,
  ShieldCheck,
  Building,
  ScrollText,
  Database,
  ChevronDown,
  ChevronRight,
  Package,
  RotateCcw,
  ArrowRightLeft,
  SlidersHorizontal,
  FileText,
  Cloud,
  Warehouse as WarehouseIcon,
} from 'lucide-react';
import { UserProfile, UserRole } from '@/types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openCreateModal: (type: 'invoice' | 'challan' | 'purchase' | 'product') => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentUser,
  isOpen,
  setIsOpen,
  openCreateModal,
}: SidebarProps) {
  const [salesOpen, setSalesOpen] = useState(true);
  const [inventoryOpen, setInventoryOpen] = useState(true);
  const [purchasesOpen, setPurchasesOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(true);

  const canAccess = (perm: string): boolean => {
    if (currentUser.role === 'Super Admin' || currentUser.role === 'Admin') return true;
    return currentUser.permissions.includes(perm as any);
  };

  const navItemClass = (tab: string) =>
    `flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
      activeTab === tab
        ? 'bg-slate-900 text-white font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  const subNavItemClass = (tab: string) =>
    `flex items-center gap-2 pl-8 pr-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
      activeTab === tab
        ? 'bg-slate-100 text-slate-900 font-semibold'
        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
    }`;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Zone */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-base shadow-xs">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold tracking-tight text-slate-900 block leading-tight">Cloud Accounting System</span>
              <p className="text-[10px] text-slate-500 font-medium">Enterprise Edition</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 lg:hidden"
          >
            ✕
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="p-3 border-b border-slate-100">
          <button
            onClick={() => openCreateModal('invoice')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-xs"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Create New Invoice</span>
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {/* Main Dashboard */}
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setIsOpen(false);
            }}
            className={`w-full ${navItemClass('dashboard')}`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Main Dashboard</span>
          </button>

          {/* Sales & Billing */}
          {canAccess('view_sales') && (
            <div>
              <button
                onClick={() => setSalesOpen(!salesOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900"
              >
                <div className="flex items-center gap-3">
                  <Receipt className="w-4 h-4 shrink-0 text-slate-500" />
                  <span>Sales & Billing</span>
                </div>
                {salesOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
              {salesOpen && (
                <div className="space-y-0.5 mt-0.5">
                  <button
                    onClick={() => {
                      setActiveTab('invoices');
                      setIsOpen(false);
                    }}
                    className={`w-full ${subNavItemClass('invoices')}`}
                  >
                    <span>Tax Invoices</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('challans');
                      setIsOpen(false);
                    }}
                    className={`w-full ${subNavItemClass('challans')}`}
                  >
                    <span>Delivery Challans</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('sales-returns');
                      setIsOpen(false);
                    }}
                    className={`w-full ${subNavItemClass('sales-returns')}`}
                  >
                    <span>Sales Returns (Credit Notes)</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Purchases */}
          {canAccess('view_purchases') && (
            <div>
              <button
                onClick={() => setPurchasesOpen(!purchasesOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-4 h-4 shrink-0 text-slate-500" />
                  <span>Purchases</span>
                </div>
                {purchasesOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
              {purchasesOpen && (
                <div className="space-y-0.5 mt-0.5">
                  <button
                    onClick={() => {
                      setActiveTab('purchases');
                      setIsOpen(false);
                    }}
                    className={`w-full ${subNavItemClass('purchases')}`}
                  >
                    <span>Purchase Invoices</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('purchase-returns');
                      setIsOpen(false);
                    }}
                    className={`w-full ${subNavItemClass('purchase-returns')}`}
                  >
                    <span>Purchase Returns (Debit Notes)</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Inventory & Stock */}
          {canAccess('view_products') && (
            <div>
              <button
                onClick={() => setInventoryOpen(!inventoryOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900"
              >
                <div className="flex items-center gap-3">
                  <Boxes className="w-4 h-4 shrink-0 text-slate-500" />
                  <span>Inventory & Stock</span>
                </div>
                {inventoryOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
              {inventoryOpen && (
                <div className="space-y-0.5 mt-0.5">
                  <button
                    onClick={() => {
                      setActiveTab('products');
                      setIsOpen(false);
                    }}
                    className={`w-full ${subNavItemClass('products')}`}
                  >
                    <span>Items & Catalog</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('inventory-transactions');
                      setIsOpen(false);
                    }}
                    className={`w-full ${subNavItemClass('inventory-transactions')}`}
                  >
                    <span>Stock Movement Ledger</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('warehouses');
                      setIsOpen(false);
                    }}
                    className={`w-full ${subNavItemClass('warehouses')}`}
                  >
                    <span>Warehouses</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Customers & Suppliers */}
          <div className="pt-2">
            <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Parties</p>
            {canAccess('view_customers') && (
              <button
                onClick={() => {
                  setActiveTab('customers');
                  setIsOpen(false);
                }}
                className={`w-full ${navItemClass('customers')}`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>Customers</span>
              </button>
            )}
            {canAccess('view_suppliers') && (
              <button
                onClick={() => {
                  setActiveTab('suppliers');
                  setIsOpen(false);
                }}
                className={`w-full ${navItemClass('suppliers')}`}
              >
                <Building2 className="w-4 h-4 shrink-0" />
                <span>Suppliers</span>
              </button>
            )}
          </div>

          {/* Finance & Accounts */}
          <div className="pt-2">
            <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Finance</p>
            <button
              onClick={() => {
                setActiveTab('payments');
                setIsOpen(false);
              }}
              className={`w-full ${navItemClass('payments')}`}
            >
              <CreditCard className="w-4 h-4 shrink-0" />
              <span>Payments & Receipts</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('expenses');
                setIsOpen(false);
              }}
              className={`w-full ${navItemClass('expenses')}`}
            >
              <Wallet className="w-4 h-4 shrink-0" />
              <span>Expenses</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('accounting');
                setIsOpen(false);
              }}
              className={`w-full ${navItemClass('accounting')}`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Account Ledgers</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('reports');
                setIsOpen(false);
              }}
              className={`w-full ${navItemClass('reports')}`}
            >
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span>Reports & Analytics</span>
            </button>
          </div>

          {/* Administration & Configuration */}
          <div className="pt-2">
            <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Administration</p>
            {canAccess('manage_users') && (
              <button
                onClick={() => {
                  setActiveTab('users');
                  setIsOpen(false);
                }}
                className={`w-full ${navItemClass('users')}`}
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>User Management & RBAC</span>
              </button>
            )}
            <button
              onClick={() => {
                setActiveTab('company-settings');
                setIsOpen(false);
              }}
              className={`w-full ${navItemClass('company-settings')}`}
            >
              <Building className="w-4 h-4 shrink-0" />
              <span>Company & GST Settings</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('database');
                setIsOpen(false);
              }}
              className={`w-full ${navItemClass('database')}`}
            >
              <Database className="w-4 h-4 shrink-0" />
              <span>Supabase & SQL Migration</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('audit-logs');
                setIsOpen(false);
              }}
              className={`w-full ${navItemClass('audit-logs')}`}
            >
              <ScrollText className="w-4 h-4 shrink-0" />
              <span>Audit Trail</span>
            </button>
          </div>
        </nav>

        {/* Current Active User Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold">
              {currentUser.full_name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">{currentUser.full_name}</p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className="font-medium text-blue-600">{currentUser.role}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
