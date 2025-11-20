import type { Resource } from '@spotto/types';
import { seedResources } from './seed-data.js';

// In-memory storage - mutable for tag updates and bulk operations
let resources: Resource[] = [...seedResources];

/**
 * Get all resources (returns a copy to prevent external mutation)
 */
export function getAllResources(): Resource[] {
  return [...resources];
}

/**
 * Get a resource by ID
 */
export function getResourceById(id: string): Resource | undefined {
  return resources.find((r) => r.id === id);
}

/**
 * Update a resource's tags
 */
export function updateResourceTags(id: string, tags: Resource['tags']): Resource | null {
  const resource = resources.find((r) => r.id === id);
  if (!resource) {
    return null;
  }

  resource.tags = { ...tags };
  return { ...resource };
}

/**
 * Remove a tag from a resource
 */
export function removeResourceTag(id: string, tagKey: keyof Resource['tags']): Resource | null {
  const resource = resources.find((r) => r.id === id);
  if (!resource) {
    return null;
  }

  const updatedTags = { ...resource.tags };
  delete updatedTags[tagKey];
  resource.tags = updatedTags;
  return { ...resource };
}

/**
 * Update multiple resources' tags (bulk operation)
 */
export function bulkUpdateResourceTags(
  resourceIds: string[],
  tagsToAdd: Resource['tags']
): { updated: Resource[]; errors: Array<{ resourceId: string; error: string }> } {
  const updated: Resource[] = [];
  const errors: Array<{ resourceId: string; error: string }> = [];

  for (const resourceId of resourceIds) {
    const resource = resources.find((r) => r.id === resourceId);
    if (!resource) {
      errors.push({ resourceId, error: 'Resource not found' });
      continue;
    }

    // Merge tags: tagsToAdd overwrites existing tags
    resource.tags = { ...resource.tags, ...tagsToAdd };
    updated.push({ ...resource });
  }

  return { updated, errors };
}

/**
 * Remove a tag from multiple resources (bulk operation)
 */
export function bulkRemoveResourceTags(
  resourceIds: string[],
  tagKey: keyof Resource['tags']
): { updated: Resource[]; errors: Array<{ resourceId: string; error: string }> } {
  const updated: Resource[] = [];
  const errors: Array<{ resourceId: string; error: string }> = [];

  for (const resourceId of resourceIds) {
    const resource = resources.find((r) => r.id === resourceId);
    if (!resource) {
      errors.push({ resourceId, error: 'Resource not found' });
      continue;
    }

    // Remove the tag if it exists
    if (resource.tags[tagKey]) {
      const updatedTags = { ...resource.tags };
      delete updatedTags[tagKey];
      resource.tags = updatedTags;
      updated.push({ ...resource });
    }
  }

  return { updated, errors };
}

/**
 * Reset resources to seed data (useful for testing)
 */
export function resetResources(): void {
  resources = [...seedResources];
}

