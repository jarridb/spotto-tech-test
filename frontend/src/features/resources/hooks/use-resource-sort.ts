import { useState, useCallback } from 'react';

export type SortField = 'name' | 'type' | 'provider' | 'region' | 'monthlyCost' | 'tagCoverage';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: SortField | null;
  direction: SortDirection | null;
}

export function useResourceSort() {
  const [sortState, setSortState] = useState<SortState>({
    field: null,
    direction: null,
  });

  const toggleSort = useCallback((field: SortField) => {
    setSortState((current) => {
      // If clicking the same column, toggle direction
      if (current.field === field) {
        if (current.direction === 'asc') {
          return { field, direction: 'desc' };
        } else if (current.direction === 'desc') {
          // Third click removes sort
          return { field: null, direction: null };
        }
      }
      // Clicking different column sets to ascending
      return { field, direction: 'asc' };
    });
  }, []);

  const clearSort = useCallback(() => {
    setSortState({ field: null, direction: null });
  }, []);

  return {
    sortState,
    toggleSort,
    clearSort,
  };
}

