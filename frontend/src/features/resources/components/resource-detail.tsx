import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ResourcePropertiesCard } from './resource-properties-card';
import { ResourceTagsCard } from './resource-tags-card';
import { Skeleton } from '@/components/ui/skeleton';
import type { ResourceWithCoverage } from '@spotto/types';

interface ResourceDetailProps {
  resource: ResourceWithCoverage | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function ResourceDetail({ resource, isLoading, error }: ResourceDetailProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate({ to: '/resources' });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4 p-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold">
              {error.message.includes('404') || error.message.includes('not found')
                ? 'Resource not found'
                : 'Failed to load resource'}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              {error.message.includes('404') || error.message.includes('not found')
                ? 'The resource you are looking for does not exist or has been removed.'
                : error.message}
            </p>
          </div>
          <Button onClick={handleBack}>Back to Resources</Button>
        </div>
      </div>
    );
  }

  if (!resource) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack} aria-label="Back to resources">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">{resource.name}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ResourcePropertiesCard resource={resource} />
        <ResourceTagsCard resource={resource} />
      </div>
    </div>
  );
}

