import { queryClient } from '../lib/queryClient';

/** Call after any catalog CRUD so React Query–backed pages refresh. */
export function invalidateCatalogQueries() {
  queryClient.invalidateQueries({ queryKey: ['packages'] });
  queryClient.invalidateQueries({ queryKey: ['destinations'] });
  queryClient.invalidateQueries({ queryKey: ['vehicles'] });
}
