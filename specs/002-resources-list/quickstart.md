# Quick Start: Resources List Feature

**Date**: 2025-01-27  
**Feature**: Resources List Feature (002-resources-list)

## Overview

This guide provides a quick start for implementing the Resources List feature. The feature is organized into 6 task groups, each split into backend and frontend commits (12 commits total).

## Prerequisites

- Step 1 (Repository Setup) must be complete
- Backend server running on `http://localhost:3001`
- Frontend dev server running on `http://localhost:5173`
- Shared types package (`@spotto/types`) available

## Implementation Order

Follow this order to implement the feature incrementally:

### Task Group 1: View Resources List
1. **Backend** (Commit 1): Implement `GET /api/resources` endpoint
2. **Frontend** (Commit 2): Implement resource list table component

### Task Group 2: View Single Resource Details
3. **Backend** (Commit 3): Implement `GET /api/resources/:id` endpoint
4. **Frontend** (Commit 4): Implement resource detail page component

### Task Group 3: Filter Resources
5. **Backend** (Commit 5): Add filtering logic to `GET /api/resources` endpoint
6. **Frontend** (Commit 6): Implement filter UI components and integration

### Task Group 4: Sort Resources
7. **Backend** (Commit 7): Add sorting logic to `GET /api/resources` endpoint
8. **Frontend** (Commit 8): Implement sortable column headers and integration

### Task Group 5: Edit Tags on Resource Detail Page
9. **Backend** (Commit 9): Implement `POST /api/resources/:id/tag` and `DELETE /api/resources/:id/tag` endpoints
10. **Frontend** (Commit 10): Implement tag editing UI on resource detail page

### Task Group 6: Bulk Edit Tags on Resource List
11. **Backend** (Commit 11): Implement `POST /api/resources/bulk/tag` and `DELETE /api/resources/bulk/tag` endpoints
12. **Frontend** (Commit 12): Implement bulk edit UI and sheet component

## Backend Quick Start

### 1. Set Up Seed Data

Create `backend/src/data/seed-data.ts`:
```typescript
import type { Resource } from '@spotto/types';

export const seedResources: Resource[] = [
  // All 20 resources from SPEC.md seed data section
];
```

### 2. Set Up In-Memory Storage

Create `backend/src/data/resources.ts`:
```typescript
import type { Resource } from '@spotto/types';
import { seedResources } from './seed-data';

let resources: Resource[] = [...seedResources];

export function getAllResources(): Resource[] {
  return resources;
}

export function getResourceById(id: string): Resource | undefined {
  return resources.find(r => r.id === id);
}

export function updateResource(id: string, updates: Partial<Resource>): Resource | null {
  const index = resources.findIndex(r => r.id === id);
  if (index === -1) return null;
  resources[index] = { ...resources[index], ...updates };
  return resources[index];
}
```

### 3. Set Up Tag Schema

Create `backend/src/data/tag-schema.ts`:
```typescript
import type { TagSchemaDefinition } from '@spotto/types';

export const tagSchema: TagSchemaDefinition = {
  required: [
    {
      key: 'Environment',
      required: true,
      allowedValues: ['Production', 'Staging', 'Development', 'Testing'] as const,
    },
    { key: 'Owner', required: true },
    {
      key: 'BusinessUnit',
      required: true,
      allowedValues: ['Engineering', 'Sales', 'Marketing', 'Finance', 'Operations'] as const,
    },
  ],
  optional: [
    { key: 'CostCenter', required: false },
    { key: 'Project', required: false },
    { key: 'Customer', required: false },
  ],
};
```

### 4. Create Service Layer

Create `backend/src/services/resource-service.ts` for filtering/sorting logic.

Create `backend/src/services/tag-service.ts` for tag validation.

Create `backend/src/services/coverage-service.ts` for coverage calculations.

### 5. Create Routes

Create `backend/src/routes/resources.ts` with all resource endpoints.

## Frontend Quick Start

### 1. Set Up API Client

Create `frontend/src/lib/api-client.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API request failed');
  }

  return response.json();
}
```

### 2. Set Up Service Layer

Create `frontend/src/features/resources/services/api.ts` with fetch functions.

Create `frontend/src/features/resources/services/queries.ts` with TanStack Query hooks.

Create `frontend/src/features/resources/services/mutations.ts` with TanStack Query mutations.

### 3. Create Components

Create components in `frontend/src/features/resources/components/`:
- `resource-list.tsx` - Main list view
- `resource-table.tsx` - Table component
- `resource-row.tsx` - Table row
- `resource-filters.tsx` - Filter UI
- `resource-detail.tsx` - Detail view
- `resource-tags-card.tsx` - Tags display/edit
- `bulk-edit-sheet.tsx` - Bulk operations sheet

### 4. Set Up Routes

Update `frontend/src/routes/resources.index.tsx` for list view.

Update `frontend/src/routes/resources.$id.tsx` for detail view.

## Key Implementation Notes

### Tag Coverage Calculation

Coverage is calculated as: `(presentRequiredTags / 3) * 100`

Example: Resource with Environment and Owner but missing BusinessUnit = 66.67% coverage.

### Compliance Definition

A resource is compliant if:
- All 3 required tags are present and non-empty: Environment, Owner, BusinessUnit
- At least 2 optional tags are present and non-empty

### Filter Behavior

- Single selection per filter category (new value replaces previous)
- Filters are combined with AND logic across categories
- Region filter values are dynamically populated from resources

### Sort Behavior

- Sortable columns: Name, Provider, Monthly Cost
- Clicking same column toggles sort order (asc/desc)
- Sort state persists when filters are applied/removed

### Bulk Operations

- Requires 2+ selected resources
- Supports preview mode (`preview: true`)
- Single input field applies same value to all selected resources

## Testing

### Backend Tests

Create `backend/src/routes/resources.test.ts`:
- Test GET /api/resources with filters/sort
- Test GET /api/resources/:id
- Test POST/DELETE /api/resources/:id/tag
- Test POST/DELETE /api/resources/bulk/tag

### Frontend Tests

Create `frontend/src/features/resources/components/resource-list.test.tsx`:
- Test component rendering
- Test filter interactions
- Test sort interactions
- Test selection behavior

## Common Patterns

### Error Handling

All endpoints return consistent error format:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Tag validation failed",
    "details": [...]
  }
}
```

### Tag Validation

Validate tags against schema before saving:
- Required tags must be present and non-empty
- Enum-type tags must match allowed values
- Empty string values are invalid

### Coverage Calculation

Calculate coverage server-side for consistency:
- Resource coverage: (presentRequiredTags / 3) * 100
- Compliance: All 3 required tags AND at least 2 optional tags
- Cost-weighted compliance: (compliantCost / totalCost) * 100

## Next Steps

After completing all 12 commits:

1. Verify all acceptance scenarios from spec.md
2. Run tests (unit and E2E)
3. Test error handling and edge cases
4. Verify performance meets success criteria
5. Review code for consistency and best practices

## Resources

- **Spec**: [spec.md](./spec.md)
- **Data Model**: [data-model.md](./data-model.md)
- **API Contracts**: [contracts/resources-api.yaml](./contracts/resources-api.yaml)
- **Research**: [research.md](./research.md)
