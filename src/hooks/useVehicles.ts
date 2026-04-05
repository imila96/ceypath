import { useQuery } from '@tanstack/react-query';
import { useCatalogStore } from '../catalog/catalogStore';
import { loadVehicles } from '../repositories/vehiclesRepository';

export const VEHICLES_QUERY_KEY = ['vehicles'] as const;

export function useVehicles() {
  return useQuery({
    queryKey: VEHICLES_QUERY_KEY,
    queryFn: loadVehicles,
    staleTime: 60_000,
    placeholderData: useCatalogStore.getState().vehicles,
  });
}
