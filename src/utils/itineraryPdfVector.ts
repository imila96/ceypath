/**
 * Vector PDF itineraries (jsPDF + autotable) — crisp text, real brand colours, reliable tables.
 * Avoids html2canvas, which often rasterises to a flat grey mess in PDFs.
 */
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { TourPackage } from '../data/packages';
import type { CatalogSnapshot } from '../catalog/catalogStore';
import type { CustomizerState } from './priceCalculator';
import { formatCurrency } from './formatters';
import type { Currency } from './formatters';

const NAVY: [number, number, number] = [0, 53, 128];
const RED: [number, number, number] = [227, 38, 54];
const SLATE: [number, number, number] = [100, 116, 139];

function prettifyPlace(s: string): string {
  return s
    .trim()
    .split(/[\s,/]+/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function hotelLinePlain(day: TourPackage['itinerary'][number]): string {
  if (day.hotelOptions?.length) {
    return day.hotelOptions.map(h => `${h.name}${h.summary ? ` — ${h.summary}` : ''}`).join('; ');
  }
  return day.hotel?.trim() || '—';
}

function footerText(kind: 'custom' | 'package'): string {
  if (kind === 'custom') {
    return 'LankaTrips · Custom tour · hello@lankatrips.lk · Sri Lanka';
  }
  return 'LankaTrips · Sri Lanka tours · For planning only — final details confirmed after booking';
}

function addFooters(doc: jsPDF, kind: 'custom' | 'package'): void {
  const pageW = doc.internal.pageSize.getWidth();
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...SLATE);
    doc.text(footerText(kind), pageW / 2, 289, { align: 'center' });
    doc.setTextColor(0, 0, 0);
  }
}

/** Returns Y (mm) where body content should start (below header / reference card). */
function drawBrandedHeader(
  doc: jsPDF,
  opts: {
    pageW: number;
    margin: number;
    title: string;
    subtitle: string;
    reference?: string;
    referenceLabel: string;
    generated: string;
  }
): number {
  const { pageW, margin, title, subtitle, reference, referenceLabel, generated } = opts;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  const titleLines = doc.splitTextToSize(title, pageW - 2 * margin);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const subLines = doc.splitTextToSize(subtitle, pageW - 2 * margin);

  const navyH = Math.min(16 + titleLines.length * 5.2 + subLines.length * 4 + 6, 52);
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageW, navyH, 'F');
  doc.setFillColor(...RED);
  doc.rect(0, navyH, pageW, 1.2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  const bx = margin;
  doc.text('Lanka', bx, 10);
  const gap = doc.getTextWidth('Lanka');
  doc.setTextColor(254, 202, 202);
  doc.text('Trips', bx + gap + 0.5, 10);

  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(titleLines, margin, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(191, 219, 254);
  doc.text(subLines, margin, 18 + titleLines.length * 5.2);

  let yBelow = navyH + 5;
  if (reference) {
    const boxY = navyH + 4;
    const boxH = 13;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, boxY, pageW - 2 * margin, boxH, 1.5, 1.5, 'F');
    doc.setDrawColor(191, 219, 254);
    doc.setLineWidth(0.35);
    doc.roundedRect(margin, boxY, pageW - 2 * margin, boxH, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...NAVY);
    doc.text(referenceLabel.toUpperCase(), margin + 2.5, boxY + 4);

    doc.setFontSize(11);
    doc.text(reference, margin + 2.5, boxY + 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...SLATE);
    doc.text(generated, pageW - margin - 2, boxY + 9, { align: 'right' });
    yBelow = boxY + boxH + 7;
  }

  return yBelow;
}

function sectionHeading(doc: jsPDF, y: number, margin: number, pageW: number, label: string): number {
  if (y > 255) {
    doc.addPage();
    y = 18;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...NAVY);
  doc.text(label.toUpperCase(), margin, y);
  doc.setDrawColor(...NAVY);
  doc.setLineWidth(0.35);
  doc.line(margin, y + 1.5, pageW - margin, y + 1.5);
  doc.setTextColor(0, 0, 0);
  return y + 9;
}

export function buildCustomItineraryPdf(opts: {
  state: CustomizerState;
  snapshot: CatalogSnapshot;
  bookingRef?: string;
  currency?: Currency;
  estimatedTotal?: number;
}): jsPDF {
  const { state, snapshot, bookingRef, currency = 'USD', estimatedTotal } = opts;
  const generated = new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
  const vehicle = snapshot.vehicles.find(v => v.id === state.vehicleId);

  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const pageW = doc.internal.pageSize.getWidth();
  const m = 14;

  let y = drawBrandedHeader(doc, {
    pageW,
    margin: m,
    title: 'Your custom Sri Lanka tour',
    subtitle: 'Personal itinerary summary · build your own route',
    reference: bookingRef,
    referenceLabel: 'Quote reference',
    generated,
  });

  y = sectionHeading(doc, y, m, pageW, 'Trip overview');

  const overviewBody: string[][] = [['Arrival airport', state.arrivalAirport]];
  if (state.arrivalDate) overviewBody.push(['Arrival date', state.arrivalDate]);
  if (state.departureDate) overviewBody.push(['Departure date', state.departureDate]);
  overviewBody.push(['Travellers', `${state.adults} adult(s), ${state.children} child(ren)`]);
  overviewBody.push(['Vehicle', vehicle?.name ?? state.vehicleId]);
  if (estimatedTotal != null) {
    overviewBody.push(['Estimated total (incl. taxes)', formatCurrency(estimatedTotal, currency)]);
  }

  const lastIsTotal = estimatedTotal != null;

  autoTable(doc, {
    startY: y,
    margin: { left: m, right: m },
    body: overviewBody,
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: { top: 2.8, bottom: 2.8, left: 3, right: 3 },
      lineColor: [203, 213, 225],
      lineWidth: 0.15,
    },
    columnStyles: {
      0: { cellWidth: 78, fillColor: [241, 245, 249], fontStyle: 'bold', textColor: [51, 65, 85] },
      1: { fillColor: [255, 255, 255], textColor: [15, 23, 42] },
    },
    didParseCell: data => {
      if (data.section === 'body' && lastIsTotal && data.row.index === overviewBody.length - 1) {
        data.cell.styles.fillColor = [239, 246, 255];
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.textColor = [0, 53, 128];
      }
    },
  });

  const d = doc as jsPDF & { lastAutoTable?: { finalY: number } };
  y = (d.lastAutoTable?.finalY ?? y) + 8;

  y = sectionHeading(doc, y, m, pageW, 'Destinations & hotels');

  const destRows = state.destinations.map(d => {
    const info = snapshot.destinations.find(x => x.id === d.id);
    const hotel = d.hotelId ? snapshot.hotels.find(h => h.id === d.hotelId) : undefined;
    const name = info?.name ?? d.id;
    return [`${name}`, `${d.nights} night(s)`, d.hotelTier, hotel ? hotel.name : '—'];
  });

  autoTable(doc, {
    startY: y,
    head: [['Destination', 'Nights', 'Tier', 'Hotel']],
    body: destRows.length ? destRows : [['No destinations in this summary', '—', '—', '—']],
    margin: { left: m, right: m },
    theme: 'grid',
    headStyles: {
      fillColor: NAVY,
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'left',
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      lineColor: [203, 213, 225],
      textColor: [15, 23, 42],
    },
    columnStyles: {
      0: { cellWidth: 54 },
      1: { cellWidth: 26 },
      2: { cellWidth: 24 },
      3: { cellWidth: 'auto' },
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  y = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? y;
  y += 8;

  const acts = state.selectedActivityIds
    .map(id => snapshot.activities.find(a => a.id === id))
    .filter(Boolean) as typeof snapshot.activities;

  if (acts.length) {
    y = sectionHeading(doc, y, m, pageW, 'Selected activities');
    const actBody = acts.map(a => [
      a.name,
      `${prettifyPlace(a.destination)}  ·  ${formatCurrency(a.pricePerPerson, currency)} / person`,
    ]);
    autoTable(doc, {
      startY: y,
      head: [['Activity', 'Location & price']],
      body: actBody,
      margin: { left: m, right: m },
      theme: 'grid',
      headStyles: { fillColor: NAVY, textColor: 255, fontStyle: 'bold', fontSize: 8 },
      styles: { fontSize: 8.5, cellPadding: 3, lineColor: [203, 213, 225] },
      columnStyles: {
        0: { cellWidth: 62, fontStyle: 'bold', textColor: [0, 53, 128] },
        1: { cellWidth: 'auto', textColor: [71, 85, 105] },
      },
      alternateRowStyles: { fillColor: [255, 253, 253] },
    });
    y = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? y;
    y += 6;
  }

  if (state.specialRequirements?.trim()) {
    y = sectionHeading(doc, y, m, pageW, 'Special requirements');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    const lines = doc.splitTextToSize(state.specialRequirements.trim(), pageW - 2 * m);
    doc.text(lines, m, y + 4);
  }

  addFooters(doc, 'custom');
  return doc;
}

export function buildPackageItineraryPdf(opts: {
  pkg: TourPackage;
  bookingRef?: string;
  adults?: number;
  children?: number;
  currency?: Currency;
  estimatedTotal?: number;
}): jsPDF {
  const { pkg, bookingRef, adults = 2, children = 0, currency = 'USD', estimatedTotal } = opts;
  const generated = new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const pageW = doc.internal.pageSize.getWidth();
  const m = 14;

  let y = drawBrandedHeader(doc, {
    pageW,
    margin: m,
    title: pkg.name,
    subtitle: `${pkg.days} days / ${pkg.nights} nights · ${pkg.shortDescription}`,
    reference: bookingRef,
    referenceLabel: 'Booking reference',
    generated,
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...NAVY);
  const pills = pkg.destinations.join('  ·  ');
  const pillLines = doc.splitTextToSize(pills, pageW - 2 * m);
  doc.text(pillLines, m, y);
  y += pillLines.length * 4 + 6;

  y = sectionHeading(doc, y, m, pageW, 'Travellers & pricing');

  const travBody: string[][] = [
    ['Adults', String(adults)],
    ['Children', String(children)],
  ];
  if (estimatedTotal != null) {
    travBody.push(['Estimated total (incl. taxes)', formatCurrency(estimatedTotal, currency)]);
  }

  const hasTotal = estimatedTotal != null;

  autoTable(doc, {
    startY: y,
    margin: { left: m, right: m },
    body: travBody,
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: { top: 2.8, bottom: 2.8, left: 3, right: 3 },
      lineColor: [203, 213, 225],
    },
    columnStyles: {
      0: { cellWidth: 78, fillColor: [241, 245, 249], fontStyle: 'bold', textColor: [51, 65, 85] },
      1: { fillColor: [255, 255, 255] },
    },
    didParseCell: data => {
      if (data.section === 'body' && hasTotal && data.row.index === travBody.length - 1) {
        data.cell.styles.fillColor = [239, 246, 255];
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.textColor = [0, 53, 128];
      }
    },
  });

  y = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? y;
  y += 8;

  y = sectionHeading(doc, y, m, pageW, 'Day-by-day itinerary');

  for (const day of pkg.itinerary) {
    const slots: string[] = [];
    if (day.morning?.trim()) slots.push(`Morning: ${day.morning.trim()}`);
    if (day.afternoon?.trim()) slots.push(`Afternoon: ${day.afternoon.trim()}`);
    if (day.evening?.trim()) slots.push(`Evening: ${day.evening.trim()}`);
    const bodyText = slots.length ? slots.join('\n') : '(No timed entries for this day)';
    const hotelTxt = hotelLinePlain(day);
    const meals = (day.meals ?? []).length ? day.meals.join(', ') : '—';
    const dist = day.distance?.trim() || '—';
    const detailBlock = [bodyText, '', `Stay: ${hotelTxt}`, `Meals: ${meals}  ·  Distance: ${dist}`].join('\n');

    const detailLines = doc.splitTextToSize(detailBlock, pageW - 2 * m - 8);
    const titleLine = `Day ${day.day} — ${day.title}`;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    const titleChunks = doc.splitTextToSize(titleLine, pageW - 2 * m - 8);
    const titleH = titleChunks.length * 4.8;
    const blockH = 6 + titleH + detailLines.length * 4.1 + 8;

    if (y + blockH > 275) {
      doc.addPage();
      y = 18;
    }

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(m, y, pageW - 2 * m, blockH, 2, 2, 'FD');

    doc.setTextColor(...NAVY);
    doc.text(titleChunks, m + 4, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(detailLines, m + 4, y + 6 + titleH + 2);

    y += blockH + 5;
  }

  y += 4;
  y = sectionHeading(doc, y, m, pageW, 'Included');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  for (const line of pkg.inclusions) {
    if (y > 270) {
      doc.addPage();
      y = 18;
    }
    const t = doc.splitTextToSize(`• ${line}`, pageW - 2 * m);
    doc.text(t, m, y);
    y += t.length * 4 + 2;
  }

  y = sectionHeading(doc, y + 2, m, pageW, 'Not included');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  for (const line of pkg.exclusions) {
    if (y > 270) {
      doc.addPage();
      y = 18;
    }
    const t = doc.splitTextToSize(`• ${line}`, pageW - 2 * m);
    doc.text(t, m, y);
    y += t.length * 4 + 2;
  }

  addFooters(doc, 'package');
  return doc;
}
