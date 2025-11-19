import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { routeTree } from './routeTree.gen';

// Create query client
const queryClient = new QueryClient();

// Create the router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  // TypeScript module augmentation - Register interface is used by TanStack Router for type inference
  // The interface is not directly referenced but is used by the framework for type checking
  // eslint-disable-next-line no-unused-vars
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
