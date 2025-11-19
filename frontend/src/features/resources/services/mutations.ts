import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-client';
import type { Tags, TagKey, UpdateResourceTagsResponse } from '@spotto/types';
import { getResource } from './api';

/**
 * Mutation hook for updating resource tags (add or edit)
 */
export function useUpdateResourceTags() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ resourceId, tags }: { resourceId: string; tags: Tags }) => {
      const response = await apiRequest<UpdateResourceTagsResponse>(
        `/resources/${resourceId}/tags`,
        {
          method: 'PATCH',
          body: JSON.stringify(tags),
        }
      );
      return response;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch resource queries
      queryClient.invalidateQueries({ queryKey: ['resources', variables.resourceId] });
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      
      // Optimistically update the cache
      queryClient.setQueryData(['resources', variables.resourceId], {
        resource: data.resource,
      });
    },
  });
}

/**
 * Mutation hook for removing a tag from a resource
 */
export function useRemoveResourceTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ resourceId, tagKey }: { resourceId: string; tagKey: TagKey }) => {
      // Get current resource to remove the tag
      const currentResource = await getResource(resourceId);
      const updatedTags = { ...currentResource.resource.tags };
      delete updatedTags[tagKey];

      const response = await apiRequest<UpdateResourceTagsResponse>(
        `/resources/${resourceId}/tags`,
        {
          method: 'PATCH',
          body: JSON.stringify(updatedTags),
        }
      );
      return response;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch resource queries
      queryClient.invalidateQueries({ queryKey: ['resources', variables.resourceId] });
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      
      // Optimistically update the cache
      queryClient.setQueryData(['resources', variables.resourceId], {
        resource: data.resource,
      });
    },
  });
}

