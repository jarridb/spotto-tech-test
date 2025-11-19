import { useState, useCallback } from 'react';
import { Provider } from '@spotto/types';
import type { ResourceType } from '@spotto/types';

export interface FilterState {
  provider?: Provider;
  type?: ResourceType | string;
  region?: string;
}

export function useResourceFilters() {
  const [filters, setFilters] = useState<FilterState>({});

  const setFilter = useCallback(
    (filterType: 'provider' | 'type' | 'region', value: Provider | string | undefined) => {
      setFilters((current) => ({
        ...current,
        [filterType]: value,
      }));
    },
    []
  );

  const clearFilter = useCallback((filterType: 'provider' | 'type' | 'region') => {
    setFilters((current) => {
      const updated = { ...current };
      delete updated[filterType];
      return updated;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    filters,
    setFilter,
    clearFilter,
    clearAllFilters,
  };
}

