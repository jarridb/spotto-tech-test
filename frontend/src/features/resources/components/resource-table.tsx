import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ResourceRow } from './resource-row';
import type { ResourceWithCoverage } from '@spotto/types';
import type { SortField, SortDirection } from '../hooks/use-resource-sort';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface ResourceTableProps {
  resources: ResourceWithCoverage[];
  sortField: SortField | null;
  sortDirection: SortDirection | null;
  onSort: (field: SortField) => void;
  selectedResourceIds?: Set<string>;
  onSelectAll?: (checked: boolean) => void;
  onSelectResource?: (resourceId: string, checked: boolean) => void;
  allSelected?: boolean;
  someSelected?: boolean;
}

function SortableHeader({
  field,
  currentField,
  currentDirection,
  onSort,
  children,
}: {
  field: SortField;
  currentField: SortField | null;
  currentDirection: SortDirection | null;
  onSort: (field: SortField) => void;
  children: React.ReactNode;
}) {
  const isActive = currentField === field;

  return (
    <TableHead>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={() => onSort(field)}
      >
        {children}
        {isActive ? (
          currentDirection === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          )
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
        )}
      </Button>
    </TableHead>
  );
}

interface ResourceTablePropsWithClearFilters extends ResourceTableProps {
  onClearFilters?: () => void;
}

export function ResourceTable({
  resources,
  sortField,
  sortDirection,
  onSort,
  onClearFilters,
  selectedResourceIds = new Set(),
  onSelectAll,
  onSelectResource,
  allSelected = false,
}: ResourceTablePropsWithClearFilters) {
  if (resources.length === 0) {
    return (
      <div className="flex h-24 flex-col items-center justify-center gap-2">
        <p className="text-sm text-muted-foreground">No resources found</p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-primary hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {onSelectAll && (
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) => onSelectAll(checked === true)}
                aria-label="Select all resources"
              />
            </TableHead>
          )}
          <SortableHeader
            field="name"
            currentField={sortField}
            currentDirection={sortDirection}
            onSort={onSort}
          >
            Name
          </SortableHeader>
          <SortableHeader
            field="type"
            currentField={sortField}
            currentDirection={sortDirection}
            onSort={onSort}
          >
            Type
          </SortableHeader>
          <SortableHeader
            field="provider"
            currentField={sortField}
            currentDirection={sortDirection}
            onSort={onSort}
          >
            Provider
          </SortableHeader>
          <SortableHeader
            field="region"
            currentField={sortField}
            currentDirection={sortDirection}
            onSort={onSort}
          >
            Region
          </SortableHeader>
          <SortableHeader
            field="monthlyCost"
            currentField={sortField}
            currentDirection={sortDirection}
            onSort={onSort}
          >
            Monthly Cost
          </SortableHeader>
          <SortableHeader
            field="tagCoverage"
            currentField={sortField}
            currentDirection={sortDirection}
            onSort={onSort}
          >
            Tag Coverage
          </SortableHeader>
          <TableHead>Environment</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>BusinessUnit</TableHead>
          <TableHead>CostCenter</TableHead>
          <TableHead>Project</TableHead>
          <TableHead>Customer</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {resources.map((resource) => (
          <ResourceRow
            key={resource.id}
            resource={resource}
            selected={selectedResourceIds.has(resource.id)}
            onSelect={onSelectResource ? (checked) => onSelectResource(resource.id, checked) : undefined}
          />
        ))}
      </TableBody>
    </Table>
  );
}

