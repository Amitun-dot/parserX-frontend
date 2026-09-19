'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context/auth-context';
import { useToast } from '@/lib/context/toast-context';
import { getErrorMessage } from '@/lib/api/errors';
import { ScanLine, Mail, Calendar, LogOut, Loader2, User as UserIcon } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } catch (err) {
      toast(getErrorMessage(err), 'error');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Profile</h1>
          <p className="mt-1 text-sm text-gray-500">Your account information.</p>
        </div>

        {/* Profile card */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-2xl font-bold text-gray-600">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{user?.email || 'User'}</h2>
              <p className="text-sm text-gray-400">ParserX Account</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Account Details</h3>
          <div className="space-y-4">
            <DetailRow
              icon={<UserIcon className="h-4 w-4 text-gray-400" />}
              label="User ID"
              value={user?.id != null ? String(user.id) : '—'}
            />
            <DetailRow
              icon={<Mail className="h-4 w-4 text-gray-400" />}
              label="Email"
              value={user?.email || '—'}
            />
            <DetailRow
              icon={<Calendar className="h-4 w-4 text-gray-400" />}
              label="Member since"
              value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Account Actions</h3>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            Log out
          </button>
        </div>

        {/* Branding */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gray-900">
            <ScanLine className="h-3.5 w-3.5 text-white" />
          </div>
          ParserX — AI-powered resume analysis
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}
