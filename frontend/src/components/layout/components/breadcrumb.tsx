import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  Breadcrumb as BreadcrumbPrimitive,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useMatches } from '@tanstack/react-router';
import React from 'react';

/**
 * Dynamic breadcrumb component that generates breadcrumbs from route matches
 * Uses route loader data to get breadcrumb labels
 */
export function Breadcrumb() {
  const matches = useMatches();

  // Filter out root route and build breadcrumb items from loader data
  const breadcrumbItems = matches
    .filter((match) => {
      // Skip root route
      if (match.routeId === '__root__') {
        return false;
      }
      return Boolean(match.loaderData?.breadcrumb);
    })
    .map((match, index, array) => {
      const isLast = index === array.length - 1;
      const pathname = match.pathname;
      const breadcrumb = (match.loaderData as { breadcrumb?: string })?.breadcrumb || match.routeId;

      return {
        label: breadcrumb,
        pathname,
        isLast,
      };
    });

  // Don't show breadcrumbs if we're on the dashboard (index route)
  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <BreadcrumbPrimitive>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbItems.map((item) => (
          <React.Fragment key={item.pathname}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.pathname}>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </BreadcrumbPrimitive>
  );
}
