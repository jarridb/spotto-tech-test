import { Badge } from '@/components/ui/badge';
import type { ResourceWithCoverage } from '@spotto/types';

interface TagCoverageBadgeProps {
  resource: ResourceWithCoverage;
}

const REQUIRED_TAGS_COUNT = 3;

export function TagCoverageBadge({ resource }: TagCoverageBadgeProps) {
  const { tagCoverage } = resource;
  const isCompliant = tagCoverage === 100;
  
  // Calculate number of required tags present
  const presentTagsCount = Math.round((tagCoverage / 100) * REQUIRED_TAGS_COUNT);

  return (
    <Badge variant={isCompliant ? 'success' : 'error'}>
      {presentTagsCount}/{REQUIRED_TAGS_COUNT} required tags
    </Badge>
  );
}

