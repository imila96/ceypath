import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirebaseAuth, isFirebaseConfigured } from '../lib/firebaseApp';

const SESSION_KEY = 'lankatrips_admin_session';

type AdminAuthContextValue = {
  /** Firebase has finished restoring session, or legacy mode ready */
  authReady: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

function readLegacySession(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [authReady, setAuthReady] = useState(!isFirebaseConfigured());
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setAuthed(readLegacySession());
      setAuthReady(true);
      return;
    }

    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, user => {
      setAuthed(!!user);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const u = username.trim();
    if (isFirebaseConfigured()) {
      try {
        await signInWithEmailAndPassword(getFirebaseAuth(), u, password);
        return true;
      } catch {
        return false;
      }
    }
    if (u === 'admin' && password === 'admin') {
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* ignore */
      }
      setAuthed(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(async () => {
    if (isFirebaseConfigured()) {
      try {
        await signOut(getFirebaseAuth());
      } catch {
        /* ignore */
      }
    } else {
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch {
        /* ignore */
      }
      setAuthed(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      authReady,
      isAuthenticated: authed,
      login,
      logout,
    }),
    [authReady, authed, login, logout]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return ctx;
}
