import axios, {
AxiosError,
InternalAxiosRequestConfig,
} from 'axios';

import type { User } from '@/lib/types';

const API_BASE_URL =
process.env.NEXT_PUBLIC_API_BASE_URL ||
'http://localhost:8080/api';

export const TOKEN_KEY = 'parserx_token';
export const USER_KEY = 'parserx_user';

export function getToken(): string | null {
if (typeof window === 'undefined') return null;

return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): User | null {
if (typeof window === 'undefined') return null;

const raw = localStorage.getItem(USER_KEY);

if (!raw) return null;

try {
return JSON.parse(raw) as User;
} catch {
return null;
}
}

export function setAuth(
token: string,
user: User
) {
localStorage.setItem(
TOKEN_KEY,
token
);

localStorage.setItem(
USER_KEY,
JSON.stringify(user)
);
}

export function clearAuth() {
localStorage.removeItem(TOKEN_KEY);
localStorage.removeItem(USER_KEY);
}

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(
fn: () => void
) {
onUnauthorized = fn;
}

let isHandling401 = false;

export function reset401Guard() {
isHandling401 = false;
}

const api = axios.create({
baseURL: API_BASE_URL,
timeout: 120000,
headers: {
'Content-Type': 'application/json',
},
});

api.interceptors.request.use(
(config: InternalAxiosRequestConfig) => {
const token = getToken();

if (token) {
  config.headers.Authorization =
    `Bearer ${token}`;
}

return config;


},
(error) => {
return Promise.reject(error);
}
);

api.interceptors.response.use(
(response) => {
return response;
},
(error: AxiosError) => {
const status = error.response?.status;


if (
  status === 401 &&
  !isHandling401
) {
  isHandling401 = true;

  clearAuth();

  if (onUnauthorized) {
    onUnauthorized();
  }

  if (typeof window !== 'undefined') {
    const currentPath =
      window.location.pathname;

    if (
      currentPath !== '/login' &&
      currentPath !== '/register' &&
      currentPath !== '/'
    ) {
      window.location.href =
        '/login?expired=1';
    }
  }
}

return Promise.reject(error);


}
);

export default api;
