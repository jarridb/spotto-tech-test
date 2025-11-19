import { z } from 'zod';

/**
 * Schema for validating tags object.
 * All fields are optional, but required tags must be present for compliance.
 */
export const TagsSchema = z.object({
  Environment: z.enum(['Production', 'Staging', 'Development', 'Testing']).optional(),
  Owner: z.string().min(1).optional(),
  BusinessUnit: z.enum(['Engineering', 'Sales', 'Marketing', 'Finance', 'Operations']).optional(),
  CostCenter: z.string().min(1).optional(),
  Project: z.string().min(1).optional(),
  Customer: z.string().min(1).optional(),
});

/**
 * Schema for validating required tags.
 * Environment, Owner, and BusinessUnit must be present and non-empty.
 */
export const RequiredTagsSchema = TagsSchema.required({
  Environment: true,
  Owner: true,
  BusinessUnit: true,
});

export type Tags = z.infer<typeof TagsSchema>;
export type RequiredTags = z.infer<typeof RequiredTagsSchema>;

