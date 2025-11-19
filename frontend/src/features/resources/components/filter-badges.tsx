import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import type { FilterState } from '../hooks/use-resource-filters';

interface FilterBadgesProps {
  filters: FilterState;
  onClearFilter: (filterType: 'provider' | 'type' | 'region') => void;
}

export function FilterBadges({ filters, onClearFilter }: FilterBadgesProps) {
  const activeFilters = [
    filters.provider && { type: 'provider' as const, label: `Provider: ${filters.provider}`, value: filters.provider },
    filters.type && { type: 'type' as const, label: `Type: ${filters.type}`, value: filters.type },
    filters.region && { type: 'region' as const, label: `Region: ${filters.region}`, value: filters.region },
  ].filter(Boolean) as Array<{ type: 'provider' | 'type' | 'region'; label: string; value: string }>;

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {activeFilters.map((filter) => (
        <Badge key={filter.type} variant="secondary" className="gap-1 pr-1">
          <span>{filter.label}</span>
          <button
            onClick={() => onClearFilter(filter.type)}
            className="ml-1 rounded-full hover:bg-secondary-foreground/20"
            aria-label={`Remove ${filter.type} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
}

