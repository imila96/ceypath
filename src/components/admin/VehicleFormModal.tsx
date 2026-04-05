import React, { useEffect, useState } from 'react';
import AdminModalShell from './AdminModalShell';
import { linesToList, listToLines, uploadCatalogImage } from './formUtils';
import type { Vehicle } from '../../data/vehicles';

const TYPES: Vehicle['type'][] = ['Sedan', 'SUV', 'Van', 'Luxury', 'Minibus'];

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003580]';
const labelClass = 'block text-xs font-semibold text-gray-600 mb-1';
const box = 'border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-3';

type Props = {
  open: boolean;
  title: string;
  initial: Vehicle;
  onClose: () => void;
  onSave: (v: Vehicle) => void;
};

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T;
}

export default function VehicleFormModal({ open, title, initial, onClose, onSave }: Props) {
  const [mode, setMode] = useState<'form' | 'json'>('form');
  const [v, setV] = useState<Vehicle>(() => clone(initial));
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');

  useEffect(() => {
    if (open) {
      const c = clone(initial);
      setV(c);
      setJsonText(JSON.stringify(c, null, 2));
      setJsonError('');
      setMode('form');
    }
  }, [open, initial]);

  if (!open) return null;

  function update(partial: Partial<Vehicle>) {
    setV(prev => ({ ...prev, ...partial }));
  }

  return (
    <AdminModalShell
      title={title}
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 rounded-lg">
            Cancel
          </button>
          {mode === 'form' ? (
            <>
              <button type="button" onClick={() => { setJsonText(JSON.stringify(v, null, 2)); setMode('json'); }} className="px-4 py-2 text-sm border rounded-lg">
                Raw JSON
              </button>
              <button
                type="button"
                onClick={() => {
                  onSave(v);
                  onClose();
                }}
                className="px-4 py-2 text-sm font-bold bg-[#003580] text-white rounded-lg"
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
                    setV(clone(JSON.parse(jsonText) as Vehicle));
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
                    onSave(JSON.parse(jsonText) as Vehicle);
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
          <textarea value={jsonText} onChange={e => setJsonText(e.target.value)} className="w-full min-h-[320px] font-mono text-xs border rounded p-3" />
          {jsonError && <p className="text-red-600 text-sm">{jsonError}</p>}
        </div>
      ) : (
        <div className="space-y-4">
          <div className={box}>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>ID</label>
                <input className={inputClass} value={v.id} onChange={e => update({ id: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Name</label>
                <input className={inputClass} value={v.name} onChange={e => update({ name: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Type</label>
                <select className={inputClass} value={v.type} onChange={e => update({ type: e.target.value as Vehicle['type'] })}>
                  {TYPES.map(t => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Badge (optional)</label>
                <input className={inputClass} value={v.badge ?? ''} onChange={e => update({ badge: e.target.value || undefined })} />
              </div>
              <div>
                <label className={labelClass}>Capacity (pax)</label>
                <input type="number" min={1} className={inputClass} value={v.capacity} onChange={e => update({ capacity: Number(e.target.value) || 1 })} />
              </div>
              <div>
                <label className={labelClass}>Luggage</label>
                <input type="number" min={0} className={inputClass} value={v.luggage} onChange={e => update({ luggage: Number(e.target.value) || 0 })} />
              </div>
              <div>
                <label className={labelClass}>Price modifier</label>
                <input type="number" className={inputClass} value={v.priceModifier} onChange={e => update({ priceModifier: Number(e.target.value) || 0 })} />
              </div>
              <div>
                <label className={labelClass}>Daily rate (USD)</label>
                <input type="number" min={0} className={inputClass} value={v.dailyRate} onChange={e => update({ dailyRate: Number(e.target.value) || 0 })} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Gradient classes</label>
                <input className={inputClass} value={v.gradient} onChange={e => update({ gradient: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Features (one per line)</label>
                <textarea
                  className={`${inputClass} min-h-[88px] font-mono text-xs`}
                  value={listToLines(v.features)}
                  onChange={e => update({ features: linesToList(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div className={box}>
            <p className="text-sm font-bold text-gray-900">Vehicle photo</p>
            <p className="text-xs text-gray-500">
              Optional. Shown on fleet cards and the vehicles page. If empty, the gradient and vehicle emoji are used instead.
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
              {v.image && (
                <button type="button" className="text-sm text-red-600 font-semibold" onClick={() => update({ image: undefined })}>
                  Remove photo
                </button>
              )}
            </div>
            {v.image && (
              <img src={v.image} alt="" className="max-h-36 rounded-lg border border-gray-200 object-cover w-full max-w-md" />
            )}
            <div>
              <label className={labelClass}>Or path / URL</label>
              <input
                className={inputClass}
                value={v.image?.startsWith('data:') ? '' : (v.image ?? '')}
                onChange={e => update({ image: e.target.value || undefined })}
                placeholder="/images/... or https://..."
              />
            </div>
          </div>
        </div>
      )}
    </AdminModalShell>
  );
}
