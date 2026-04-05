import React from 'react';
import type { Activity } from '../../repositories/activitiesRepository';
import { formatCurrency } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';
import { Clock } from 'lucide-react';

interface Props {
  activity: Activity;
  selected: boolean;
  onToggle: (id: string) => void;
}

const DIFFICULTY_STYLES = {
  Easy: 'bg-green-100 text-green-700',
  Moderate: 'bg-yellow-100 text-yellow-700',
  Challenging: 'bg-red-100 text-red-700',
};

export default function ActivityCard({ activity, selected, onToggle }: Props) {
  const { currency } = useCurrency();

  return (
    <div
      onClick={() => !activity.included && onToggle(activity.id)}
      className={`relative flex items-start gap-3 p-3 rounded-lg border-2 transition-all
        ${activity.included
          ? 'border-green-200 bg-green-50 cursor-default'
          : selected
          ? 'border-[#003580] bg-blue-50 cursor-pointer'
          : 'border-gray-200 bg-white cursor-pointer hover:border-blue-300'
        }`}
    >
      {/* Checkbox */}
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5
        ${activity.included
          ? 'bg-green-500 border-green-500'
          : selected
          ? 'bg-[#003580] border-[#003580]'
          : 'border-gray-300'
        }`}
      >
        {(activity.included || selected) && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </div>

      {/* Photo or emoji icon */}
      {activity.image ? (
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
          <img src={activity.image} alt="" className="h-full w-full object-cover" />
        </div>
      ) : (
        <span className="text-xl shrink-0">{activity.icon}</span>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-gray-900 text-sm leading-tight">{activity.name}</h4>
          <div className="shrink-0 text-right">
            {activity.included ? (
              <span className="text-xs font-bold text-green-600">INCLUDED</span>
            ) : (
              <span className="text-sm font-bold text-gray-900">+{formatCurrency(activity.pricePerPerson, currency)}<span className="text-xs font-normal text-gray-500">/pp</span></span>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{activity.description}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock size={10} />
            {activity.duration}
          </span>
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${DIFFICULTY_STYLES[activity.difficulty]}`}>
            {activity.difficulty}
          </span>
        </div>
      </div>
    </div>
  );
}
