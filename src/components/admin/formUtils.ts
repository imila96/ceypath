import { isCloudinaryUploadAvailable, uploadImageToCloudinary } from '../../lib/cloudinaryUpload';

/** Max size for embedded data URLs (localStorage is limited per origin). */
export const MAX_EMBED_IMAGE_BYTES = 2_500_000;

/**
 * Uploads an admin catalog image: Cloudinary (CDN URL) when preset is configured, otherwise a data URL (~2.5MB max).
 */
export async function uploadCatalogImage(file: File): Promise<string> {
  if (isCloudinaryUploadAvailable()) {
    return uploadImageToCloudinary(file);
  }
  if (file.size > MAX_EMBED_IMAGE_BYTES) {
    throw new Error(
      `Image too large for browser storage (max ~${Math.round(MAX_EMBED_IMAGE_BYTES / 1_000_000)}MB). Enable Cloudinary (see .env.example) or use a smaller file / paste a URL.`
    );
  }
  return readFileAsDataUrl(file);
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

/** One non-empty line per list item */
export function linesToList(text: string): string[] {
  return text
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);
}

export function listToLines(items: string[]): string {
  return items.join('\n');
}
