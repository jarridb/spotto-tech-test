import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomeComponent,
  loader: () => ({
    breadcrumb: 'Dashboard',
  }),
});

function HomeComponent() {
  return <div>Home</div>;
}
