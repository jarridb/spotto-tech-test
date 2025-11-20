import { Badge } from '@/components/ui/badge';
import type { ResourceWithCoverage } from '@spotto/types';

interface TagCoverageBadgeProps {
  resource: ResourceWithCoverage;
}

const TOTAL_TAGS_DISPLAY = 5;

export function TagCoverageBadge({ resource }: TagCoverageBadgeProps) {
  // tagCoverage now represents the count of tags present (up to 5)
  const presentTagsCount = resource.tagCoverage;
  const isCompliant = presentTagsCount >= 5; // 3 required + 2 optional minimum

  return (
    <Badge variant={isCompliant ? 'success' : 'error'}>
      {presentTagsCount}/{TOTAL_TAGS_DISPLAY} tags
    </Badge>
  );
}

