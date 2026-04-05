import { useMemo } from 'react';
import { usePackages } from './usePackages';
import type { TourPackage } from '../repositories/packagesRepository';

/** Resolves one package from the shared packages query cache (expects `GET /packages` to return full catalog). */
export function usePackage(id: string | undefined) {
  const q = usePackages();
  const pkg: TourPackage | undefined = useMemo(
    () => (id && q.data ? q.data.find(p => p.id === id) : undefined),
    [id, q.data]
  );
  return { ...q, package: pkg };
}
