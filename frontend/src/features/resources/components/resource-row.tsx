import { useNavigate } from '@tanstack/react-router';
import { TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { TagCoverageBadge } from './tag-coverage-badge';
import type { ResourceWithCoverage } from '@spotto/types';

interface ResourceRowProps {
  resource: ResourceWithCoverage;
  selected?: boolean;
  onSelect?: (checked: boolean) => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function ResourceRow({ resource, selected = false, onSelect }: ResourceRowProps) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on checkbox
    if ((e.target as HTMLElement).closest('[role="checkbox"]')) {
      return;
    }
    navigate({ to: '/resources/$id', params: { id: resource.id } });
  };

  const handleCheckboxChange = (checked: boolean) => {
    if (onSelect) {
      onSelect(checked);
    }
  };

  return (
    <TableRow
      onClick={handleClick}
      className="cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate({ to: '/resources/$id', params: { id: resource.id } });
        }
      }}
    >
      {onSelect && (
        <TableCell
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={selected}
            onCheckedChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select ${resource.name}`}
          />
        </TableCell>
      )}
      <TableCell className="font-medium">{resource.name}</TableCell>
      <TableCell>{resource.type}</TableCell>
      <TableCell>{resource.provider}</TableCell>
      <TableCell>{resource.region}</TableCell>
      <TableCell>{formatCurrency(resource.monthlyCost)}</TableCell>
      <TableCell>
        <TagCoverageBadge resource={resource} />
      </TableCell>
      <TableCell>{resource.tags.Environment || ''}</TableCell>
      <TableCell>{resource.tags.Owner || ''}</TableCell>
      <TableCell>{resource.tags.BusinessUnit || ''}</TableCell>
      <TableCell>{resource.tags.CostCenter || ''}</TableCell>
      <TableCell>{resource.tags.Project || ''}</TableCell>
      <TableCell>{resource.tags.Customer || ''}</TableCell>
    </TableRow>
  );
}

