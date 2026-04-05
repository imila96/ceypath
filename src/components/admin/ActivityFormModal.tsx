import React, { useEffect, useState } from 'react';
import AdminModalShell from './AdminModalShell';
import { uploadCatalogImage } from './formUtils';
import type { Activity, Difficulty } from '../../data/activities';

const DIFF: Difficulty[] = ['Easy', 'Moderate', 'Challenging'];

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003580]';
const labelClass = 'block text-xs font-semibold text-gray-600 mb-1';
const box = 'border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-3';

type Props = {
  open: boolean;
  title: string;
  initial: Activity;
  onClose: () => void;
  onSave: (a: Activity) => void;
};

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T;
}

export default function ActivityFormModal({ open, title, initial, onClose, onSave }: Props) {
  const [mode, setMode] = useState<'form' | 'json'>('form');
  const [a, setA] = useState<Activity>(() => clone(initial));
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');

  useEffect(() => {
    if (open) {
      const c = clone(initial);
      setA(c);
      setJsonText(JSON.stringify(c, null, 2));
      setJsonError('');
      setMode('form');
    }
  }, [open, initial]);

  if (!open) return null;

  function update(partial: Partial<Activity>) {
    setA(prev => ({ ...prev, ...partial }));
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
              <button type="button" onClick={() => { setJsonText(JSON.stringify(a, null, 2)); setMode('json'); }} className="px-4 py-2 text-sm border rounded-lg">
                Raw JSON
              </button>
              <button type="button" onClick={() => { onSave(a); onClose(); }} className="px-4 py-2 text-sm font-bold bg-[#003580] text-white rounded-lg">
                Save
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  try {
                    setA(clone(JSON.parse(jsonText) as Activity));
                    setMode('form');
                  } catch {
                    alert('Invalid JSON');
                  }
                }}
                className="px-4 py-2 text-sm border rounded-lg"
              >
                Back to form
              </button>
              <button
                type="button"
                onClick={() => {
                  setJsonError('');
                  try {
                    onSave(JSON.parse(jsonText) as Activity);
                    onClose();
                  } catch (e) {
                    setJsonError(e instanceof Error ? e.message : 'Invalid');
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
          <textarea value={jsonText} onChange={e => setJsonText(e.target.value)} className="w-full min-h-[280px] font-mono text-xs border rounded p-3" />
          {jsonError && <p className="text-red-600 text-sm">{jsonError}</p>}
        </div>
      ) : (
        <div className={box}>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>ID</label>
              <input className={inputClass} value={a.id} onChange={e => update({ id: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Destination slug</label>
              <input className={inputClass} value={a.destination} onChange={e => update({ destination: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Name</label>
              <input className={inputClass} value={a.name} onChange={e => update({ name: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Duration</label>
              <input className={inputClass} value={a.duration} onChange={e => update({ duration: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Difficulty</label>
              <select className={inputClass} value={a.difficulty} onChange={e => update({ difficulty: e.target.value as Difficulty })}>
                {DIFF.map(d => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Price / person</label>
              <input type="number" min={0} className={inputClass} value={a.pricePerPerson} onChange={e => update({ pricePerPerson: Number(e.target.value) || 0 })} />
            </div>
            <div>
              <label className={labelClass}>Icon (emoji)</label>
              <input className={inputClass} value={a.icon} onChange={e => update({ icon: e.target.value })} />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <p className="text-sm font-bold text-gray-900">Location / activity photo</p>
              <p className="text-xs text-gray-500">
                Optional. Shown on the customize step when picking add-ons. If empty, only the emoji icon is shown.
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
                        update({ image: await uploadCatalogImage(f) });
                      } catch (e) {
                        alert(e instanceof Error ? e.message : 'Could not upload file.');
                      }
                    }}
                  />
                  Upload photo
                </label>
                {a.image && (
                  <button type="button" className="text-sm text-red-600 font-semibold" onClick={() => update({ image: undefined })}>
                    Remove photo
                  </button>
                )}
              </div>
              {a.image && (
                <img src={a.image} alt="" className="max-h-36 rounded-lg border border-gray-200 object-cover w-full max-w-md" />
              )}
              <div>
                <label className={labelClass}>Or path / URL</label>
                <input
                  className={inputClass}
                  value={a.image?.startsWith('data:') ? '' : (a.image ?? '')}
                  onChange={e => update({ image: e.target.value || undefined })}
                  placeholder="/images/... or https://..."
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm sm:col-span-2 pt-2">
              <input type="checkbox" checked={a.included} onChange={e => update({ included: e.target.checked })} />
              Included in base price
            </label>
            <div className="sm:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea className={`${inputClass} min-h-[80px]`} value={a.description} onChange={e => update({ description: e.target.value })} />
            </div>
          </div>
        </div>
      )}
    </AdminModalShell>
  );
}
