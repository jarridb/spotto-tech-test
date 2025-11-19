import { useNavigate } from '@tanstack/react-router';
import { TableCell, TableRow } from '@/components/ui/table';
import { TagCoverageBadge } from './tag-coverage-badge';
import type { ResourceWithCoverage } from '@spotto/types';

interface ResourceRowProps {
  resource: ResourceWithCoverage;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function ResourceRow({ resource }: ResourceRowProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: '/resources/$id', params: { id: resource.id } });
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
          handleClick();
        }
      }}
    >
      <TableCell className="font-medium">{resource.name}</TableCell>
      <TableCell>{resource.type}</TableCell>
      <TableCell>{resource.provider}</TableCell>
      <TableCell>{resource.region}</TableCell>
      <TableCell>{formatCurrency(resource.monthlyCost)}</TableCell>
      <TableCell>
        <TagCoverageBadge resource={resource} />
      </TableCell>
    </TableRow>
  );
}

