import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ResourceWithCoverage } from '@spotto/types';

interface ResourcePropertiesCardProps {
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

export function ResourcePropertiesCard({ resource }: ResourcePropertiesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Name</dt>
            <dd className="mt-1 text-sm font-semibold">{resource.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">ID</dt>
            <dd className="mt-1 text-sm font-mono">{resource.id}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Provider</dt>
            <dd className="mt-1 text-sm">{resource.provider}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Type</dt>
            <dd className="mt-1 text-sm">{resource.type}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Region</dt>
            <dd className="mt-1 text-sm">{resource.region}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Monthly Cost</dt>
            <dd className="mt-1 text-sm font-semibold">{formatCurrency(resource.monthlyCost)}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}

