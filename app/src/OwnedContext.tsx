import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ownsProduct } from './lib/catalog';

const KEY = 'tt-owned-v1';
type Ctx = { owned: string[]; owns: (id: string) => boolean; unlock: (id: string) => void };
const C = createContext<Ctx>({ owned: [], owns: () => false, unlock: () => {} });

/**
 * Which products and skills are unlocked, shared by every tab.
 * DEMO ONLY: unlocking is free and stored on the device. Replace with real
 * In-App Purchase entitlements (RevenueCat) before store release.
 */
export function OwnedProvider({ children }: { children: React.ReactNode }) {
  const [owned, setOwned] = useState<string[]>(['p4']); // p4 is the free "Safe Tumbling Space" tips product
  useEffect(() => { AsyncStorage.getItem(KEY).then(r => { if (r) setOwned(JSON.parse(r)); }).catch(() => {}); }, []);
  const unlock = useCallback((id: string) => setOwned(prev => {
    if (prev.includes(id)) return prev;
    const next = [...prev, id]; AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {}); return next;
  }), []);
  const value = useMemo<Ctx>(() => ({ owned, unlock, owns: id => ownsProduct(owned, id) }), [owned, unlock]);
  return <C.Provider value={value}>{children}</C.Provider>;
}
export const useOwned = () => useContext(C);
