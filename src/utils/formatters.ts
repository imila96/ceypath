export type Currency = 'USD' | 'EUR' | 'LKR';

const RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  LKR: 320,
};

const SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  LKR: 'Rs',
};

export function formatCurrency(amount: number, currency: Currency = 'USD'): string {
  const converted = amount * RATES[currency];
  const symbol = SYMBOLS[currency];

  if (currency === 'LKR') {
    return `${symbol} ${Math.round(converted).toLocaleString()}`;
  }
  return `${symbol}${converted.toFixed(0)}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function generateBookingRef(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function getRatingLabel(rating: number): string {
  if (rating >= 9.5) return 'Exceptional';
  if (rating >= 9.0) return 'Excellent';
  if (rating >= 8.5) return 'Very Good';
  if (rating >= 8.0) return 'Good';
  if (rating >= 7.0) return 'Pleasant';
  return 'Satisfactory';
}

export function starRatingTo10(stars: number): number {
  return stars * 2;
}
