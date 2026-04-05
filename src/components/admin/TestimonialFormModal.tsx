import React, { useEffect, useState } from 'react';
import AdminModalShell from './AdminModalShell';
import type { Testimonial } from '../../data/testimonials';

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003580]';
const labelClass = 'block text-xs font-semibold text-gray-600 mb-1';
const box = 'border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-3';

type Props = {
  open: boolean;
  title: string;
  initial: Testimonial;
  onClose: () => void;
  onSave: (t: Testimonial) => void;
};

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T;
}

export default function TestimonialFormModal({ open, title, initial, onClose, onSave }: Props) {
  const [mode, setMode] = useState<'form' | 'json'>('form');
  const [t, setT] = useState<Testimonial>(() => clone(initial));
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');

  useEffect(() => {
    if (open) {
      const c = clone(initial);
      setT(c);
      setJsonText(JSON.stringify(c, null, 2));
      setJsonError('');
      setMode('form');
    }
  }, [open, initial]);

  if (!open) return null;

  function update(partial: Partial<Testimonial>) {
    setT(prev => ({ ...prev, ...partial }));
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
              <button type="button" onClick={() => { setJsonText(JSON.stringify(t, null, 2)); setMode('json'); }} className="px-4 py-2 text-sm border rounded-lg">
                Raw JSON
              </button>
              <button type="button" onClick={() => { onSave(t); onClose(); }} className="px-4 py-2 text-sm font-bold bg-[#003580] text-white rounded-lg">
                Save
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  try {
                    setT(clone(JSON.parse(jsonText) as Testimonial));
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
                    onSave(JSON.parse(jsonText) as Testimonial);
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
        <div className={box}>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>ID</label>
              <input className={inputClass} value={t.id} onChange={e => update({ id: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Initials</label>
              <input className={inputClass} value={t.initials} onChange={e => update({ initials: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Name</label>
              <input className={inputClass} value={t.name} onChange={e => update({ name: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Country</label>
              <input className={inputClass} value={t.country} onChange={e => update({ country: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Flag (emoji)</label>
              <input className={inputClass} value={t.countryFlag} onChange={e => update({ countryFlag: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Rating (1–5)</label>
              <input type="number" min={1} max={5} className={inputClass} value={t.rating} onChange={e => update({ rating: Number(e.target.value) || 5 })} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Package name (display)</label>
              <input className={inputClass} value={t.packageName} onChange={e => update({ packageName: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Date text</label>
              <input className={inputClass} value={t.date} onChange={e => update({ date: e.target.value })} placeholder="February 2025" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Review</label>
              <textarea className={`${inputClass} min-h-[100px]`} value={t.text} onChange={e => update({ text: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Avatar gradient (Tailwind)</label>
              <input className={inputClass} value={t.avatarGradient} onChange={e => update({ avatarGradient: e.target.value })} />
            </div>
          </div>
        </div>
      )}
    </AdminModalShell>
  );
}
