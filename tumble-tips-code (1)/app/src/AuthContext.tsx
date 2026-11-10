import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ApiError, api, tokenStore } from './api';

export type Athlete = { id: string; name: string };
type Me = { user: { id: string; email: string }; admin: boolean; athletes: Athlete[] };
type Ctx = {
  status: 'loading' | 'out' | 'in';
  token: string | null;
  me: Me | null;
  athlete: Athlete | null;
  selectAthlete: (id: string) => void;
  requestCode: (email: string) => Promise<void>;
  /** Returns 'consent_required' when this is a new account and the parent has not agreed yet. */
  verify: (email: string, code: string, consent: boolean) => Promise<'ok' | 'consent_required'>;
  refreshMe: () => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
};
const C = createContext<Ctx | null>(null);
export const CONSENT_VERSION = 'draft-1'; // bump when the terms/privacy policy change

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Ctx['status']>('loading');
  const [token, setToken] = useState<string | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const load = useCallback(async (t: string) => {
    const m = await api<Me>('GET', '/me', t);
    setToken(t); setMe(m); setStatus('in');
  }, []);

  useEffect(() => {
    (async () => {
      const t = await tokenStore.get();
      if (!t) return setStatus('out');
      try { await load(t); }
      catch (e) {
        // A rejected token means signed out. A network error keeps the token so the user is not logged out for being offline.
        if (e instanceof ApiError && e.status === 401) { await tokenStore.clear(); setStatus('out'); } else setStatus('out');
      }
    })();
  }, [load]);

  const value = useMemo<Ctx>(() => ({
    status, token, me,
    athlete: me?.athletes.find(a => a.id === selected) ?? me?.athletes[0] ?? null,
    selectAthlete: setSelected,
    requestCode: async email => { await api('POST', '/auth/request', null, { email }); },
    verify: async (email, code, consent) => {
      try {
        const r = await api<{ token: string }>('POST', '/auth/verify', null, { email, code, consent, consentVersion: CONSENT_VERSION });
        await tokenStore.set(r.token); await load(r.token);
        return 'ok';
      } catch (e) {
        if (e instanceof ApiError && e.code === 'consent_required') return 'consent_required';
        throw e;
      }
    },
    refreshMe: async () => { if (token) await load(token); },
    signOut: async () => { if (token) await api('POST', '/auth/logout', token).catch(() => {}); await tokenStore.clear(); setToken(null); setMe(null); setSelected(null); setStatus('out'); },
    deleteAccount: async () => { await api('DELETE', '/me', token); await tokenStore.clear(); setToken(null); setMe(null); setSelected(null); setStatus('out'); },
  }), [status, token, me, selected, load]);

  return <C.Provider value={value}>{children}</C.Provider>;
}
export const useAuth = () => { const v = useContext(C); if (!v) throw new Error('useAuth outside AuthProvider'); return v; };
