import api, { getToken, clearAuth } from './axios';

import type {
User,
LoginRequest,
RegisterRequest,
RegisterResponse,
AuthResponse,
} from '@/lib/types';

export async function register(
data: RegisterRequest
): Promise<RegisterResponse> {
const res = await api.post<RegisterResponse>(
'/auth/register',
data
);

return res.data;
}

export async function login(
data: LoginRequest
): Promise<AuthResponse> {
const res = await api.post<AuthResponse>(
'/auth/login',
data
);

return res.data;
}

export async function getCurrentUser(): Promise<User> {
const res = await api.get<User>('/auth/me');

return res.data;
}

export async function logout(): Promise<void> {
try {
await api.post('/auth/logout');
} catch {
// Clear local authentication even if the backend logout request fails.
}

clearAuth();
}

export function hasToken(): boolean {
return !!getToken();
}
