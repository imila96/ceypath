import { useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useCatalogStore } from '../catalog/catalogStore';
import type { CatalogSnapshot } from '../catalog/catalogStore';
import { fetchCatalogFromCloud, saveCatalogToCloud } from '../lib/catalogFirestore';
import { getFirebaseAuth, isFirebaseConfigured } from '../lib/firebaseApp';

function snapshotFromState(s: ReturnType<typeof useCatalogStore.getState>): CatalogSnapshot {
  return {
    packages: s.packages,
    destinations: s.destinations,
    vehicles: s.vehicles,
    hotels: s.hotels,
    activities: s.activities,
    testimonials: s.testimonials,
  };
}

function waitForCatalogHydration(): Promise<void> {
  if (useCatalogStore.persist.hasHydrated()) {
    return Promise.resolve();
  }
  return new Promise<void>(resolve => {
    const unsub = useCatalogStore.persist.onFinishHydration(() => {
      unsub();
      resolve();
    });
  });
}

async function applyRemoteOrUploadIfEmpty(): Promise<void> {
  await waitForCatalogHydration();
  let remote = await fetchCatalogFromCloud();
  const auth = getFirebaseAuth();

  if (!remote && auth.currentUser) {
    const snap = snapshotFromState(useCatalogStore.getState());
    await saveCatalogToCloud(snap);
    console.info(
      '[catalog] Saved your catalog to Firestore (cloud was empty). Open incognito — you should see the same data after this.'
    );
    remote = await fetchCatalogFromCloud();
  }

  if (remote) {
    useCatalogStore.setState({
      packages: remote.packages,
      destinations: remote.destinations,
      vehicles: remote.vehicles,
      hotels: remote.hotels,
      activities: remote.activities,
      testimonials: remote.testimonials,
    });
  }
}

/**
 * Firestore = shared catalog for all visitors. localStorage is only a cache.
 * If the cloud document is missing and you’re signed in with Firebase, we upload once from this browser.
 */
export default function CatalogRemoteSync() {
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastSavedJson = useRef<string>('');
  const unsubscribeStore = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    if (import.meta.env.PROD && !isFirebaseConfigured()) {
      console.warn(
        '[catalog] Add all six VITE_FIREBASE_* variables on Vercel and redeploy — otherwise catalog stays per-browser only.'
      );
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    let cancelled = false;

    const finishBootstrap = async () => {
      try {
        await applyRemoteOrUploadIfEmpty();
        if (cancelled) return;
        lastSavedJson.current = JSON.stringify(snapshotFromState(useCatalogStore.getState()));
      } catch (e) {
        console.error('[catalog] Initial Firestore sync failed', e);
      }

      if (cancelled) return;
      unsubscribeStore.current = useCatalogStore.subscribe(state => {
        const snap = snapshotFromState(state);
        const json = JSON.stringify(snap);
        if (json === lastSavedJson.current) return;
        clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(async () => {
          if (cancelled) return;
          const a = getFirebaseAuth();
          if (!a.currentUser) return;
          try {
            await saveCatalogToCloud(snap);
            lastSavedJson.current = json;
          } catch (err) {
            console.error('[catalog] Firestore save failed', err);
          }
        }, 1200);
      });
    };

    let unsubHydrate: (() => void) | undefined;
    if (useCatalogStore.persist.hasHydrated()) {
      void finishBootstrap();
    } else {
      unsubHydrate = useCatalogStore.persist.onFinishHydration(() => {
        void finishBootstrap();
      });
    }

    /** Login after page load: session had no user during bootstrap — upload if cloud still empty */
    const unsubAuth = onAuthStateChanged(getFirebaseAuth(), async user => {
      if (!user || cancelled) return;
      try {
        await applyRemoteOrUploadIfEmpty();
        if (cancelled) return;
        lastSavedJson.current = JSON.stringify(snapshotFromState(useCatalogStore.getState()));
      } catch (e) {
        console.error('[catalog] Sync after login failed', e);
      }
    });

    return () => {
      cancelled = true;
      unsubHydrate?.();
      unsubAuth();
      clearTimeout(saveTimer.current);
      unsubscribeStore.current?.();
    };
  }, []);

  return null;
}
