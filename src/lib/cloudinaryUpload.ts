/**
 * Unsigned uploads to Cloudinary (upload preset must allow unsigned + folder if used).
 * @see https://cloudinary.com/documentation/image_upload_api_reference
 */

const DEFAULT_CLOUD_NAME = 'dbgrjduzy';
const DEFAULT_UPLOAD_PRESET = 'web_project_uploads';
const DEFAULT_FOLDER = 'web_uploads';

function getFolder(): string {
  const raw = import.meta.env.VITE_CLOUDINARY_FOLDER;
  if (raw === undefined) return DEFAULT_FOLDER;
  return String(raw).trim();
}

function getConfig() {
  const cloudName = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined)?.trim() || DEFAULT_CLOUD_NAME;
  const uploadPreset = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined)?.trim() ?? DEFAULT_UPLOAD_PRESET;
  return { cloudName, uploadPreset, folder: getFolder() };
}

/** When preset is empty (e.g. VITE_CLOUDINARY_UPLOAD_PRESET=), fall back to embedded data URLs only. */
export function isCloudinaryUploadAvailable(): boolean {
  return getConfig().uploadPreset.length > 0;
}

export function getCloudinaryImageUploadUrl(): string {
  const { cloudName } = getConfig();
  return `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
}

export async function uploadImageToCloudinary(file: File): Promise<string> {
  const { uploadPreset, folder } = getConfig();
  if (!uploadPreset) {
    throw new Error('Cloudinary upload preset is not configured.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  /** Omit folder when VITE_CLOUDINARY_FOLDER is set to empty in .env (use preset default only). */
  if (folder) {
    formData.append('folder', folder);
  }

  const url = getCloudinaryImageUploadUrl();
  const res = await fetch(url, { method: 'POST', body: formData });
  const data = (await res.json()) as { secure_url?: string; error?: { message?: string } };

  if (!res.ok) {
    const msg = data.error?.message ?? res.statusText ?? 'Upload failed';
    throw new Error(msg);
  }

  if (!data.secure_url) {
    throw new Error('Cloudinary did not return a URL.');
  }

  return data.secure_url;
}
