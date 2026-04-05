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

const FIRESTORE_JSON_MAX = 950_000;

export function catalogJsonByteSize(snapshot: CatalogSnapshot): number {
  return new Blob([JSON.stringify(snapshot)]).size;
}

export async function saveCatalogToCloud(snapshot: CatalogSnapshot): Promise<void> {
  const json = JSON.stringify(snapshot);
  if (json.length > FIRESTORE_JSON_MAX) {
    throw new Error(
      `Catalog JSON is too large for one Firestore document (~${Math.round(json.length / 1000)}KB / limit ~1MB). Use Cloudinary image URLs only — do not paste huge base64 images in JSON.`
    );
  }
  const db = getFirebaseDb();
  await setDoc(
    doc(db, COLLECTION, DOC_ID),
    {
      json,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
