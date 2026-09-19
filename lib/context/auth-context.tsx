'use client';

import React, {
createContext,
useContext,
useState,
useEffect,
useCallback,
} from 'react';

import { useRouter } from 'next/navigation';

import {
getToken,
getUser,
setAuth,
clearAuth,
setUnauthorizedHandler,
reset401Guard,
} from '@/lib/api/axios';

import * as authApi from '@/lib/api/auth.api';

import type {
User,
LoginRequest,
RegisterRequest,
} from '@/lib/types';

interface AuthContextValue {
user: User | null;
loading: boolean;
initialized: boolean;
login: (data: LoginRequest) => Promise<void>;
register: (data: RegisterRequest) => Promise<void>;
logout: () => Promise<void>;
}

const AuthContext =
createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({
children,
}: {
children: React.ReactNode;
}) {
const router = useRouter();

const [user, setUser] =
useState<User | null>(null);

const [loading, setLoading] =
useState(false);

const [initialized, setInitialized] =
useState(false);

const handleUnauthorized = useCallback(() => {
setUser(null);
reset401Guard();
}, []);

useEffect(() => {
setUnauthorizedHandler(handleUnauthorized);
}, [handleUnauthorized]);

// Restore session on mount
useEffect(() => {
const token = getToken();
const storedUser = getUser();


if (!token) {
  setInitialized(true);
  return;
}

// Optimistically restore user from localStorage
if (storedUser) {
  setUser(storedUser);
}

// Verify token and user with backend
authApi
  .getCurrentUser()
  .then((currentUser) => {
    setUser(currentUser);
    setAuth(token, currentUser);
  })
  .catch((error) => {
    const status =
      error?.response?.status;

    /*
     * Only clear authentication when the backend
     * explicitly says the session is unauthorized.
     *
     * 401 = invalid/expired session.
     *
     * Other errors such as:
     * 400, 403, 404, 429, 500, 502, 503,
     * network errors, or timeouts
     * should NOT log the user out.
     */
    if (status === 401) {
      clearAuth();
      setUser(null);
    } else {
      /*
       * Keep the optimistically restored user if
       * /auth/me failed for a non-authentication reason.
       *
       * If there was no stored user, user remains null.
       */
      if (storedUser) {
        setUser(storedUser);
      }
    }
  })
  .finally(() => {
    setInitialized(true);
  });


}, []);

const login = useCallback(
async (data: LoginRequest) => {
setLoading(true);


  try {
    const res =
      await authApi.login(data);

    setAuth(res.token, res.user);
    setUser(res.user);

    router.push('/dashboard');
  } finally {
    setLoading(false);
  }
},
[router]


);

const register = useCallback(
async (data: RegisterRequest) => {
setLoading(true);


  try {
    await authApi.register(data);

    // Registration does not return a JWT.
    // User must log in after creating the account.
    router.push('/login');
  } finally {
    setLoading(false);
  }
},
[router]


);

const logout = useCallback(
async () => {
await authApi.logout();


  setUser(null);

  router.push('/login');
},
[router]


);

return (
<AuthContext.Provider
value={{
user,
loading,
initialized,
login,
register,
logout,
}}
>
{children}
</AuthContext.Provider>
);
}

export function useAuth() {
const ctx = useContext(AuthContext);

if (!ctx) {
throw new Error(
'useAuth must be used within AuthProvider'
);
}

return ctx;
}
