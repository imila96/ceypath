import { useMemo } from 'react';
import { useDestinations } from './useDestinations';
import type { Destination } from '../repositories/destinationsRepository';

export function useDestination(slug: string | undefined) {
  const query = useDestinations();

  const destination = useMemo((): Destination | undefined => {
    if (!slug || !query.data?.length) return undefined;
    return query.data.find(d => d.slug === slug);
  }, [slug, query.data]);

  return { ...query, destination };
}
