import type { Resource, Provider } from '@spotto/types';
import { getAllResources } from '../data/resources.js';
import { calculateTagCoverage } from './coverage-service.js';

export interface ResourceListQuery {
  provider?: Provider;
  type?: string;
  region?: string;
  sortBy?: 'name' | 'type' | 'provider' | 'region' | 'monthlyCost' | 'tagCoverage';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Filter and sort resources based on query parameters
 */
export function getFilteredAndSortedResources(
  query: ResourceListQuery
): Resource[] {
  let filtered = getAllResources();

  // Apply filters (single-select)
  if (query.provider) {
    filtered = filtered.filter((r) => r.provider === query.provider);
  }

  if (query.type) {
    filtered = filtered.filter((r) => r.type === query.type);
  }

  if (query.region) {
    filtered = filtered.filter((r) => r.region === query.region);
  }

  // Apply sorting
  if (query.sortBy) {
    const direction = query.sortOrder === 'desc' ? -1 : 1;
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (query.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'provider':
          comparison = a.provider.localeCompare(b.provider);
          break;
        case 'region':
          comparison = a.region.localeCompare(b.region);
          break;
        case 'monthlyCost':
          comparison = a.monthlyCost - b.monthlyCost;
          break;
        case 'tagCoverage':
          comparison = calculateTagCoverage(a) - calculateTagCoverage(b);
          break;
      }

      return comparison * direction;
    });
  } else {
    // Default sort by name ascending
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  return filtered;
}

