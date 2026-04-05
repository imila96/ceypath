import React, { useEffect, useState } from 'react';
import AdminModalShell from './AdminModalShell';
import { linesToList, listToLines, uploadCatalogImage } from './formUtils';
import type {
  TourPackage,
  PackageType,
  PackageBadge,
  ItineraryDay,
  ItineraryHotelOption,
  AddOn,
  GalleryImage,
} from '../../data/packages';

const PACKAGE_TYPES: PackageType[] = ['budget', 'standard', 'premium', 'luxury'];
const BADGES: PackageBadge[] = ['BESTSELLER', 'NEW', 'LIMITED', 'HOT DEAL'];

type Props = {
  open: boolean;
  title: string;
  initial: TourPackage;
  onClose: () => void;
  onSave: (pkg: TourPackage) => void;
};

function clonePkg(p: TourPackage): TourPackage {
  return JSON.parse(JSON.stringify(p)) as TourPackage;
}

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#003580]';
const labelClass = 'block text-xs font-semibold text-gray-600 mb-1';
const sectionClass = 'border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-3';

export default function PackageFormModal({ open, title, initial, onClose, onSave }: Props) {
  const [mode, setMode] = useState<'form' | 'json'>('form');
  const [pkg, setPkg] = useState<TourPackage>(() => clonePkg(initial));
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');

  useEffect(() => {
    if (open) {
      const c = clonePkg(initial);
      setPkg(c);
      setJsonText(JSON.stringify(c, null, 2));
      setJsonError('');
      setMode('form');
    }
  }, [open, initial]);

  if (!open) return null;

  function update(partial: Partial<TourPackage>) {
    setPkg(prev => ({ ...prev, ...partial }));
  }

  function saveForm() {
    onSave(pkg);
    onClose();
  }

  function saveJson() {
    setJsonError('');
    try {
      const parsed = JSON.parse(jsonText) as unknown;
      if (typeof parsed !== 'object' || parsed === null || typeof (parsed as TourPackage).id !== 'string') {
        throw new Error('Package must have an id');
      }
      onSave(parsed as TourPackage);
      onClose();
    } catch (e) {
      setJsonError(e instanceof Error ? e.message : 'Invalid JSON');
    }
  }

  function syncJsonToForm() {
    try {
      const parsed = JSON.parse(jsonText) as TourPackage;
      setPkg(clonePkg(parsed));
      setMode('form');
    } catch {
      alert('Fix JSON errors before switching back to the form.');
    }
  }

  const destLine = pkg.destinations.join(', ');

  return (
    <AdminModalShell
      title={title}
      onClose={onClose}
      wide
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          {mode === 'form' ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setJsonText(JSON.stringify(pkg, null, 2));
                  setMode('json');
                }}
                className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Raw JSON
              </button>
              <button
                type="button"
                onClick={saveForm}
                className="px-4 py-2 text-sm font-bold bg-[#003580] text-white rounded-lg hover:bg-[#002560]"
              >
                Save package
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={syncJsonToForm}
                className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Back to form
              </button>
              <button
                type="button"
                onClick={saveJson}
                className="px-4 py-2 text-sm font-bold bg-[#003580] text-white rounded-lg hover:bg-[#002560]"
              >
                Save JSON
              </button>
            </>
          )}
        </>
      }
    >
      {mode === 'json' ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Full document as JSON. Use when you need fields not shown in the form.
          </p>
          <textarea
            value={jsonText}
            onChange={e => setJsonText(e.target.value)}
            className="w-full min-h-[420px] font-mono text-xs border border-gray-200 rounded-lg p-3"
            spellCheck={false}
          />
          {jsonError && <p className="text-sm text-red-600">{jsonError}</p>}
        </div>
      ) : (
        <div className="space-y-5">
          <p className="text-sm text-gray-600">
            Fill in the fields below. Lists use <strong>one item per line</strong>. Destinations use comma-separated names.
          </p>

          <div className={sectionClass}>
            <p className="text-sm font-bold text-gray-900">Basics</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>ID (URL slug segment)</label>
                <input className={inputClass} value={pkg.id} onChange={e => update({ id: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Display name</label>
                <input className={inputClass} value={pkg.name} onChange={e => update({ name: e.target.value })} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Short description (listings)</label>
              <textarea
                className={`${inputClass} min-h-[72px]`}
                value={pkg.shortDescription}
                onChange={e => update({ shortDescription: e.target.value })}
              />
            </div>
          </div>

          <div className={sectionClass}>
            <p className="text-sm font-bold text-gray-900">Trip & pricing</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className={labelClass}>Days</label>
                <input
                  type="number"
                  min={1}
                  className={inputClass}
                  value={pkg.days}
                  onChange={e => update({ days: Number(e.target.value) || 1 })}
                />
              </div>
              <div>
                <label className={labelClass}>Nights</label>
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  value={pkg.nights}
                  onChange={e => update({ nights: Number(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className={labelClass}>Type</label>
                <select
                  className={inputClass}
                  value={pkg.type}
                  onChange={e => update({ type: e.target.value as PackageType })}
                >
                  {PACKAGE_TYPES.map(t => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Default vehicle (name)</label>
                <input className={inputClass} value={pkg.vehicle} onChange={e => update({ vehicle: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Price (USD)</label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  className={inputClass}
                  value={pkg.price}
                  onChange={e => update({ price: Number(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className={labelClass}>Original price</label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  className={inputClass}
                  value={pkg.originalPrice}
                  onChange={e => update({ originalPrice: Number(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className={labelClass}>Rating (0–5)</label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  className={inputClass}
                  value={pkg.rating}
                  onChange={e => update({ rating: Number(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className={labelClass}>Review count</label>
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  value={pkg.reviewCount}
                  onChange={e => update({ reviewCount: Number(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className={labelClass}>Hotel rating (1–5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  className={inputClass}
                  value={pkg.hotelRating}
                  onChange={e => update({ hotelRating: Number(e.target.value) || 4 })}
                />
              </div>
              <div>
                <label className={labelClass}>Spots left (optional)</label>
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  value={pkg.spotsLeft ?? ''}
                  onChange={e => {
                    const v = e.target.value;
                    update({ spotsLeft: v === '' ? undefined : Number(v) });
                  }}
                  placeholder="Leave empty to hide"
                />
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <p className="text-sm font-bold text-gray-900">Display</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Badge</label>
                <select
                  className={inputClass}
                  value={pkg.badge}
                  onChange={e => update({ badge: e.target.value as PackageBadge })}
                >
                  {BADGES.map(b => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Gradient (Tailwind classes)</label>
                <input className={inputClass} value={pkg.gradient} onChange={e => update({ gradient: e.target.value })} />
              </div>
            </div>
            <div className="flex flex-wrap gap-6 pt-1">
              <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pkg.featured}
                  onChange={e => update({ featured: e.target.checked })}
                  className="rounded border-gray-300"
                />
                Featured on listings
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!pkg.highlighted}
                  onChange={e => update({ highlighted: e.target.checked })}
                  className="rounded border-gray-300"
                />
                Highlighted on homepage strip
              </label>
            </div>
          </div>

          <div className={sectionClass}>
            <p className="text-sm font-bold text-gray-900">Destinations & bullet lists</p>
            <div>
              <label className={labelClass}>Destinations (comma-separated)</label>
              <input
                className={inputClass}
                value={destLine}
                onChange={e =>
                  update({
                    destinations: e.target.value
                      .split(',')
                      .map(s => s.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="Colombo, Kandy, Sigiriya"
              />
            </div>
            <div>
              <label className={labelClass}>Highlights (one per line)</label>
              <textarea
                className={`${inputClass} min-h-[88px] font-mono text-xs`}
                value={listToLines(pkg.highlights)}
                onChange={e => update({ highlights: linesToList(e.target.value) })}
              />
            </div>
            <div>
              <label className={labelClass}>Inclusions (one per line)</label>
              <textarea
                className={`${inputClass} min-h-[88px] font-mono text-xs`}
                value={listToLines(pkg.inclusions)}
                onChange={e => update({ inclusions: linesToList(e.target.value) })}
              />
            </div>
            <div>
              <label className={labelClass}>Exclusions (one per line)</label>
              <textarea
                className={`${inputClass} min-h-[88px] font-mono text-xs`}
                value={listToLines(pkg.exclusions)}
                onChange={e => update({ exclusions: linesToList(e.target.value) })}
              />
            </div>
          </div>

          <div className={sectionClass}>
            <p className="text-sm font-bold text-gray-900">Images</p>
            <p className="text-xs text-gray-500">
              Upload files here (stored in your browser catalog as embedded data) or paste a path/URL such as{' '}
              <code className="bg-white px-1 rounded">/images/tourism/sigiriya.jpg</code>. Keep uploads under ~2.5MB so
              localStorage does not run out of space.
            </p>
            <div>
              <label className={labelClass}>Cover image</label>
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
                        alert(e instanceof Error ? e.message : 'Could not upload that file.');
                      }
                    }}
                  />
                  Upload cover
                </label>
                {pkg.coverImage && (
                  <button
                    type="button"
                    className="text-sm text-red-600 font-semibold"
                    onClick={() => update({ coverImage: undefined })}
                  >
                    Remove cover
                  </button>
                )}
              </div>
              {pkg.coverImage && (
                <div className="mt-3 flex gap-3 items-start">
                  <img
                    src={pkg.coverImage}
                    alt="Cover preview"
                    className="max-h-36 rounded-lg border border-gray-200 object-cover max-w-full"
                  />
                </div>
              )}
              <label className={`${labelClass} mt-3`}>Or path / URL (not both needed if you uploaded)</label>
              <input
                className={inputClass}
                value={pkg.coverImage?.startsWith('data:') ? '' : (pkg.coverImage ?? '')}
                onChange={e => update({ coverImage: e.target.value || undefined })}
                placeholder="/images/tourism/sigiriya.jpg or https://..."
              />
            </div>
            <div className="space-y-3">
              <label className={labelClass}>Gallery</label>
              {(pkg.galleryImages ?? []).map((g, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-3 bg-white space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      className={inputClass}
                      placeholder="Caption / label"
                      value={g.label}
                      onChange={e => {
                        const next = [...(pkg.galleryImages ?? [])];
                        next[i] = { ...next[i], label: e.target.value };
                        update({ galleryImages: next });
                      }}
                    />
                    <label className="inline-flex items-center justify-center px-3 py-2 border border-[#003580] text-[#003580] text-sm font-semibold rounded-lg cursor-pointer hover:bg-blue-50 shrink-0">
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
                            const next = [...(pkg.galleryImages ?? [])];
                            next[i] = { ...next[i], src };
                            update({ galleryImages: next });
                          } catch (e) {
                            alert(e instanceof Error ? e.message : 'Could not upload that file.');
                          }
                        }}
                      />
                      Upload
                    </label>
                    <button
                      type="button"
                      className="text-sm text-red-600 font-semibold px-2"
                      onClick={() => {
                        const next = [...(pkg.galleryImages ?? [])];
                        next.splice(i, 1);
                        update({ galleryImages: next.length ? next : undefined });
                      }}
                    >
                      Remove row
                    </button>
                  </div>
                  <input
                    className={inputClass}
                    placeholder="Path or URL (if not using upload above)"
                    value={g.src?.startsWith('data:') ? '' : (g.src ?? '')}
                    onChange={e => {
                      const next = [...(pkg.galleryImages ?? [])];
                      next[i] = { ...next[i], src: e.target.value };
                      update({ galleryImages: next });
                    }}
                  />
                  {g.src && (
                    <img src={g.src} alt="" className="max-h-28 rounded border object-cover" />
                  )}
                </div>
              ))}
              <button
                type="button"
                className="text-sm font-semibold text-[#003580]"
                onClick={() =>
                  update({
                    galleryImages: [...(pkg.galleryImages ?? []), { label: '', src: '' } as GalleryImage],
                  })
                }
              >
                + Add gallery image
              </button>
            </div>
          </div>

          <div className={sectionClass}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-gray-900">Itinerary days</p>
              <button
                type="button"
                className="text-sm font-semibold text-[#003580]"
                onClick={() => {
                  const dayNum = (pkg.itinerary?.length ?? 0) + 1;
                  const row: ItineraryDay = {
                    day: dayNum,
                    title: `Day ${dayNum}`,
                    morning: '',
                    afternoon: '',
                    evening: '',
                    hotel: '',
                    meals: [],
                    distance: '—',
                  };
                  update({ itinerary: [...(pkg.itinerary ?? []), row] });
                }}
              >
                + Add day
              </button>
            </div>
            {(pkg.itinerary ?? []).map((day, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3 bg-white space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500">Day {day.day}</span>
                  <button
                    type="button"
                    className="text-xs text-red-600 font-semibold"
                    onClick={() => {
                      const next = [...(pkg.itinerary ?? [])];
                      next.splice(i, 1);
                      update({ itinerary: next });
                    }}
                  >
                    Remove day
                  </button>
                </div>
                <input
                  className={inputClass}
                  placeholder="Title"
                  value={day.title}
                  onChange={e => {
                    const next = [...(pkg.itinerary ?? [])];
                    next[i] = { ...next[i], title: e.target.value };
                    update({ itinerary: next });
                  }}
                />
                <div className="grid sm:grid-cols-3 gap-2">
                  <textarea
                    className={`${inputClass} min-h-[60px] text-xs`}
                    placeholder="Morning"
                    value={day.morning}
                    onChange={e => {
                      const next = [...(pkg.itinerary ?? [])];
                      next[i] = { ...next[i], morning: e.target.value };
                      update({ itinerary: next });
                    }}
                  />
                  <textarea
                    className={`${inputClass} min-h-[60px] text-xs`}
                    placeholder="Afternoon"
                    value={day.afternoon}
                    onChange={e => {
                      const next = [...(pkg.itinerary ?? [])];
                      next[i] = { ...next[i], afternoon: e.target.value };
                      update({ itinerary: next });
                    }}
                  />
                  <textarea
                    className={`${inputClass} min-h-[60px] text-xs`}
                    placeholder="Evening"
                    value={day.evening}
                    onChange={e => {
                      const next = [...(pkg.itinerary ?? [])];
                      next[i] = { ...next[i], evening: e.target.value };
                      update({ itinerary: next });
                    }}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  <input
                    className={inputClass}
                    placeholder="Default hotel label (fallback if no options below)"
                    value={day.hotel}
                    onChange={e => {
                      const next = [...(pkg.itinerary ?? [])];
                      next[i] = { ...next[i], hotel: e.target.value };
                      update({ itinerary: next });
                    }}
                  />
                  <input
                    className={inputClass}
                    placeholder="Distance"
                    value={day.distance}
                    onChange={e => {
                      const next = [...(pkg.itinerary ?? [])];
                      next[i] = { ...next[i], distance: e.target.value };
                      update({ itinerary: next });
                    }}
                  />
                </div>
                <div>
                  <label className={labelClass}>Meals (one per line)</label>
                  <textarea
                    className={`${inputClass} min-h-[52px] font-mono text-xs`}
                    placeholder="Breakfast"
                    value={listToLines(day.meals ?? [])}
                    onChange={e => {
                      const next = [...(pkg.itinerary ?? [])];
                      next[i] = { ...next[i], meals: linesToList(e.target.value) };
                      update({ itinerary: next });
                    }}
                  />
                </div>

                <div className="border-t border-gray-100 pt-2 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-gray-600">Day gallery</span>
                    <button
                      type="button"
                      className="text-xs font-semibold text-[#003580]"
                      onClick={() => {
                        const next = [...(pkg.itinerary ?? [])];
                        const g = [...(next[i].gallery ?? []), { label: '', src: '' } as GalleryImage];
                        next[i] = { ...next[i], gallery: g.length ? g : undefined };
                        update({ itinerary: next });
                      }}
                    >
                      + Image
                    </button>
                  </div>
                  {(day.gallery ?? []).map((img, gi) => (
                    <div key={gi} className="border border-gray-100 rounded-lg p-2 space-y-1 bg-gray-50/50">
                      <div className="flex flex-wrap gap-2 items-center justify-between">
                        <input
                          className={`${inputClass} flex-1 min-w-[120px]`}
                          placeholder="Caption"
                          value={img.label}
                          onChange={e => {
                            const next = [...(pkg.itinerary ?? [])];
                            const g = [...(next[i].gallery ?? [])];
                            g[gi] = { ...g[gi], label: e.target.value };
                            next[i] = { ...next[i], gallery: g };
                            update({ itinerary: next });
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
                                const next = [...(pkg.itinerary ?? [])];
                                const g = [...(next[i].gallery ?? [])];
                                g[gi] = { ...g[gi], src };
                                next[i] = { ...next[i], gallery: g };
                                update({ itinerary: next });
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
                            const next = [...(pkg.itinerary ?? [])];
                            const g = [...(next[i].gallery ?? [])];
                            g.splice(gi, 1);
                            next[i] = { ...next[i], gallery: g.length ? g : undefined };
                            update({ itinerary: next });
                          }}
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        className={inputClass}
                        placeholder="Path or URL"
                        value={img.src?.startsWith('data:') ? '' : (img.src ?? '')}
                        onChange={e => {
                          const next = [...(pkg.itinerary ?? [])];
                          const g = [...(next[i].gallery ?? [])];
                          g[gi] = { ...g[gi], src: e.target.value };
                          next[i] = { ...next[i], gallery: g };
                          update({ itinerary: next });
                        }}
                      />
                      {img.src && <img src={img.src} alt="" className="max-h-24 rounded border object-cover" />}
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-2 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-gray-600">Hotel options (name, summary, price)</span>
                    <button
                      type="button"
                      className="text-xs font-semibold text-[#003580]"
                      onClick={() => {
                        const next = [...(pkg.itinerary ?? [])];
                        const ho = [...(next[i].hotelOptions ?? []), { name: '', summary: '' } as ItineraryHotelOption];
                        next[i] = { ...next[i], hotelOptions: ho };
                        update({ itinerary: next });
                      }}
                    >
                      + Hotel
                    </button>
                  </div>
                  {(day.hotelOptions ?? []).map((ho, hi) => (
                    <div key={hi} className="border border-gray-200 rounded-lg p-2 space-y-2 bg-white">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="text-xs text-red-600 font-semibold"
                          onClick={() => {
                            const next = [...(pkg.itinerary ?? [])];
                            const list = [...(next[i].hotelOptions ?? [])];
                            list.splice(hi, 1);
                            next[i] = { ...next[i], hotelOptions: list.length ? list : undefined };
                            update({ itinerary: next });
                          }}
                        >
                          Remove hotel
                        </button>
                      </div>
                      <input
                        className={inputClass}
                        placeholder="Hotel name"
                        value={ho.name}
                        onChange={e => {
                          const next = [...(pkg.itinerary ?? [])];
                          const list = [...(next[i].hotelOptions ?? [])];
                          list[hi] = { ...list[hi], name: e.target.value };
                          next[i] = { ...next[i], hotelOptions: list };
                          update({ itinerary: next });
                        }}
                      />
                      <textarea
                        className={`${inputClass} min-h-[56px] text-xs`}
                        placeholder="Short summary for guests"
                        value={ho.summary}
                        onChange={e => {
                          const next = [...(pkg.itinerary ?? [])];
                          const list = [...(next[i].hotelOptions ?? [])];
                          list[hi] = { ...list[hi], summary: e.target.value };
                          next[i] = { ...next[i], hotelOptions: list };
                          update({ itinerary: next });
                        }}
                      />
                      <div className="flex flex-wrap gap-2 items-end">
                        <div className="w-32">
                          <label className={labelClass}>$/night (optional)</label>
                          <input
                            type="number"
                            min={0}
                            className={inputClass}
                            value={ho.pricePerNight ?? ''}
                            onChange={e => {
                              const next = [...(pkg.itinerary ?? [])];
                              const list = [...(next[i].hotelOptions ?? [])];
                              const v = e.target.value;
                              list[hi] = {
                                ...list[hi],
                                pricePerNight: v === '' ? undefined : Number(v) || 0,
                              };
                              next[i] = { ...next[i], hotelOptions: list };
                              update({ itinerary: next });
                            }}
                          />
                        </div>
                        <label className="inline-flex items-center gap-2 px-2 py-1.5 border border-[#003580] text-[#003580] text-xs font-semibold rounded cursor-pointer hover:bg-blue-50">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async e => {
                              const f = e.target.files?.[0];
                              e.target.value = '';
                              if (!f) return;
                              try {
                                const image = await uploadCatalogImage(f);
                                const next = [...(pkg.itinerary ?? [])];
                                const list = [...(next[i].hotelOptions ?? [])];
                                list[hi] = { ...list[hi], image };
                                next[i] = { ...next[i], hotelOptions: list };
                                update({ itinerary: next });
                              } catch (err) {
                                alert(err instanceof Error ? err.message : 'Upload failed');
                              }
                            }}
                          />
                          Upload image
                        </label>
                      </div>
                      <input
                        className={inputClass}
                        placeholder="Image path or URL"
                        value={ho.image?.startsWith('data:') ? '' : (ho.image ?? '')}
                        onChange={e => {
                          const next = [...(pkg.itinerary ?? [])];
                          const list = [...(next[i].hotelOptions ?? [])];
                          list[hi] = { ...list[hi], image: e.target.value || undefined };
                          next[i] = { ...next[i], hotelOptions: list };
                          update({ itinerary: next });
                        }}
                      />
                      {ho.image && <img src={ho.image} alt="" className="max-h-24 rounded border object-cover" />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={sectionClass}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-gray-900">Add-ons</p>
              <button
                type="button"
                className="text-sm font-semibold text-[#003580]"
                onClick={() => {
                  const row: AddOn = {
                    id: `addon-${Date.now()}`,
                    name: 'New add-on',
                    pricePerPerson: 0,
                    included: false,
                  };
                  update({ addOns: [...(pkg.addOns ?? []), row] });
                }}
              >
                + Add add-on
              </button>
            </div>
            {(pkg.addOns ?? []).map((a, i) => (
              <div key={a.id} className="flex flex-wrap gap-2 items-end border border-gray-200 rounded-lg p-3 bg-white">
                <div className="flex-1 min-w-[120px]">
                  <label className={labelClass}>ID</label>
                  <input
                    className={inputClass}
                    value={a.id}
                    onChange={e => {
                      const next = [...(pkg.addOns ?? [])];
                      next[i] = { ...next[i], id: e.target.value };
                      update({ addOns: next });
                    }}
                  />
                </div>
                <div className="flex-[2] min-w-[160px]">
                  <label className={labelClass}>Name</label>
                  <input
                    className={inputClass}
                    value={a.name}
                    onChange={e => {
                      const next = [...(pkg.addOns ?? [])];
                      next[i] = { ...next[i], name: e.target.value };
                      update({ addOns: next });
                    }}
                  />
                </div>
                <div className="w-28">
                  <label className={labelClass}>Price / person</label>
                  <input
                    type="number"
                    min={0}
                    className={inputClass}
                    value={a.pricePerPerson}
                    onChange={e => {
                      const next = [...(pkg.addOns ?? [])];
                      next[i] = { ...next[i], pricePerPerson: Number(e.target.value) || 0 };
                      update({ addOns: next });
                    }}
                  />
                </div>
                <label className="flex items-center gap-2 text-sm pb-2">
                  <input
                    type="checkbox"
                    checked={a.included}
                    onChange={e => {
                      const next = [...(pkg.addOns ?? [])];
                      next[i] = { ...next[i], included: e.target.checked };
                      update({ addOns: next });
                    }}
                  />
                  Included
                </label>
                <button
                  type="button"
                  className="text-sm text-red-600 font-semibold px-2 pb-2"
                  onClick={() => {
                    const next = [...(pkg.addOns ?? [])];
                    next.splice(i, 1);
                    update({ addOns: next });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminModalShell>
  );
}
