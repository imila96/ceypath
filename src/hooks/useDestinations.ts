import { useQuery } from '@tanstack/react-query';
import { useCatalogStore } from '../catalog/catalogStore';
import { loadDestinations } from '../repositories/destinationsRepository';

export const DESTINATIONS_QUERY_KEY = ['destinations'] as const;

export function useDestinations() {
  return useQuery({
    queryKey: DESTINATIONS_QUERY_KEY,
    queryFn: loadDestinations,
    staleTime: 60_000,
    placeholderData: useCatalogStore.getState().destinations,
  });
}
