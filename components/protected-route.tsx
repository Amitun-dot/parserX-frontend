'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { getToken } from '@/lib/api/axios';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, initialized } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!initialized) return;

    const token = getToken();
    if (!token || !user) {
      router.replace('/login');
    } else {
      setChecked(true);
    }
  }, [initialized, user, router]);

  if (!initialized || !checked) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gray-800" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
