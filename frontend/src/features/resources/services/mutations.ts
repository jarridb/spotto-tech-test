import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-client';
import type { Tags, TagKey, UpdateResourceTagsResponse, BulkTagPreview, BulkTagResponse } from '@spotto/types';
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

/**
 * Mutation hook for bulk add/edit tag operations
 */
export function useBulkAddEditTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ resourceIds, tagsToAdd, preview = false }: { resourceIds: string[]; tagsToAdd: Tags; preview?: boolean }) => {
      const requestBody = {
        resourceIds,
        tagsToAdd,
        preview,
      };

      const response = await apiRequest<BulkTagPreview | BulkTagResponse>(
        '/resources/bulk-tag',
        {
          method: 'POST',
          body: JSON.stringify(requestBody),
        }
      );
      return response;
    },
    onSuccess: (_data, variables) => {
      // Only invalidate if not in preview mode
      if (!variables.preview) {
        queryClient.invalidateQueries({ queryKey: ['resources'] });
        // Invalidate individual resource queries
        variables.resourceIds.forEach((id) => {
          queryClient.invalidateQueries({ queryKey: ['resources', id] });
        });
      }
    },
  });
}
