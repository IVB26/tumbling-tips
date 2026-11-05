import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Set EXPO_PUBLIC_API_URL for staging and production builds.
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}

export async function api<T = any>(method: string, path: string, token?: string | null, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(API_URL + path, {
      method,
      headers: { ...(body !== undefined ? { 'content-type': 'application/json' } : {}), ...(token ? { authorization: `Bearer ${token}` } : {}) },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'network', 'Could not reach the server. Check your connection and try again.');
  }
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.error ?? 'error', data.message ?? 'Something went wrong.');
  return data as T;
}

// The sign-in token is kept in the phone's secure storage (Keychain / Keystore). The web build falls back to localStorage.
const KEY = 'tt-session';
export const tokenStore = {
  get: async (): Promise<string | null> => {
    try { return Platform.OS === 'web' ? localStorage.getItem(KEY) : await SecureStore.getItemAsync(KEY); } catch { return null; }
  },
  set: async (v: string) => { try { Platform.OS === 'web' ? localStorage.setItem(KEY, v) : await SecureStore.setItemAsync(KEY, v); } catch {} },
  clear: async () => { try { Platform.OS === 'web' ? localStorage.removeItem(KEY) : await SecureStore.deleteItemAsync(KEY); } catch {} },
};
