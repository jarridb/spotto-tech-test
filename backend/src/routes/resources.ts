import { Router } from 'express';
import { ResourceListQuerySchema } from '../schemas/query-schemas.js';
import { TagsSchema } from '../schemas/tag-schemas.js';
import { BulkTagRequestSchema } from '../schemas/resource-schemas.js';
import type { TagKey } from '@spotto/types';
import { getResourceById, updateResourceTags, removeResourceTag, bulkUpdateResourceTags, bulkRemoveResourceTags } from '../data/resources.js';
import { getFilteredAndSortedResources } from '../services/resource-service.js';
import { addTagCoverageToResources } from '../services/coverage-service.js';
import { Provider } from '@spotto/types';

const router = Router();

// GET /api/resources - List resources with filtering/sorting
router.get('/', (req, res) => {
  // Validate query parameters with Zod
  const queryParseResult = ResourceListQuerySchema.safeParse(req.query);

  if (!queryParseResult.success) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid query parameters',
        details: queryParseResult.error.issues,
      },
    });
  }

  const query = {
    ...queryParseResult.data,
    provider: queryParseResult.data.provider as Provider | undefined,
  };

  // Get filtered and sorted resources
  const filteredResources = getFilteredAndSortedResources(query);

  // Add tag coverage to resources
  const resourcesWithCoverage = addTagCoverageToResources(filteredResources);

  res.json({
    resources: resourcesWithCoverage,
    total: resourcesWithCoverage.length,
  });
});

// GET /api/resources/:id - Get single resource
router.get('/:id', (req, res) => {
  const { id } = req.params;

  // Validate resource ID (basic validation - non-empty string)
  if (!id || typeof id !== 'string' || id.trim() === '') {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid resource ID',
      },
    });
  }

  const resource = getResourceById(id);

  if (!resource) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Resource not found',
      },
    });
  }

  // Add tag coverage to resource
  const resourceWithCoverage = addTagCoverageToResources([resource])[0];

  res.json({
    resource: resourceWithCoverage,
  });
});

// PATCH /api/resources/:id/tags - Update resource tags
router.patch('/:id/tags', (req, res) => {
  const { id } = req.params;

  // Validate resource ID
  if (!id || typeof id !== 'string' || id.trim() === '') {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid resource ID',
      },
    });
  }

  // Validate request body with Zod
  const tagsParseResult = TagsSchema.safeParse(req.body);

  if (!tagsParseResult.success) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid tags data',
        details: tagsParseResult.error.issues,
      },
    });
  }

  const tags = tagsParseResult.data;

  // Update resource tags
  const updatedResource = updateResourceTags(id, tags);

  if (!updatedResource) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Resource not found',
      },
    });
  }

  res.json({
    resource: updatedResource,
  });
});

// DELETE /api/resources/:id/tags/:tagKey - Remove a tag from a resource
router.delete('/:id/tags/:tagKey', (req, res) => {
  const { id, tagKey } = req.params;

  // Validate resource ID
  if (!id || typeof id !== 'string' || id.trim() === '') {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid resource ID',
      },
    });
  }

  // Validate tag key
  const validTagKeys: TagKey[] = ['Environment', 'Owner', 'BusinessUnit', 'CostCenter', 'Project', 'Customer'];
  if (!tagKey || !validTagKeys.includes(tagKey as TagKey)) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid tag key',
      },
    });
  }

  // Remove tag from resource
  const updatedResource = removeResourceTag(id, tagKey as TagKey);

  if (!updatedResource) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Resource not found',
      },
    });
  }

  res.json({
    resource: updatedResource,
  });
});

// POST /api/resources/bulk-tag - Bulk tag operations
router.post('/bulk-tag', (req, res) => {
  // Validate request body with Zod
  const bulkTagParseResult = BulkTagRequestSchema.safeParse(req.body);

  if (!bulkTagParseResult.success) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid bulk tag request',
        details: bulkTagParseResult.error.issues,
      },
    });
  }

  const { resourceIds, tagsToAdd, preview } = bulkTagParseResult.data;

  // If preview mode, return preview without making changes
  if (preview) {
    const previewItems = resourceIds.map((resourceId) => {
      const resource = getResourceById(resourceId);
      return {
        resourceId,
        resourceName: resource?.name || 'Unknown',
        existingTags: resource?.tags || {},
        newTags: { ...resource?.tags, ...tagsToAdd },
      };
    });

    return res.json({
      items: previewItems,
      summary: {
        totalResources: resourceIds.length,
        resourcesToUpdate: previewItems.length,
        tagsToAdd: Object.keys(tagsToAdd).length,
        tagsToRemove: 0,
      },
    });
  }

  // Perform bulk update
  const { updated, errors } = bulkUpdateResourceTags(resourceIds, tagsToAdd);

  res.json({
    success: errors.length === 0,
    updated: updated.length,
    errors: errors.length > 0 ? errors : undefined,
  });
});

// DELETE /api/resources/bulk-tag - Bulk remove tag operations
router.delete('/bulk-tag', (req, res) => {
  // Validate request body
  const { resourceIds, tagKey, preview } = req.body;

  if (!Array.isArray(resourceIds) || resourceIds.length === 0) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'resourceIds must be a non-empty array',
      },
    });
  }

  const validTagKeys: TagKey[] = ['Environment', 'Owner', 'BusinessUnit', 'CostCenter', 'Project', 'Customer'];
  if (!tagKey || !validTagKeys.includes(tagKey)) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid tag key',
      },
    });
  }

  // If preview mode, return preview without making changes
  if (preview) {
    const previewItems = resourceIds.map((resourceId: string) => {
      const resource = getResourceById(resourceId);
      const existingTags = resource?.tags || {};
      const newTags = { ...existingTags };
      delete newTags[tagKey as TagKey];

      return {
        resourceId,
        resourceName: resource?.name || 'Unknown',
        existingTags,
        newTags,
      };
    });

    const resourcesToUpdate = previewItems.filter((item: { existingTags: Record<string, unknown> }) => 
      item.existingTags[tagKey] !== undefined
    ).length;

    return res.json({
      items: previewItems,
      summary: {
        totalResources: resourceIds.length,
        resourcesToUpdate,
        tagsToAdd: 0,
        tagsToRemove: 1,
      },
    });
  }

  // Perform bulk remove
  const { updated, errors } = bulkRemoveResourceTags(resourceIds, tagKey as TagKey);

  res.json({
    success: errors.length === 0,
    updated: updated.length,
    errors: errors.length > 0 ? errors : undefined,
  });
});

export default router;
