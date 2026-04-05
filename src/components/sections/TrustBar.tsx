import React from 'react';

const TRUST_ITEMS = [
  { icon: '✈️', text: 'Free Airport Pickup Included' },
  { icon: '🏨', text: '500+ Verified Hotels' },
  { icon: '📞', text: '24/7 Local Support' },
  { icon: '⚡', text: 'Instant Confirmation' },
  { icon: '🔄', text: 'Flexible Cancellation' },
];

export default function TrustBar() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {TRUST_ITEMS.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-sm">{item.icon}</span>
              <span className="text-sm font-medium text-gray-700">
                <span className="text-green-600 font-semibold">✓</span> {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
