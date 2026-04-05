import type { TourPackage } from '../data/packages';
import { buildCustomItineraryPdf, buildPackageItineraryPdf } from './itineraryPdfVector';
import type { CatalogSnapshot } from '../catalog/catalogStore';
import type { CustomizerState } from './priceCalculator';
import { formatCurrency } from './formatters';
import type { Currency } from './formatters';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Readable place name for PDF (e.g. colombo → Colombo). */
function prettifyPlace(s: string): string {
  return s
    .trim()
    .split(/[\s,/]+/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

/** Styles for HTML itinerary fallback / print in browser (PDF uses vector export in itineraryPdfVector). */
function docStyles(): string {
  return `
  * { box-sizing: border-box; }
  body {
    font-family: 'Plus Jakarta Sans', 'Segoe UI', system-ui, -apple-system, sans-serif;
    color: #1e293b;
    line-height: 1.5;
    margin: 0;
    padding: 20px;
    background: #e2e8f0;
    -webkit-font-smoothing: antialiased;
  }
  .sheet {
    max-width: 820px;
    margin: 0 auto;
    background: #ffffff;
    padding: 0;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0,53,128,.12);
    border: 1px solid #cbd5e1;
  }
  .sheet-inner { padding: 32px 36px 40px; }
  .doc-hero {
    background: #003580;
    color: #ffffff;
    padding: 28px 36px 32px;
    border-bottom: 4px solid #E32636;
  }
  .doc-hero .brand { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; color: #ffffff; margin: 0 0 8px; }
  .doc-hero .brand em { font-style: normal; color: #fecaca; }
  .doc-hero h1 {
    font-size: 24px;
    font-weight: 800;
    color: #ffffff;
    margin: 0 0 6px;
    line-height: 1.2;
  }
  .doc-hero .subtitle { color: #bfdbfe; font-size: 14px; margin: 0 0 0; }
  .ref-strip {
    margin-top: 20px;
    padding: 16px 18px;
    background: #ffffff;
    border-radius: 8px;
    border: 2px solid #bfdbfe;
  }
  .ref-strip table { width: 100%; border-collapse: collapse; }
  .ref-strip td { vertical-align: middle; padding: 0; }
  .ref-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .12em; color: #003580; }
  .ref-value { font-size: 22px; font-weight: 800; letter-spacing: .14em; color: #003580; padding-top: 4px; }
  .ref-date { font-size: 12px; color: #64748b; text-align: right; }
  h1.page-title { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 6px; line-height: 1.25; }
  p.subtitle { color: #64748b; font-size: 14px; margin: 0 0 16px; }
  .pill-row { margin-top: 12px; }
  .pill {
    display: inline-block;
    font-size: 11px;
    background: #eff6ff;
    color: #003580;
    padding: 6px 12px;
    border-radius: 999px;
    border: 1px solid #93c5fd;
    font-weight: 700;
    margin: 0 6px 6px 0;
  }
  .section { margin-top: 28px; }
  .section h2 {
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: .14em;
    color: #003580;
    margin: 0 0 12px;
    padding-bottom: 8px;
    border-bottom: 2px solid #003580;
  }
  table.kv {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    overflow: hidden;
  }
  table.kv td {
    padding: 12px 14px;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: top;
  }
  table.kv tr:last-child td { border-bottom: none; }
  table.kv td.k { width: 38%; background: #f1f5f9; font-weight: 700; color: #334155; }
  table.kv td.v { background: #ffffff; font-weight: 600; color: #0f172a; }
  table.kv tr:nth-child(even) td.k { background: #e8eef4; }
  table.kv tr:nth-child(even) td.v { background: #fafbfc; }
  table.kv tr.emphasis td.k,
  table.kv tr.emphasis td.v {
    background: #eff6ff !important;
    font-size: 15px;
    font-weight: 800;
    color: #003580;
    border-top: 2px solid #003580;
  }
  table.data {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    table-layout: fixed;
    border: 1px solid #003580;
  }
  table.data thead th {
    background: #003580;
    color: #ffffff;
    font-weight: 800;
    text-align: left;
    padding: 12px 10px;
    border: 1px solid #002855;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: .06em;
  }
  table.data tbody td {
    padding: 10px 10px;
    border: 1px solid #cbd5e1;
    vertical-align: top;
    word-wrap: break-word;
    background: #ffffff;
  }
  table.data tbody tr:nth-child(even) td { background: #f8fafc; }
  .col-d { width: 30%; }
  .col-n { width: 14%; }
  .col-t { width: 14%; }
  .col-h { width: 42%; }
  table.sum { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 8px; }
  table.sum td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
  table.sum td:last-child { text-align: right; font-weight: 700; color: #0f172a; }
  table.sum tr.total td {
    border-bottom: none;
    border-top: 2px solid #003580;
    font-size: 17px;
    font-weight: 800;
    color: #003580;
    background: #eff6ff;
    padding: 14px 12px;
  }
  .activities { margin: 0; padding: 0; list-style: none; }
  .activities li {
    margin: 0 0 10px;
    padding: 12px 14px 12px 16px;
    border: 1px solid #e2e8f0;
    border-left: 4px solid #E32636;
    border-radius: 0 8px 8px 0;
    background: linear-gradient(90deg, #fff5f5 0%, #ffffff 48%);
    font-size: 13px;
    color: #334155;
  }
  .activities li strong { color: #003580; font-weight: 800; display: block; margin-bottom: 4px; font-size: 14px; }
  .act-meta { font-size: 12px; color: #64748b; }
  .act-price { color: #003580; font-weight: 800; }
  .day { border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px; margin-bottom: 14px; page-break-inside: avoid; background: #f8fafc; }
  .day-head { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
  .day-head td { vertical-align: top; padding: 0; }
  .day-num {
    width: 40px;
    height: 40px;
    background: #003580;
    color: #fff;
    border-radius: 50%;
    text-align: center;
    font-weight: 800;
    font-size: 16px;
    line-height: 40px;
  }
  .day-title { font-weight: 800; font-size: 16px; color: #0f172a; padding: 8px 0 0 14px; }
  .slot { margin-top: 12px; font-size: 13px; color: #374151; }
  .slot-label { display: inline-block; min-width: 88px; font-weight: 800; font-size: 9px; text-transform: uppercase; letter-spacing: .06em; padding: 4px 8px; border-radius: 4px; margin-right: 8px; vertical-align: top; }
  .m { background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; }
  .a { background: #dbeafe; color: #1e40af; border: 1px solid #93c5fd; }
  .e { background: #f3e8ff; color: #6b21a8; border: 1px solid #d8b4fe; }
  .hotel-line { margin-top: 14px; padding-top: 14px; border-top: 1px dashed #94a3b8; font-size: 13px; color: #475569; }
  .hotel-line strong { color: #003580; }
  .two-col { display: table; width: 100%; border-collapse: separate; border-spacing: 20px 0; }
  .two-col > div { display: table-cell; width: 50%; vertical-align: top; }
  ul.clean { margin: 8px 0 0; padding-left: 20px; font-size: 13px; color: #334155; }
  ul.clean li { margin-bottom: 6px; }
  .footer {
    margin-top: 32px;
    padding: 18px 20px;
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 11px;
    color: #64748b;
    text-align: center;
    line-height: 1.65;
  }
  .footer strong { color: #003580; }
  @media print {
    body { background: #fff; padding: 0; }
    .sheet { box-shadow: none; border: none; border-radius: 0; }
  }
`;
}

function docFontLinks(): string {
  return `<link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />`;
}

export function downloadItineraryHtml(filename: string, html: string): void {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function safeFilePart(s: string): string {
  return s.replace(/[^\w\-]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'itinerary';
}

export function itineraryFilename(prefix: string, ref?: string, ext: 'pdf' | 'html' = 'pdf'): string {
  const r = ref ? safeFilePart(ref) : 'draft';
  return `LankaTrips-${prefix}-${r}.${ext}`;
}

function hotelLineForDay(day: TourPackage['itinerary'][number]): string {
  if (day.hotelOptions && day.hotelOptions.length > 0) {
    return day.hotelOptions
      .map(h => `${escapeHtml(h.name)}${h.summary ? ` — ${escapeHtml(h.summary)}` : ''}`)
      .join('<br/>');
  }
  return day.hotel ? escapeHtml(day.hotel) : '—';
}

export function buildPackageItineraryHtml(opts: {
  pkg: TourPackage;
  bookingRef?: string;
  adults?: number;
  children?: number;
  currency?: Currency;
  estimatedTotal?: number;
}): string {
  const { pkg, bookingRef, adults = 2, children = 0, currency = 'USD', estimatedTotal } = opts;
  const generated = new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

  const daysHtml = pkg.itinerary
    .map(day => {
      const slots: string[] = [];
      if (day.morning?.trim()) {
        slots.push(
          `<div class="slot"><span class="slot-label m">Morning</span>${escapeHtml(day.morning.trim())}</div>`
        );
      }
      if (day.afternoon?.trim()) {
        slots.push(
          `<div class="slot"><span class="slot-label a">Afternoon</span>${escapeHtml(day.afternoon.trim())}</div>`
        );
      }
      if (day.evening?.trim()) {
        slots.push(
          `<div class="slot"><span class="slot-label e">Evening</span>${escapeHtml(day.evening.trim())}</div>`
        );
      }
      const meals = (day.meals ?? []).length ? escapeHtml(day.meals.join(', ')) : '—';
      const dist = day.distance ? escapeHtml(day.distance) : '—';
      const hotelBlock =
        hotelLineForDay(day) !== '—'
          ? `<div class="hotel-line"><strong>Stay & logistics</strong><br/>🏨 ${hotelLineForDay(day)}<br/>🍽️ Meals: ${meals} · 📏 ${dist}</div>`
          : '';

      return `
      <div class="day">
        <table class="day-head" cellpadding="0" cellspacing="0"><tr>
          <td style="width:52px;"><div class="day-num">${day.day}</div></td>
          <td><div class="day-title">${escapeHtml(day.title)}</div></td>
        </tr></table>
        ${slots.join('') || '<p class="slot" style="color:#94a3b8;font-size:13px;">(No timed entries for this day)</p>'}
        ${hotelBlock}
      </div>`;
    })
    .join('');

  const inc = pkg.inclusions.map(i => `<li>${escapeHtml(i)}</li>`).join('');
  const exc = pkg.exclusions.map(i => `<li>${escapeHtml(i)}</li>`).join('');

  const travellerKv = `
    <table class="kv">
      <tr><td class="k">Adults</td><td class="v">${adults}</td></tr>
      <tr><td class="k">Children</td><td class="v">${children}</td></tr>
      ${
        estimatedTotal != null
          ? `<tr><td class="k">Estimated total (incl. taxes)</td><td class="v">${formatCurrency(estimatedTotal, currency)}</td></tr>`
          : ''
      }
    </table>`;

  const refBlock = bookingRef
    ? `<div class="ref-strip">
         <table><tr>
           <td>
             <div class="ref-label">Booking reference</div>
             <div class="ref-value">${escapeHtml(bookingRef)}</div>
           </td>
           <td class="ref-date">Generated<br/>${escapeHtml(generated)}</td>
         </tr></table>
       </div>`
    : `<p class="subtitle" style="margin:16px 0 0;color:#bfdbfe;">Generated ${escapeHtml(generated)} · Preview</p>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(pkg.name)} — LankaTrips Itinerary</title>
  ${docFontLinks()}
  <style>${docStyles()}</style>
</head>
<body>
  <div class="sheet">
    <div class="doc-hero">
      <div class="brand">Lanka<em>Trips</em></div>
      <h1>${escapeHtml(pkg.name)}</h1>
      <p class="subtitle">${pkg.days} days / ${pkg.nights} nights · ${escapeHtml(pkg.shortDescription)}</p>
      ${refBlock}
    </div>
    <div class="sheet-inner">
      <div class="pill-row">
        ${pkg.destinations.map(d => `<span class="pill">${escapeHtml(d)}</span>`).join('')}
      </div>
      <div class="section">
        <h2>Travellers &amp; pricing</h2>
        ${travellerKv}
      </div>
      <div class="section">
        <h2>Day-by-day itinerary</h2>
        ${daysHtml}
      </div>
      <div class="section two-col">
        <div>
          <h2 style="margin-bottom:10px;">Included</h2>
          <ul class="clean">${inc}</ul>
        </div>
        <div>
          <h2 style="margin-bottom:10px;">Not included</h2>
          <ul class="clean">${exc}</ul>
        </div>
      </div>
      <div class="footer">
        <strong>LankaTrips</strong> · Sri Lanka tours · For planning only. Final inclusions and timing are confirmed by our team after booking.
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function buildCustomItineraryHtml(opts: {
  state: CustomizerState;
  snapshot: CatalogSnapshot;
  bookingRef?: string;
  currency?: Currency;
  estimatedTotal?: number;
}): string {
  const { state, snapshot, bookingRef, currency = 'USD', estimatedTotal } = opts;
  const generated = new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
  const vehicle = snapshot.vehicles.find(v => v.id === state.vehicleId);

  const destRows = state.destinations
    .map(d => {
      const info = snapshot.destinations.find(x => x.id === d.id);
      const hotel = d.hotelId ? snapshot.hotels.find(h => h.id === d.hotelId) : undefined;
      const name = info?.name ?? d.id;
      return `<tr>
        <td>${escapeHtml(name)}</td>
        <td>${d.nights} night(s)</td>
        <td>${d.hotelTier}</td>
        <td>${hotel ? escapeHtml(hotel.name) : '—'}</td>
      </tr>`;
    })
    .join('');

  const destTableBody = destRows || '<tr><td colspan="4">No destinations in this summary</td></tr>';

  const acts = state.selectedActivityIds
    .map(id => snapshot.activities.find(a => a.id === id))
    .filter(Boolean) as typeof snapshot.activities;
  const actList = acts
    .map(
      a => `<li>
        <strong>${escapeHtml(a.name)}</strong>
        <span class="act-meta">${escapeHtml(prettifyPlace(a.destination))} · <span class="act-price">${formatCurrency(a.pricePerPerson, currency)}</span> / person</span>
      </li>`
    )
    .join('');

  const overviewRows = `
    <tr><td class="k">Arrival airport</td><td class="v">${escapeHtml(state.arrivalAirport)}</td></tr>
    ${state.arrivalDate ? `<tr><td class="k">Arrival date</td><td class="v">${escapeHtml(state.arrivalDate)}</td></tr>` : ''}
    ${state.departureDate ? `<tr><td class="k">Departure date</td><td class="v">${escapeHtml(state.departureDate)}</td></tr>` : ''}
    <tr><td class="k">Travellers</td><td class="v">${state.adults} adult(s), ${state.children} child(ren)</td></tr>
    <tr><td class="k">Vehicle</td><td class="v">${vehicle ? escapeHtml(vehicle.name) : escapeHtml(state.vehicleId)}</td></tr>
    ${
      estimatedTotal != null
        ? `<tr class="emphasis"><td class="k">Estimated total (incl. taxes)</td><td class="v">${formatCurrency(estimatedTotal, currency)}</td></tr>`
        : ''
    }
  `;

  const customRefBlock = bookingRef
    ? `<div class="ref-strip">
         <table><tr>
           <td>
             <div class="ref-label">Quote reference</div>
             <div class="ref-value">${escapeHtml(bookingRef)}</div>
           </td>
           <td class="ref-date">Generated<br/>${escapeHtml(generated)}</td>
         </tr></table>
       </div>`
    : `<p class="subtitle" style="margin:16px 0 0;color:#bfdbfe;">${escapeHtml(generated)}</p>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Custom Sri Lanka Tour — LankaTrips</title>
  ${docFontLinks()}
  <style>${docStyles()}</style>
</head>
<body>
  <div class="sheet">
    <div class="doc-hero">
      <div class="brand">Lanka<em>Trips</em></div>
      <h1>Your custom Sri Lanka tour</h1>
      <p class="subtitle">Personal itinerary summary · build your own route</p>
      ${customRefBlock}
    </div>
    <div class="sheet-inner">
      <div class="section">
        <h2>Trip overview</h2>
        <table class="kv">${overviewRows}</table>
      </div>
      <div class="section">
        <h2>Destinations &amp; hotels</h2>
        <table class="data" cellpadding="0" cellspacing="0">
          <colgroup>
            <col class="col-d" /><col class="col-n" /><col class="col-t" /><col class="col-h" />
          </colgroup>
          <thead>
            <tr>
              <th>Destination</th>
              <th>Nights</th>
              <th>Tier</th>
              <th>Hotel</th>
            </tr>
          </thead>
          <tbody>${destTableBody}</tbody>
        </table>
      </div>
      ${
        acts.length
          ? `<div class="section"><h2>Selected activities</h2><ul class="activities">${actList}</ul></div>`
          : ''
      }
      ${
        state.specialRequirements?.trim()
          ? `<div class="section"><h2>Special requirements</h2><p style="font-size:14px;line-height:1.6;color:#334155;margin:0;padding:14px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;border-left:4px solid #003580;">${escapeHtml(state.specialRequirements.trim())}</p></div>`
          : ''
      }
      <div class="footer">
        Custom tour request · <strong>LankaTrips</strong> will confirm hotels, timing, and pricing before payment.<br/>
        hello@lankatrips.lk · Sri Lanka
      </div>
    </div>
  </div>
</body>
</html>`;
}

export type ItineraryDownloadFormat = 'pdf' | 'html';

/** Vector PDF (primary); HTML fallback if PDF generation throws. */
export async function downloadPackageItinerary(
  opts: Parameters<typeof buildPackageItineraryHtml>[0] & { bookingRef?: string }
): Promise<ItineraryDownloadFormat> {
  const html = buildPackageItineraryHtml(opts);
  const ref = opts.bookingRef ?? opts.pkg.id;
  const pdfName = itineraryFilename('Package', ref, 'pdf');
  try {
    buildPackageItineraryPdf(opts).save(pdfName);
    return 'pdf';
  } catch (e) {
    console.error('Itinerary PDF failed', e);
    downloadItineraryHtml(itineraryFilename('Package', ref, 'html'), html);
    return 'html';
  }
}

export async function downloadCustomItinerary(
  opts: Parameters<typeof buildCustomItineraryHtml>[0] & { bookingRef?: string }
): Promise<ItineraryDownloadFormat> {
  const html = buildCustomItineraryHtml(opts);
  const ref = opts.bookingRef;
  const pdfName = itineraryFilename('Custom', ref, 'pdf');
  try {
    buildCustomItineraryPdf(opts).save(pdfName);
    return 'pdf';
  } catch (e) {
    console.error('Itinerary PDF failed', e);
    downloadItineraryHtml(itineraryFilename('Custom', ref, 'html'), html);
    return 'html';
  }
}
