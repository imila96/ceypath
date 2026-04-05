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
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
