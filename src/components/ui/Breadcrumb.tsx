import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Crumb {
  label: string;
  to?: string;
}

interface Props {
  crumbs: Crumb[];
  /** Use on dark hero backgrounds (white / soft contrast). */
  variant?: 'default' | 'light';
}

export default function Breadcrumb({ crumbs, variant = 'default' }: Props) {
  const isLight = variant === 'light';
  return (
    <nav
      className={`flex items-center gap-1 text-sm ${isLight ? 'text-white/85' : 'text-gray-500'}`}
    >
      {crumbs.map((crumb, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <ChevronRight size={14} className={isLight ? 'text-white/50' : 'text-gray-400'} />
          )}
          {crumb.to ? (
            <Link
              to={crumb.to}
              className={
                isLight
                  ? 'hover:text-white transition-colors'
                  : 'hover:text-[#003580] transition-colors'
              }
            >
              {crumb.label}
            </Link>
          ) : (
            <span className={isLight ? 'text-white font-medium' : 'text-gray-800 font-medium'}>
              {crumb.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
