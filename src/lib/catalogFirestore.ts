import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { CatalogSnapshot } from '../catalog/catalogStore';
import { getFirebaseDb } from './firebaseApp';

const COLLECTION = 'settings';
const DOC_ID = 'catalog';

export async function fetchCatalogFromCloud(): Promise<CatalogSnapshot | null> {
  const db = getFirebaseDb();
  const snap = await getDoc(doc(db, COLLECTION, DOC_ID));
  if (!snap.exists()) return null;
  const raw = snap.data()?.json;
  if (typeof raw !== 'string' || !raw.length) return null;
  try {
    const parsed = JSON.parse(raw) as CatalogSnapshot;
    if (!Array.isArray(parsed.packages) || !Array.isArray(parsed.vehicles)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function saveCatalogToCloud(snapshot: CatalogSnapshot): Promise<void> {
  const db = getFirebaseDb();
  await setDoc(
    doc(db, COLLECTION, DOC_ID),
    {
      json: JSON.stringify(snapshot),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
