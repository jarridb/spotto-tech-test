import { createFileRoute } from '@tanstack/react-router';
import { ResourceDetail } from '@/features/resources/components/resource-detail';
import { useResource } from '@/features/resources/services/queries';

export const Route = createFileRoute('/resources/$id')({
  component: ResourceDetailComponent,
  loader: ({ params }) => ({
    breadcrumb: `Resource ${params.id}`,
  }),
});

function ResourceDetailComponent() {
  const { id } = Route.useParams();
  const { data, isLoading, error } = useResource(id);

  return (
    <ResourceDetail
      resource={data?.resource}
      isLoading={isLoading}
      error={error instanceof Error ? error : null}
    />
  );
}
