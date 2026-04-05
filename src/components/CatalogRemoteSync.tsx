import { useEffect, useRef } from 'react';
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

/**
 * After localStorage rehydrate: loads catalog from Firestore (shared for all visitors).
 * When an admin is signed in with Firebase Auth, edits debounce-save to Firestore.
 */
export default function CatalogRemoteSync() {
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastSavedJson = useRef<string>('');
  const unsubscribeStore = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    let cancelled = false;

    const setupSubscribe = () => {
      unsubscribeStore.current = useCatalogStore.subscribe(state => {
        const snap = snapshotFromState(state);
        const json = JSON.stringify(snap);
        if (json === lastSavedJson.current) return;
        clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(async () => {
          if (cancelled) return;
          const auth = getFirebaseAuth();
          if (!auth.currentUser) return;
          try {
            await saveCatalogToCloud(snap);
            lastSavedJson.current = json;
          } catch (err) {
            console.error('[catalog] Firestore save failed', err);
          }
        }, 1200);
      });
    };

    const loadRemoteAndSubscribe = async () => {
      try {
        const remote = await fetchCatalogFromCloud();
        if (cancelled) return;
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
        lastSavedJson.current = JSON.stringify(snapshotFromState(useCatalogStore.getState()));
      } catch (e) {
        console.error('[catalog] Failed to load from Firestore', e);
      }
      if (!cancelled) setupSubscribe();
    };

    let unsubHydrate: (() => void) | undefined;

    if (useCatalogStore.persist.hasHydrated()) {
      void loadRemoteAndSubscribe();
    } else {
      unsubHydrate = useCatalogStore.persist.onFinishHydration(() => {
        void loadRemoteAndSubscribe();
      });
    }

    return () => {
      cancelled = true;
      unsubHydrate?.();
      clearTimeout(saveTimer.current);
      unsubscribeStore.current?.();
    };
  }, []);

  return null;
}
