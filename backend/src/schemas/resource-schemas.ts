import { z } from 'zod';
import { TagsSchema } from './tag-schemas.js';

/**
 * Schema for validating bulk tag request body.
 */
export const BulkTagRequestSchema = z.object({
  resourceIds: z.array(z.string()).min(1, 'At least one resource ID is required'),
  tagsToAdd: TagsSchema,
  tagsToRemove: z.array(z.string()).optional(),
  preview: z.boolean().optional().default(false),
});

export type BulkTagRequest = z.infer<typeof BulkTagRequestSchema>;

