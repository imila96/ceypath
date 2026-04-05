/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DATA_MODE?: string;
  readonly VITE_API_BASE_URL?: string;
  /** Cloudinary cloud name (public). Defaults to project preset if unset. */
  readonly VITE_CLOUDINARY_CLOUD_NAME?: string;
  /** Unsigned upload preset. Set to empty string to disable CDN and use embedded data URLs only. */
  readonly VITE_CLOUDINARY_UPLOAD_PRESET?: string;
  /** Optional asset folder; unset uses default. Set to empty to let the preset control folder only. */
  readonly VITE_CLOUDINARY_FOLDER?: string;

  /** Firebase Web SDK — set all six on Vercel so catalog + images sync for every visitor */
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
