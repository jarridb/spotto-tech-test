import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/resources/')({
  component: ResourcesComponent,
  loader: () => ({
    breadcrumb: 'Resources',
  }),
});

function ResourcesComponent() {
  return <div>Resources</div>;
}
