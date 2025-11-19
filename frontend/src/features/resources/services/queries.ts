import { useQuery } from '@tanstack/react-query';
import { getResources, getResource, type ResourceListQueryParams } from './api';

export function useResources(params?: ResourceListQueryParams) {
  return useQuery({
    queryKey: ['resources', params],
    queryFn: () => getResources(params),
  });
}

export function useResource(id: string) {
  return useQuery({
    queryKey: ['resource', id],
    queryFn: () => getResource(id),
    enabled: !!id,
  });
}

