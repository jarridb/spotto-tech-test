import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Provider } from '@spotto/types';
import type { FilterState } from '../hooks/use-resource-filters';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResourceFiltersProps {
  filters: FilterState;
  onSetFilter: (filterType: 'provider' | 'type' | 'region', value: Provider | string | undefined) => void;
  onClearFilter: (filterType: 'provider' | 'type' | 'region') => void;
  availableTypes: string[];
  availableRegions: string[];
}

export function ResourceFilters({
  filters,
  onSetFilter,
  onClearFilter,
  availableTypes,
  availableRegions,
}: ResourceFiltersProps) {
  const [providerOpen, setProviderOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);

  const providerOptions: Provider[] = [Provider.Azure, Provider.AWS, Provider.GCP];

  return (
    <div className="flex flex-wrap gap-2">
      {/* Provider Filter */}
      <Popover open={providerOpen} onOpenChange={setProviderOpen}>
        <PopoverTrigger asChild>
          
          <Button
            variant={filters.provider ? 'default' : 'outline'}
            className="gap-2"
          >
           
            Provider
            {filters.provider && (
              <span className="flex items-center gap-1 ml-1 rounded-full bg-primary-foreground/20 px-1.5 py-0.5 text-xs">
                {filters.provider}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  asChild={true}
                  className="p-0 h-auto w-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearFilter('provider');
                  }}
                  aria-label={`Remove ${filters.type} filter`}

                >
                  <span>
                    <span className="sr-only">Remove filter</span>
                    <X className="h-3 w-3" />
                  </span>
                </Button>
              </span>
            )}
            
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0">
          <div className="p-2">
            {providerOptions.map((provider) => (
              <button
                key={provider}
                onClick={() => {
                  onSetFilter('provider', filters.provider === provider ? undefined : provider);
                  setProviderOpen(false);
                }}
                className={cn(
                  'w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent',
                  filters.provider === provider && 'bg-accent font-medium'
                )}
              >
                {provider}
              </button>
            ))}
          </div>
          {filters.provider && (
            <>
              <Separator />
              <div className="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    onClearFilter('provider');
                    setProviderOpen(false);
                  }}
                >
                  <X className="h-4 w-4" />
                  Remove filter
                </Button>
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>

      {/* Type Filter */}
      <Popover open={typeOpen} onOpenChange={setTypeOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={filters.type ? 'default' : 'outline'}
            className="gap-2"
          >
            Type
            {filters.type && (
              <span className="ml-1 flex items-center gap-1 rounded-full bg-primary-foreground/20 px-1.5 py-0.5 text-xs">
                {filters.type}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  asChild={true}
                  className="p-0 h-auto w-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearFilter('type');
                  }}
                  aria-label={`Remove ${filters.type} filter`}

                >
                  <span>
                    <span className="sr-only">Remove filter</span>
                    <X className="h-3 w-3" />
                  </span>
                </Button>
              </span>
            )}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0">
          <div className="max-h-60 overflow-y-auto p-2">
            {availableTypes.length === 0 ? (
              <p className="px-2 py-1.5 text-sm text-muted-foreground">No types available</p>
            ) : (
              availableTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    onSetFilter('type', filters.type === type ? undefined : type);
                    setTypeOpen(false);
                  }}
                  className={cn(
                    'w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent',
                    filters.type === type && 'bg-accent font-medium'
                  )}
                >
                  {type}
                
                </button>
              ))
            )}
          </div>
          {filters.type && (
            <>
              <Separator />
              <div className="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    onClearFilter('type');
                    setTypeOpen(false);
                  }}
                >
                  <X className="h-4 w-4" />
                  Remove filter
                </Button>
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>

      {/* Region Filter */}
      <Popover open={regionOpen} onOpenChange={setRegionOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={filters.region ? 'default' : 'outline'}
            className="gap-2"
          >
            Region
            {filters.region && (
              <span className="ml-1 flex items-center gap-1 rounded-full bg-primary-foreground/20 px-1.5 py-0.5 text-xs">
                {filters.region}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  asChild={true}
                  className="p-0 h-auto w-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearFilter('region');
                  }}
                  aria-label={`Remove ${filters.provider} filter`}

                >
                  <span>
                    <span className="sr-only">Remove filter</span>
                    <X className="h-3 w-3" />
                  </span>
                </Button>
              </span>
            )}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0">
          <div className="max-h-60 overflow-y-auto p-2">
            {availableRegions.length === 0 ? (
              <p className="px-2 py-1.5 text-sm text-muted-foreground">No regions available</p>
            ) : (
              availableRegions.map((region) => (
                <button
                  key={region}
                  onClick={() => {
                    onSetFilter('region', filters.region === region ? undefined : region);
                    setRegionOpen(false);
                  }}
                  className={cn(
                    'w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent',
                    filters.region === region && 'bg-accent font-medium'
                  )}
                  >
                    {region}
                  </button>
              ))
            )}
          </div>
          {filters.region && (
            <>
              <Separator />
              <div className="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    onClearFilter('region');
                    setRegionOpen(false);
                  }}
                >
                  <X className="h-4 w-4" />
                  Remove filter
                </Button>
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

