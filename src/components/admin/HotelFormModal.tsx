import React, { useEffect, useState } from 'react';
import AdminModalShell from './AdminModalShell';
import { linesToList, listToLines, uploadCatalogImage } from './formUtils';
import type {
  Hotel,
  HotelFaq,
  HotelGalleryImage,
  HotelNearbyPlace,
  HotelRestaurant,
  HotelRoomType,
  HotelSurroundingsGroup,
  HotelTier,
} from '../../data/hotels';

const TIERS: HotelTier[] = ['budget', 'standard', 'luxury'];

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003580]';
const labelClass = 'block text-xs font-semibold text-gray-600 mb-1';
const box = 'border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-3';

type Props = {
  open: boolean;
  title: string;
  initial: Hotel;
  onClose: () => void;
  onSave: (h: Hotel) => void;
};

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T;
}

export default function HotelFormModal({ open, title, initial, onClose, onSave }: Props) {
  const [mode, setMode] = useState<'form' | 'json'>('form');
  const [h, setH] = useState<Hotel>(() => clone(initial));
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');

  useEffect(() => {
    if (open) {
      const c = clone(initial);
      setH(c);
      setJsonText(JSON.stringify(c, null, 2));
      setJsonError('');
      setMode('form');
    }
  }, [open, initial]);

  if (!open) return null;

  function update(partial: Partial<Hotel>) {
    setH(prev => ({ ...prev, ...partial }));
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
              <button type="button" onClick={() => { setJsonText(JSON.stringify(h, null, 2)); setMode('json'); }} className="px-4 py-2 text-sm border rounded-lg">
                Raw JSON
              </button>
              <button type="button" onClick={() => { onSave(h); onClose(); }} className="px-4 py-2 text-sm font-bold bg-[#003580] text-white rounded-lg">
                Save
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  try {
                    setH(clone(JSON.parse(jsonText) as Hotel));
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
                    onSave(JSON.parse(jsonText) as Hotel);
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
          <textarea value={jsonText} onChange={e => setJsonText(e.target.value)} className="w-full min-h-[400px] font-mono text-xs border rounded p-3" />
          {jsonError && <p className="text-red-600 text-sm">{jsonError}</p>}
        </div>
      ) : (
        <div className="space-y-4">
          <div className={box}>
            <p className="text-sm font-bold text-gray-900">Basics</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>ID</label>
                <input className={inputClass} value={h.id} onChange={e => update({ id: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Destination slug</label>
                <input className={inputClass} value={h.destination} onChange={e => update({ destination: e.target.value })} placeholder="e.g. kandy" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Hotel name</label>
                <input className={inputClass} value={h.name} onChange={e => update({ name: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Tier</label>
                <select className={inputClass} value={h.tier} onChange={e => update({ tier: e.target.value as HotelTier })}>
                  {TIERS.map(t => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Rating (1–5)</label>
                <input type="number" min={1} max={5} className={inputClass} value={h.rating} onChange={e => update({ rating: Number(e.target.value) || 3 })} />
              </div>
              <div>
                <label className={labelClass}>Price / night (USD)</label>
                <input type="number" min={0} className={inputClass} value={h.pricePerNight} onChange={e => update({ pricePerNight: Number(e.target.value) || 0 })} />
              </div>
              <div>
                <label className={labelClass}>Gradient</label>
                <input className={inputClass} value={h.gradient} onChange={e => update({ gradient: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Features / amenities (one per line)</label>
                <textarea
                  className={`${inputClass} min-h-[80px] font-mono text-xs`}
                  value={listToLines(h.features)}
                  onChange={e => update({ features: linesToList(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div className={box}>
            <p className="text-sm font-bold text-gray-900">Good to know — location & times</p>
            <p className="text-xs text-gray-500">What travellers see on the public hotel page.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className={labelClass}>Full address</label>
                <input className={inputClass} value={h.address ?? ''} onChange={e => update({ address: e.target.value || undefined })} placeholder="Street, city, postal code" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Tagline (short)</label>
                <input className={inputClass} value={h.tagline ?? ''} onChange={e => update({ tagline: e.target.value || undefined })} placeholder="Rooftop pool · near dining" />
              </div>
              <div>
                <label className={labelClass}>Check-in</label>
                <input className={inputClass} value={h.checkIn ?? ''} onChange={e => update({ checkIn: e.target.value || undefined })} placeholder="From 14:00" />
              </div>
              <div>
                <label className={labelClass}>Check-out</label>
                <input className={inputClass} value={h.checkOut ?? ''} onChange={e => update({ checkOut: e.target.value || undefined })} placeholder="Until 12:00" />
              </div>
              <div>
                <label className={labelClass}>Distance to centre</label>
                <input className={inputClass} value={h.distanceToCenter ?? ''} onChange={e => update({ distanceToCenter: e.target.value || undefined })} />
              </div>
              <div>
                <label className={labelClass}>Distance to beach</label>
                <input className={inputClass} value={h.distanceToBeach ?? ''} onChange={e => update({ distanceToBeach: e.target.value || undefined })} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Map link (Google Maps etc.)</label>
                <input className={inputClass} value={h.mapUrl ?? ''} onChange={e => update({ mapUrl: e.target.value || undefined })} placeholder="https://..." />
              </div>
              <div>
                <label className={labelClass}>Guest score (0–10, optional)</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  className={inputClass}
                  value={h.guestScore ?? ''}
                  onChange={e => {
                    const v = e.target.value;
                    update({ guestScore: v === '' ? undefined : Number(v) });
                  }}
                />
              </div>
              <div>
                <label className={labelClass}>Guest review count (optional)</label>
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  value={h.guestReviewCount ?? ''}
                  onChange={e => {
                    const v = e.target.value;
                    update({ guestReviewCount: v === '' ? undefined : Number(v) });
                  }}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Guest quote</label>
                <textarea className={`${inputClass} min-h-[56px]`} value={h.guestQuote ?? ''} onChange={e => update({ guestQuote: e.target.value || undefined })} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Quote attribution</label>
                <input className={inputClass} value={h.guestQuoteAttribution ?? ''} onChange={e => update({ guestQuoteAttribution: e.target.value || undefined })} placeholder="Guest from UK" />
              </div>
            </div>
          </div>

          <div className={box}>
            <p className="text-sm font-bold text-gray-900">Description & highlights</p>
            <div>
              <label className={labelClass}>Long description</label>
              <textarea
                className={`${inputClass} min-h-[120px]`}
                value={h.description ?? ''}
                onChange={e => update({ description: e.target.value || undefined })}
                placeholder="Paragraphs — blank lines separate paragraphs."
              />
            </div>
            <div>
              <label className={labelClass}>Highlight bullets (one per line)</label>
              <textarea
                className={`${inputClass} min-h-[72px] font-mono text-xs`}
                value={listToLines(h.highlights ?? [])}
                onChange={e => update({ highlights: linesToList(e.target.value).length ? linesToList(e.target.value) : undefined })}
              />
            </div>
            <div>
              <label className={labelClass}>Sustainability note (optional)</label>
              <textarea className={`${inputClass} min-h-[56px]`} value={h.sustainabilityNote ?? ''} onChange={e => update({ sustainabilityNote: e.target.value || undefined })} />
            </div>
          </div>

          <div className={box}>
            <p className="text-sm font-bold text-gray-900">Hero photo</p>
            <p className="text-xs text-gray-500">Main image at top of hotel page.</p>
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
                    } catch (err) {
                      alert(err instanceof Error ? err.message : 'Could not upload file.');
                    }
                  }}
                />
                Upload photo
              </label>
              {h.image && (
                <button type="button" className="text-sm text-red-600 font-semibold" onClick={() => update({ image: undefined })}>
                  Remove photo
                </button>
              )}
            </div>
            {h.image && <img src={h.image} alt="" className="max-h-36 rounded-lg border border-gray-200 object-cover w-full max-w-md" />}
            <div>
              <label className={labelClass}>Or path / URL</label>
              <input
                className={inputClass}
                value={h.image?.startsWith('data:') ? '' : (h.image ?? '')}
                onChange={e => update({ image: e.target.value || undefined })}
                placeholder="/images/... or https://..."
              />
            </div>
          </div>

          <div className={box}>
            <div className="flex justify-between items-center gap-2">
              <p className="text-sm font-bold text-gray-900">Gallery (extra photos)</p>
              <button
                type="button"
                className="text-sm font-semibold text-[#003580]"
                onClick={() =>
                  update({ galleryImages: [...(h.galleryImages ?? []), { label: '', src: '' } as HotelGalleryImage] })
                }
              >
                + Add image
              </button>
            </div>
            {(h.galleryImages ?? []).map((g, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3 bg-white space-y-2">
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <input
                    className={inputClass}
                    placeholder="Caption"
                    value={g.label ?? ''}
                    onChange={e => {
                      const next = [...(h.galleryImages ?? [])];
                      next[i] = { ...next[i], label: e.target.value || undefined };
                      update({ galleryImages: next });
                    }}
                  />
                  <label className="text-xs font-semibold text-[#003580] cursor-pointer">
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
                          const next = [...(h.galleryImages ?? [])];
                          next[i] = { ...next[i], src };
                          update({ galleryImages: next });
                        } catch (err) {
                          alert(err instanceof Error ? err.message : 'Upload failed');
                        }
                      }}
                    />
                    Upload
                  </label>
                  <button
                    type="button"
                    className="text-xs text-red-600 font-semibold"
                    onClick={() => {
                      const next = [...(h.galleryImages ?? [])];
                      next.splice(i, 1);
                      update({ galleryImages: next.length ? next : undefined });
                    }}
                  >
                    Remove
                  </button>
                </div>
                <input
                  className={inputClass}
                  placeholder="Path or URL"
                  value={g.src?.startsWith('data:') ? '' : (g.src ?? '')}
                  onChange={e => {
                    const next = [...(h.galleryImages ?? [])];
                    next[i] = { ...next[i], src: e.target.value };
                    update({ galleryImages: next });
                  }}
                />
                {g.src && <img src={g.src} alt="" className="max-h-24 rounded border object-cover" />}
              </div>
            ))}
          </div>

          <div className={box}>
            <div className="flex justify-between items-center gap-2">
              <p className="text-sm font-bold text-gray-900">Room types</p>
              <button
                type="button"
                className="text-sm font-semibold text-[#003580]"
                onClick={() =>
                  update({ roomTypes: [...(h.roomTypes ?? []), { name: '', beds: '', maxGuests: undefined } as HotelRoomType] })
                }
              >
                + Add room
              </button>
            </div>
            {(h.roomTypes ?? []).map((r, i) => (
              <div key={i} className="grid sm:grid-cols-3 gap-2 border border-gray-200 rounded-lg p-2 bg-white">
                <input
                  className={inputClass}
                  placeholder="Room name"
                  value={r.name}
                  onChange={e => {
                    const next = [...(h.roomTypes ?? [])];
                    next[i] = { ...next[i], name: e.target.value };
                    update({ roomTypes: next });
                  }}
                />
                <input
                  className={inputClass}
                  placeholder="Beds"
                  value={r.beds ?? ''}
                  onChange={e => {
                    const next = [...(h.roomTypes ?? [])];
                    next[i] = { ...next[i], beds: e.target.value || undefined };
                    update({ roomTypes: next });
                  }}
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={1}
                    className={inputClass}
                    placeholder="Max guests"
                    value={r.maxGuests ?? ''}
                    onChange={e => {
                      const next = [...(h.roomTypes ?? [])];
                      const v = e.target.value;
                      next[i] = { ...next[i], maxGuests: v === '' ? undefined : Number(v) };
                      update({ roomTypes: next });
                    }}
                  />
                  <button
                    type="button"
                    className="text-xs text-red-600 font-semibold px-2 shrink-0"
                    onClick={() => {
                      const next = [...(h.roomTypes ?? [])];
                      next.splice(i, 1);
                      update({ roomTypes: next.length ? next : undefined });
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={box}>
            <div className="flex justify-between items-center gap-2">
              <p className="text-sm font-bold text-gray-900">On-site restaurants</p>
              <button
                type="button"
                className="text-sm font-semibold text-[#003580]"
                onClick={() =>
                  update({ restaurants: [...(h.restaurants ?? []), { name: '' } as HotelRestaurant] })
                }
              >
                + Add
              </button>
            </div>
            {(h.restaurants ?? []).map((r, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-white">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs text-red-600 font-semibold"
                    onClick={() => {
                      const next = [...(h.restaurants ?? [])];
                      next.splice(i, 1);
                      update({ restaurants: next.length ? next : undefined });
                    }}
                  >
                    Remove
                  </button>
                </div>
                <input
                  className={inputClass}
                  placeholder="Name"
                  value={r.name}
                  onChange={e => {
                    const next = [...(h.restaurants ?? [])];
                    next[i] = { ...next[i], name: e.target.value };
                    update({ restaurants: next });
                  }}
                />
                <input
                  className={inputClass}
                  placeholder="Cuisine"
                  value={r.cuisine ?? ''}
                  onChange={e => {
                    const next = [...(h.restaurants ?? [])];
                    next[i] = { ...next[i], cuisine: e.target.value || undefined };
                    update({ restaurants: next });
                  }}
                />
                <input
                  className={inputClass}
                  placeholder="Open for (e.g. Breakfast · Lunch · Dinner)"
                  value={r.openFor ?? ''}
                  onChange={e => {
                    const next = [...(h.restaurants ?? [])];
                    next[i] = { ...next[i], openFor: e.target.value || undefined };
                    update({ restaurants: next });
                  }}
                />
                <input
                  className={inputClass}
                  placeholder="Ambiance"
                  value={r.ambiance ?? ''}
                  onChange={e => {
                    const next = [...(h.restaurants ?? [])];
                    next[i] = { ...next[i], ambiance: e.target.value || undefined };
                    update({ restaurants: next });
                  }}
                />
              </div>
            ))}
          </div>

          <div className={box}>
            <div className="flex justify-between items-center gap-2">
              <p className="text-sm font-bold text-gray-900">Surroundings (nearby)</p>
              <button
                type="button"
                className="text-sm font-semibold text-[#003580]"
                onClick={() =>
                  update({
                    surroundings: [...(h.surroundings ?? []), { category: '', places: [] } as HotelSurroundingsGroup],
                  })
                }
              >
                + Add category
              </button>
            </div>
            {(h.surroundings ?? []).map((grp, gi) => (
              <div key={gi} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-white">
                <div className="flex gap-2">
                  <input
                    className={inputClass}
                    placeholder="Category (e.g. Top attractions)"
                    value={grp.category}
                    onChange={e => {
                      const next = [...(h.surroundings ?? [])];
                      next[gi] = { ...next[gi], category: e.target.value };
                      update({ surroundings: next });
                    }}
                  />
                  <button
                    type="button"
                    className="text-xs text-red-600 font-semibold shrink-0"
                    onClick={() => {
                      const next = [...(h.surroundings ?? [])];
                      next.splice(gi, 1);
                      update({ surroundings: next.length ? next : undefined });
                    }}
                  >
                    Remove category
                  </button>
                </div>
                {(grp.places ?? []).map((p, pi) => (
                  <div key={pi} className="flex gap-2 flex-wrap">
                    <input
                      className={`${inputClass} flex-1 min-w-[120px]`}
                      placeholder="Place name"
                      value={p.name}
                      onChange={e => {
                        const next = [...(h.surroundings ?? [])];
                        const places = [...(next[gi].places ?? [])];
                        places[pi] = { ...places[pi], name: e.target.value };
                        next[gi] = { ...next[gi], places };
                        update({ surroundings: next });
                      }}
                    />
                    <input
                      className={`${inputClass} w-28`}
                      placeholder="Distance"
                      value={p.distance}
                      onChange={e => {
                        const next = [...(h.surroundings ?? [])];
                        const places = [...(next[gi].places ?? [])];
                        places[pi] = { ...places[pi], distance: e.target.value };
                        next[gi] = { ...next[gi], places };
                        update({ surroundings: next });
                      }}
                    />
                    <button
                      type="button"
                      className="text-xs text-red-600 font-semibold"
                      onClick={() => {
                        const next = [...(h.surroundings ?? [])];
                        const places = [...(next[gi].places ?? [])];
                        places.splice(pi, 1);
                        next[gi] = { ...next[gi], places };
                        update({ surroundings: next });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="text-xs font-semibold text-[#003580]"
                  onClick={() => {
                    const next = [...(h.surroundings ?? [])];
                    const places = [...(next[gi].places ?? []), { name: '', distance: '' } as HotelNearbyPlace];
                    next[gi] = { ...next[gi], places };
                    update({ surroundings: next });
                  }}
                >
                  + Place in this category
                </button>
              </div>
            ))}
          </div>

          <div className={box}>
            <div className="flex justify-between items-center gap-2">
              <p className="text-sm font-bold text-gray-900">FAQs</p>
              <button
                type="button"
                className="text-sm font-semibold text-[#003580]"
                onClick={() => update({ faqs: [...(h.faqs ?? []), { question: '', answer: '' } as HotelFaq] })}
              >
                + Add FAQ
              </button>
            </div>
            {(h.faqs ?? []).map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-white">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs text-red-600 font-semibold"
                    onClick={() => {
                      const next = [...(h.faqs ?? [])];
                      next.splice(i, 1);
                      update({ faqs: next.length ? next : undefined });
                    }}
                  >
                    Remove
                  </button>
                </div>
                <input
                  className={inputClass}
                  placeholder="Question"
                  value={faq.question}
                  onChange={e => {
                    const next = [...(h.faqs ?? [])];
                    next[i] = { ...next[i], question: e.target.value };
                    update({ faqs: next });
                  }}
                />
                <textarea
                  className={`${inputClass} min-h-[72px]`}
                  placeholder="Answer"
                  value={faq.answer}
                  onChange={e => {
                    const next = [...(h.faqs ?? [])];
                    next[i] = { ...next[i], answer: e.target.value };
                    update({ faqs: next });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminModalShell>
  );
}
