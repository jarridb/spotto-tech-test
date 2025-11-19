import { createFileRoute } from '@tanstack/react-router';
import { ResourceList } from '@/features/resources/components/resource-list';

export const Route = createFileRoute('/resources/')({
  component: ResourcesComponent,
  loader: () => ({
    breadcrumb: 'Resources',
  }),
});

function ResourcesComponent() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Resources</h1>
        <p className="text-muted-foreground">Manage and view your cloud resources</p>
      </div>
      <ResourceList />
    </div>
  );
}
