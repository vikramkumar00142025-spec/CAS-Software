'use client';

import React, { useState } from 'react';
import { ShieldCheck, Plus, Check, X, ShieldAlert, User, Key } from 'lucide-react';
import { UserProfile, UserRole, Permission } from '@/types';
import { getDefaultPermissionsForRole } from '@/lib/storage';

interface UserManagementViewProps {
  users: UserProfile[];
  currentUser: UserProfile;
  onSaveUser: (userData: Partial<UserProfile> & { email: string; full_name: string; role: UserRole }) => void;
  onToggleUserStatus: (userId: string) => void;
}

export default function UserManagementView({
  users,
  currentUser,
  onSaveUser,
  onToggleUserStatus,
}: UserManagementViewProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('Sales Staff');
  const [phone, setPhone] = useState('');
  const [permissions, setPermissions] = useState<Permission[]>(getDefaultPermissionsForRole('Sales Staff'));

  const allAvailablePermissions: { key: Permission; label: string; group: string }[] = [
    { key: 'view_sales', label: 'View Sales & Invoices', group: 'Sales' },
    { key: 'create_sales', label: 'Create Sales Invoices', group: 'Sales' },
    { key: 'edit_sales', label: 'Edit Sales Invoices', group: 'Sales' },
    { key: 'delete_sales', label: 'Cancel/Delete Invoices', group: 'Sales' },
    { key: 'manage_challans', label: 'Create & Manage Challans', group: 'Sales' },

    { key: 'view_purchases', label: 'View Purchase Bills', group: 'Purchases' },
    { key: 'create_purchases', label: 'Create Purchase Invoices', group: 'Purchases' },
    { key: 'edit_purchases', label: 'Edit Purchases', group: 'Purchases' },
    { key: 'delete_purchases', label: 'Cancel Purchases', group: 'Purchases' },

    { key: 'view_products', label: 'View Catalog & Inventory', group: 'Inventory' },
    { key: 'create_products', label: 'Add New Products', group: 'Inventory' },
    { key: 'edit_products', label: 'Edit Product Details', group: 'Inventory' },
    { key: 'manage_inventory', label: 'Adjust & Transfer Stock', group: 'Inventory' },

    { key: 'view_customers', label: 'View Customers', group: 'Parties' },
    { key: 'create_customers', label: 'Create Customers', group: 'Parties' },
    { key: 'view_suppliers', label: 'View Suppliers', group: 'Parties' },
    { key: 'create_suppliers', label: 'Create Suppliers', group: 'Parties' },

    { key: 'manage_payments', label: 'Record Receipts & Payments', group: 'Finance' },
    { key: 'manage_expenses', label: 'Manage Expenses', group: 'Finance' },
    { key: 'view_reports', label: 'Access Business Reports', group: 'Reports' },

    { key: 'manage_users', label: 'Manage Users & RBAC', group: 'Admin' },
    { key: 'manage_settings', label: 'Company & Tax Settings', group: 'Admin' },
  ];

  const handleOpenAdd = () => {
    setEditingUser(null);
    setEmail('');
    setFullName('');
    setRole('Sales Staff');
    setPhone('');
    setPermissions(getDefaultPermissionsForRole('Sales Staff'));
    setShowModal(true);
  };

  const handleOpenEdit = (user: UserProfile) => {
    setEditingUser(user);
    setEmail(user.email);
    setFullName(user.full_name);
    setRole(user.role);
    setPhone(user.phone || '');
    setPermissions(user.permissions);
    setShowModal(true);
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setPermissions(getDefaultPermissionsForRole(newRole));
  };

  const togglePermission = (perm: Permission) => {
    if (permissions.includes(perm)) {
      setPermissions(permissions.filter((p) => p !== perm));
    } else {
      setPermissions([...permissions, perm]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !fullName.trim()) return;

    onSaveUser({
      id: editingUser ? editingUser.id : undefined,
      email: email.trim(),
      full_name: fullName.trim(),
      role,
      phone: phone.trim(),
      permissions,
    });

    setShowModal(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">User Management & Role-Based Access Control</h1>
          <p className="text-xs text-slate-500 mt-0.5">Control employee roles, access privileges and account security policies</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Employee User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-semibold">
                <th className="py-3 px-3">User / Full Name</th>
                <th className="py-3 px-3">Email Address</th>
                <th className="py-3 px-3">Assigned Role</th>
                <th className="py-3 px-3">Permissions Granted</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                        {u.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{u.full_name}</p>
                        {u.phone && <p className="text-[10px] text-slate-400">{u.phone}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-mono">{u.email}</td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full text-[11px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                    {u.permissions.length} granular permissions
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        u.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {u.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(u)}
                      className="px-2.5 py-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded text-xs font-medium transition-colors"
                    >
                      Edit Privileges
                    </button>
                    {u.id !== currentUser.id && (
                      <button
                        onClick={() => onToggleUserStatus(u.id)}
                        className="px-2 py-1 text-slate-500 hover:text-slate-700 text-xs"
                      >
                        {u.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-xs max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingUser ? `Edit Privileges: ${editingUser.full_name}` : 'Create New User & Assign Permissions'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Full Employee Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 font-medium"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Official Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Assign Role *</label>
                  <select
                    value={role}
                    onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 font-bold"
                  >
                    <option value="Super Admin">Super Admin (Full Root Access)</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Sales Staff">Sales Staff</option>
                    <option value="Purchase Staff">Purchase Staff</option>
                    <option value="Inventory Staff">Inventory Staff</option>
                    <option value="Viewer">Viewer (Read Only)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900"
                  />
                </div>
              </div>

              {/* Granular Permissions Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="font-bold text-slate-800 block text-xs">
                  Granular Permissions ({permissions.length} granted)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  {allAvailablePermissions.map((perm) => (
                    <label
                      key={perm.key}
                      className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200 cursor-pointer hover:bg-slate-100/60"
                    >
                      <input
                        type="checkbox"
                        checked={permissions.includes(perm.key)}
                        onChange={() => togglePermission(perm.key)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-[11px] text-slate-700 font-medium">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800"
                >
                  Save User Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
