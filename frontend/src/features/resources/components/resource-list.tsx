import { useEffect, useMemo } from 'react';
import { useResources } from '../services/queries';
import { ResourceTable } from './resource-table';
import { useResourceSort } from '../hooks/use-resource-sort';
import { useResourceFilters } from '../hooks/use-resource-filters';
import { ResourceFilters } from './resource-filters';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export function ResourceList() {
  const { sortState, toggleSort } = useResourceSort();
  const { filters, setFilter, clearFilter, clearAllFilters } = useResourceFilters();

  // Convert filters and sort to query params
  const queryParams = {
    ...filters,
    sortBy: sortState.field || undefined,
    sortOrder: sortState.direction || undefined,
  };

  const { data, isLoading, error, refetch } = useResources(queryParams);
  
  // Fetch all resources (no filters) to get available filter options
  const { data: allResourcesData } = useResources({});

  // Extract unique types and regions from ALL resources (not filtered)
  const availableTypes = useMemo(() => {
    if (!allResourcesData?.resources) return [];
    const types = new Set(allResourcesData.resources.map((r) => r.type));
    return Array.from(types).sort();
  }, [allResourcesData?.resources]);

  const availableRegions = useMemo(() => {
    if (!allResourcesData?.resources) return [];
    const regions = new Set(allResourcesData.resources.map((r) => r.region));
    return Array.from(regions).sort();
  }, [allResourcesData?.resources]);

  // Clear selection when filters change (for future bulk operations)
  useEffect(() => {
    // This will be used when selection state is implemented
  }, [filters]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Failed to load resources</h3>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'An error occurred'}
          </p>
        </div>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-4">
      <ResourceFilters
        filters={filters}
        onSetFilter={setFilter}
        onClearFilter={clearFilter}
        availableTypes={availableTypes}
        availableRegions={availableRegions}
      />
      <ResourceTable
        resources={data.resources}
        sortField={sortState.field}
        sortDirection={sortState.direction}
        onSort={toggleSort}
        onClearFilters={clearAllFilters}
      />
    </div>
  );
}

