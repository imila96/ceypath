import React, { useEffect, useState } from 'react';
import AdminModalShell from './AdminModalShell';
import { uploadCatalogImage } from './formUtils';
import type { Destination, Attraction } from '../../data/destinations';

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#003580]';
const labelClass = 'block text-xs font-semibold text-gray-600 mb-1';
const sectionClass = 'border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-3';

type Props = {
  open: boolean;
  title: string;
  initial: Destination;
  onClose: () => void;
  onSave: (d: Destination) => void;
};

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T;
}

export default function DestinationFormModal({ open, title, initial, onClose, onSave }: Props) {
  const [mode, setMode] = useState<'form' | 'json'>('form');
  const [d, setD] = useState<Destination>(() => clone(initial));
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');

  useEffect(() => {
    if (open) {
      const c = clone(initial);
      setD(c);
      setJsonText(JSON.stringify(c, null, 2));
      setJsonError('');
      setMode('form');
    }
  }, [open, initial]);

  if (!open) return null;

  function update(partial: Partial<Destination>) {
    setD(prev => ({ ...prev, ...partial }));
  }

  return (
    <AdminModalShell
      title={title}
      onClose={onClose}
      wide
      footer={
        <>
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 rounded-lg">
            Cancel
          </button>
          {mode === 'form' ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setJsonText(JSON.stringify(d, null, 2));
                  setMode('json');
                }}
                className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg"
              >
                Raw JSON
              </button>
              <button
                type="button"
                onClick={() => {
                  onSave(d);
                  onClose();
                }}
                className="px-4 py-2 text-sm font-bold bg-[#003580] text-white rounded-lg hover:bg-[#002560]"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  try {
                    setD(clone(JSON.parse(jsonText) as Destination));
                    setMode('form');
                  } catch {
                    alert('Invalid JSON');
                  }
                }}
                className="px-4 py-2 text-sm font-semibold border border-gray-300 rounded-lg"
              >
                Back to form
              </button>
              <button
                type="button"
                onClick={() => {
                  setJsonError('');
                  try {
                    onSave(JSON.parse(jsonText) as Destination);
                    onClose();
                  } catch (e) {
                    setJsonError(e instanceof Error ? e.message : 'Invalid JSON');
                  }
                }}
                className="px-4 py-2 text-sm font-bold bg-[#003580] text-white rounded-lg"
              >
                Save JSON
              </button>
            </>
          )}
        </>
      }
    >
      {mode === 'json' ? (
        <div>
          <textarea
            value={jsonText}
            onChange={e => setJsonText(e.target.value)}
            className="w-full min-h-[400px] font-mono text-xs border rounded-lg p-3"
            spellCheck={false}
          />
          {jsonError && <p className="text-red-600 text-sm mt-2">{jsonError}</p>}
        </div>
      ) : (
        <div className="space-y-4">
          <div className={sectionClass}>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>ID</label>
                <input className={inputClass} value={d.id} onChange={e => update({ id: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>URL slug</label>
                <input className={inputClass} value={d.slug} onChange={e => update({ slug: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Name</label>
                <input className={inputClass} value={d.name} onChange={e => update({ name: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Tagline</label>
                <input className={inputClass} value={d.tagline} onChange={e => update({ tagline: e.target.value })} />
              </div>
            </div>
          </div>
          <div className={sectionClass}>
            <label className={labelClass}>Short description (cards)</label>
            <textarea className={`${inputClass} min-h-[64px]`} value={d.description} onChange={e => update({ description: e.target.value })} />
            <label className={labelClass}>Long description</label>
            <textarea
              className={`${inputClass} min-h-[120px]`}
              value={d.longDescription}
              onChange={e => update({ longDescription: e.target.value })}
            />
          </div>
          <div className={sectionClass}>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Best time</label>
                <input className={inputClass} value={d.bestTime} onChange={e => update({ bestTime: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>From Colombo</label>
                <input
                  className={inputClass}
                  value={d.distanceFromColombo}
                  onChange={e => update({ distanceFromColombo: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Language</label>
                <input className={inputClass} value={d.language} onChange={e => update({ language: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Avg temp</label>
                <input className={inputClass} value={d.avgTemp} onChange={e => update({ avgTemp: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Package count (display)</label>
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  value={d.packageCount}
                  onChange={e => update({ packageCount: Number(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className={labelClass}>Gradient (Tailwind)</label>
                <input className={inputClass} value={d.gradient} onChange={e => update({ gradient: e.target.value })} />
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <p className="text-sm font-bold text-gray-900">Destination image</p>
            <p className="text-xs text-gray-500">
              Shown on destination cards and the top of the destination page. Upload (Cloudinary CDN URL when
              configured, otherwise stored in the browser) or paste a path / URL.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex items-center gap-2 px-3 py-2 bg-[#003580] text-white text-sm font-semibold rounded-lg cursor-pointer hover:bg-[#002560]">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async e => {
                    const f = e.target.files?.[0];
                    e.target.value = '';
                    if (!f) return;
                    try {
                      update({ coverImage: await uploadCatalogImage(f) });
                    } catch (e) {
                      alert(e instanceof Error ? e.message : 'Could not upload file.');
                    }
                  }}
                />
                Upload cover
              </label>
              {d.coverImage && (
                <button type="button" className="text-sm text-red-600 font-semibold" onClick={() => update({ coverImage: undefined })}>
                  Remove cover
                </button>
              )}
            </div>
            {d.coverImage && (
              <img src={d.coverImage} alt="" className="max-h-36 rounded-lg border border-gray-200 object-cover" />
            )}
            <div>
              <label className={labelClass}>Or path / URL</label>
              <input
                className={inputClass}
                value={d.coverImage?.startsWith('data:') ? '' : (d.coverImage ?? '')}
                onChange={e => update({ coverImage: e.target.value || undefined })}
                placeholder="/images/... or https://..."
              />
            </div>
          </div>

          <div className={sectionClass}>
            <div className="flex justify-between items-center">
              <p className="text-sm font-bold text-gray-900">Attractions</p>
              <button
                type="button"
                className="text-sm font-semibold text-[#003580]"
                onClick={() =>
                  update({
                    attractions: [...d.attractions, { name: '', type: 'Sight', description: '', image: undefined }],
                  })
                }
              >
                + Add
              </button>
            </div>
            {d.attractions.map((a, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3 bg-white space-y-2">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs text-red-600 font-semibold"
                    onClick={() => {
                      const next = [...d.attractions];
                      next.splice(i, 1);
                      update({ attractions: next });
                    }}
                  >
                    Remove
                  </button>
                </div>
                <input
                  className={inputClass}
                  placeholder="Name"
                  value={a.name}
                  onChange={e => {
                    const next = [...d.attractions];
                    next[i] = { ...next[i], name: e.target.value };
                    update({ attractions: next });
                  }}
                />
                <input
                  className={inputClass}
                  placeholder="Type"
                  value={a.type}
                  onChange={e => {
                    const next = [...d.attractions];
                    next[i] = { ...next[i], type: e.target.value };
                    update({ attractions: next });
                  }}
                />
                <textarea
                  className={`${inputClass} min-h-[56px]`}
                  placeholder="Description"
                  value={a.description}
                  onChange={e => {
                    const next = [...d.attractions];
                    next[i] = { ...next[i], description: e.target.value };
                    update({ attractions: next });
                  }}
                />
                <div className="pt-1 border-t border-gray-100">
                  <label className={labelClass}>Photo (optional)</label>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <label className="inline-flex px-2 py-1.5 border border-[#003580] text-[#003580] text-xs font-semibold rounded cursor-pointer hover:bg-blue-50">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async e => {
                          const f = e.target.files?.[0];
                          e.target.value = '';
                          if (!f) return;
                          try {
                            const src = await uploadCatalogImage(f);
                            const next = [...d.attractions];
                            next[i] = { ...next[i], image: src };
                            update({ attractions: next });
                          } catch (e) {
                            alert(e instanceof Error ? e.message : 'Could not upload file.');
                          }
                        }}
                      />
                      Upload
                    </label>
                    {a.image && (
                      <button
                        type="button"
                        className="text-xs text-red-600 font-semibold"
                        onClick={() => {
                          const next = [...d.attractions];
                          next[i] = { ...next[i], image: undefined };
                          update({ attractions: next });
                        }}
                      >
                        Remove photo
                      </button>
                    )}
                  </div>
                  <input
                    className={inputClass}
                    placeholder="Or image URL / path"
                    value={a.image?.startsWith('data:') ? '' : (a.image ?? '')}
                    onChange={e => {
                      const next = [...d.attractions];
                      next[i] = { ...next[i], image: e.target.value || undefined };
                      update({ attractions: next });
                    }}
                  />
                  {a.image && (
                    <img src={a.image} alt="" className="mt-2 max-h-24 rounded border object-cover" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminModalShell>
  );
}
