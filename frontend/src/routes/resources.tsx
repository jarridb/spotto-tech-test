import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/resources')({
  component: ResourcesLayout,
  loader: () => ({
    breadcrumb: 'Resources',
  }),
});

function ResourcesLayout() {
  return <Outlet />;
}
