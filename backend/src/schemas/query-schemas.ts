import { z } from 'zod';

/**
 * Schema for validating resource list query parameters.
 * Filters are single-select (one value per filter type).
 */
export const ResourceListQuerySchema = z.object({
  provider: z.enum(['Azure', 'AWS', 'GCP']).optional(),
  type: z.string().optional(),
  region: z.string().optional(),
  sortBy: z.enum(['name', 'type', 'provider', 'region', 'monthlyCost', 'tagCoverage']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type ResourceListQuery = z.infer<typeof ResourceListQuerySchema>;

