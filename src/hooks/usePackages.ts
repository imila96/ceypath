import { useQuery } from '@tanstack/react-query';
import { useCatalogStore } from '../catalog/catalogStore';
import { loadPackages } from '../repositories/packagesRepository';

export const PACKAGES_QUERY_KEY = ['packages'] as const;

export function usePackages() {
  return useQuery({
    queryKey: PACKAGES_QUERY_KEY,
    queryFn: loadPackages,
    staleTime: 60_000,
    placeholderData: useCatalogStore.getState().packages,
  });
}
