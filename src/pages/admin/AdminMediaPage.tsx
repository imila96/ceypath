import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminMediaPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Images &amp; media</h2>
        <p className="text-gray-600 mt-1">
          There is no separate media library. In <strong>Packages → Edit</strong>, use the form fields for cover and
          gallery images (or switch to Raw JSON inside that modal for advanced edits).
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4 text-sm text-gray-700">
        <p>
          In <Link to="/admin/packages" className="text-[#003580] font-semibold hover:underline">Packages</Link>, click{' '}
          <strong>Edit</strong> on a tour and set JSON fields:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Packages</strong> — <strong>Packages → Edit</strong>: <strong>Upload cover</strong> and gallery{' '}
            <strong>Upload</strong>. With Cloudinary configured (see <code className="bg-gray-100 px-1 rounded">.env.example</code>
            ), files go to the CDN and only the URL is stored; otherwise images are embedded (~2.5MB max per file).
          </li>
          <li>
            <strong>Destinations</strong> — <strong>Destinations → Edit</strong>: <strong>Upload cover</strong> for the
            hero/cards, and per-attraction <strong>Upload</strong> for attraction photos (or path/URL).
          </li>
          <li>
            <strong>Path / URL</strong> — Same screen: set <code className="bg-gray-100 px-1 rounded">coverImage</code>{' '}
            or gallery <code className="bg-gray-100 px-1 rounded">src</code> to e.g.{' '}
            <code className="bg-gray-100 px-1 rounded">/images/tourism/sigiriya.jpg</code> (files you add under{' '}
            <code className="bg-gray-100 px-1 rounded">public/</code> in the project).
          </li>
          <li>
            <strong>Production</strong> — Prefer CDN URLs (Cloudinary is wired for unsigned uploads) or{' '}
            <code className="bg-gray-100 px-1 rounded">public/</code> paths, not huge data URLs in localStorage.
          </li>
        </ul>
      </div>
    </div>
  );
}
