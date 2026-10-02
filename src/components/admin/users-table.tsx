// admin-panel/src/components/admin/users-table.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';
import { 
  ArrowUpDown, 
  MoreHorizontal, 
  Eye, 
  Edit3, 
  Trash2, 
  Search, 
  Filter,
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { User } from '@/lib/db/schema';
import { UserViewDrawer } from './user-view-drawer';
import { SoftDeleteModal } from './soft-delete-modal';
import { cn } from '@/lib/utils';

interface UsersTableProps {
  initialUsers: User[];
  onRefresh?: () => void;
}

export function UsersTable({ initialUsers, onRefresh }: UsersTableProps) {
  const [data, setData] = useState<User[]>(initialUsers);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleOpenDrawer = (user: User) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleOpenDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleSoftDelete = async (userId: string, reason: string) => {
    const res = await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, reason }),
    });

    if (res.ok) {
      setData((prev) => prev.filter((u) => u.id !== userId));
      if (onRefresh) onRefresh();
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex items-center gap-1 font-semibold text-xs text-foreground hover:text-primary transition-colors"
        >
          <span>Practitioner / User</span>
          <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
        </button>
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center space-x-3 py-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-xs text-foreground">{user.name}</div>
              <div className="text-[11px] text-muted-foreground font-mono">{user.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue('role') as string;
        const color = {
          SUPER_ADMIN: 'bg-amber-500/15 text-amber-500 border-amber-500/20',
          ADMIN: 'bg-purple-500/15 text-purple-500 border-purple-500/20',
          ADVOCATE: 'bg-blue-500/15 text-blue-500 border-blue-500/20',
          CLIENT: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
        }[role] || 'bg-secondary text-foreground';

        return (
          <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border font-mono", color)}>
            {role}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const color = {
          ACTIVE: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
          SUSPENDED: 'bg-destructive/10 text-destructive border-destructive/20',
          DEACTIVATED: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        }[status] || 'bg-secondary text-foreground';

        return (
          <span className={cn("px-2 py-0.5 rounded text-[10px] font-semibold border", color)}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: 'plan',
      header: 'Plan Tier',
      cell: ({ row }) => {
        const plan = row.getValue('plan') as string;
        return (
          <span className="font-mono text-xs font-semibold text-amber-500">
            {plan}
          </span>
        );
      },
    },
    {
      accessorKey: 'org',
      header: 'Organization',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground truncate max-w-[160px] block">
          {row.getValue('org') || '—'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => handleOpenDrawer(user)}
              className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              title="View Profile Details"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <Link
              href={`/admin/users/${user.id}/edit`}
              className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
              title="Edit User"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </Link>
            {user.role !== 'SUPER_ADMIN' && (
              <button
                onClick={() => handleOpenDelete(user)}
                className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                title="Soft Delete User"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  // Filtering data
  const filteredData = React.useMemo(() => {
    return data.filter((u) => {
      const matchesSearch =
        globalFilter === '' ||
        u.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        u.email.toLowerCase().includes(globalFilter.toLowerCase()) ||
        (u.org && u.org.toLowerCase().includes(globalFilter.toLowerCase()));

      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [data, globalFilter, roleFilter, statusFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 8 },
    },
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card border border-border p-3 rounded-xl shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or chamber..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full bg-secondary/50 border border-input rounded-md pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="flex items-center space-x-2">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-secondary/50 border border-input rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN">Admin</option>
            <option value="ADVOCATE">Advocate</option>
            <option value="CLIENT">Client</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-secondary/50 border border-input rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="DEACTIVATED">Deactivated</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-border bg-secondary/30">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-secondary/20 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-2.5 text-xs text-foreground align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-xs text-muted-foreground">
                    No users matching selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground bg-secondary/10">
          <span>
            Showing {table.getRowModel().rows.length} of {filteredData.length} users
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded border border-border hover:bg-secondary disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px]">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded border border-border hover:bg-secondary disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-over Profile Drawer */}
      <UserViewDrawer
        user={selectedUser}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Soft Delete Modal */}
      <SoftDeleteModal
        user={userToDelete}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleSoftDelete}
      />
    </div>
  );
}
