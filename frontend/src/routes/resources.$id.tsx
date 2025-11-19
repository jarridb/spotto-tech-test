import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/resources/$id')({
  component: ResourceDetailComponent,
  loader: ({ params }) => ({
    breadcrumb: `Resource ${params.id}`,
  }),
});

function ResourceDetailComponent() {
  const { id } = Route.useParams();

  return <div>Resource Detail {id}</div>;
}
