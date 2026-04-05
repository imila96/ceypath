import React from 'react';
import { getRatingLabel, starRatingTo10 } from '../../utils/formatters';

interface Props {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  isStarRating?: boolean;
}

export default function RatingBadge({ rating, reviewCount, size = 'md', isStarRating = false }: Props) {
  const score = isStarRating ? starRatingTo10(rating) : rating;
  const label = getRatingLabel(score);

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 rounded',
    md: 'text-sm px-2 py-1 rounded',
    lg: 'text-base px-3 py-1.5 rounded-lg',
  };

  const bgColor = score >= 9.0 ? 'bg-[#003580]' : score >= 8.0 ? 'bg-blue-600' : score >= 7.0 ? 'bg-blue-500' : 'bg-blue-400';

  return (
    <div className="flex items-center gap-2">
      <span className={`${bgColor} text-white font-bold ${sizeClasses[size]}`}>
        {score.toFixed(1)}
      </span>
      <div>
        <p className="font-semibold text-gray-800 text-sm">{label}</p>
        {reviewCount !== undefined && (
          <p className="text-xs text-gray-500">{reviewCount.toLocaleString()} reviews</p>
        )}
      </div>
    </div>
  );
}
