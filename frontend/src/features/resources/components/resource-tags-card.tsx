import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { ResourceWithCoverage } from '@spotto/types';

interface ResourceTagsCardProps {
  resource: ResourceWithCoverage;
}

const REQUIRED_TAGS: Array<keyof ResourceWithCoverage['tags']> = [
  'Environment',
  'Owner',
  'BusinessUnit',
];

const OPTIONAL_TAGS: Array<keyof ResourceWithCoverage['tags']> = [
  'CostCenter',
  'Project',
  'Customer',
];

export function ResourceTagsCard({ resource }: ResourceTagsCardProps) {
  const requiredTags = REQUIRED_TAGS.filter((key) => {
    const value = resource.tags[key];
    return value !== undefined && value !== null && value !== '';
  });

  const optionalTags = OPTIONAL_TAGS.filter((key) => {
    const value = resource.tags[key];
    return value !== undefined && value !== null && value !== '';
  });

  const hasAnyTags = requiredTags.length > 0 || optionalTags.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tags</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasAnyTags ? (
          <p className="text-sm text-muted-foreground">No tags assigned to this resource.</p>
        ) : (
          <div className="space-y-6">
            {/* Required Tags Section */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Required Tags</h4>
              {requiredTags.length === 0 ? (
                <p className="text-sm text-muted-foreground">No required tags assigned.</p>
              ) : (
                <dl className="space-y-2">
                  {requiredTags.map((key) => (
                    <div key={key} className="flex justify-between">
                      <dt className="text-sm font-medium text-muted-foreground">{key}</dt>
                      <dd className="text-sm">{String(resource.tags[key])}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            {/* Separator */}
            {requiredTags.length > 0 && optionalTags.length > 0 && <Separator />}

            {/* Optional Tags Section */}
            {optionalTags.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3">Optional Tags</h4>
                <dl className="space-y-2">
                  {optionalTags.map((key) => (
                    <div key={key} className="flex justify-between">
                      <dt className="text-sm font-medium text-muted-foreground">{key}</dt>
                      <dd className="text-sm">{String(resource.tags[key])}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

