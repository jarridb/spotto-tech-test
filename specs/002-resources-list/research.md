# Research: Resources List Feature

**Date**: 2025-01-27  
**Feature**: Resources List Feature (002-resources-list)

## Overview

This document consolidates research findings and technical decisions for implementing the Resources List feature. All technical choices align with the existing project stack and architecture patterns established in Step 1.

## Technology Decisions

### Decision: TanStack Query for Server State Management

**Rationale**: 
- Already established in project stack (TanStack Query 6.6.7)
- Provides automatic caching, background refetching, and stale-while-revalidate patterns
- Eliminates boilerplate for loading/error states
- Built-in optimistic updates and mutation handling
- Aligns with frontend stack documented in README.md

**Alternatives Considered**:
- Redux/Zustand: Rejected - adds unnecessary complexity for server state management
- SWR: Rejected - TanStack Query already in use, no need to introduce another library

**Implementation Pattern**:
- Use `useQuery` hooks for data fetching (resources list, single resource, tag schema, coverage)
- Use `useMutation` hooks for tag operations (add, edit, remove, bulk operations)
- Implement query invalidation after mutations to ensure UI consistency

---

### Decision: Zod for Request/Response Validation

**Rationale**:
- Already established in project stack (Zod used by Shadcn/ui forms)
- Works seamlessly with TypeScript for type inference
- Can be shared between frontend and backend
- Provides runtime validation for API requests/responses
- Aligns with validation strategy documented in README.md

**Alternatives Considered**:
- class-validator: Rejected - requires class-based approach, Zod is more flexible
- Yup: Rejected - Zod has better TypeScript integration
- Manual validation: Rejected - error-prone and inconsistent

**Implementation Pattern**:
- Define Zod schemas in `backend/src/schemas/` for request/response validation
- Use schemas to validate query parameters, request bodies, and generate TypeScript types
- Return validation errors in consistent format matching ErrorResponse interface

---

### Decision: In-Memory Storage for MVP

**Rationale**:
- Explicitly stated in spec assumptions (no database persistence required)
- Simplifies implementation for assessment scope
- All 20 resources fit comfortably in memory
- No persistence requirements for MVP
- Aligns with SPEC.md assumptions

**Alternatives Considered**:
- PostgreSQL/MongoDB: Rejected - out of scope for MVP, adds unnecessary complexity
- File-based storage: Rejected - in-memory is simpler for MVP requirements

**Implementation Pattern**:
- Store resources in array: `let resources: Resource[] = [...seedResources]`
- Provide accessor functions in `backend/src/data/resources.ts`
- Mutate array directly for tag operations (acceptable for single-user MVP)

---

### Decision: RESTful API Design

**Rationale**:
- Standard HTTP methods (GET, POST, DELETE) align with resource operations
- Clear separation between read (GET) and write (POST/DELETE) operations
- Express framework supports REST patterns naturally
- Aligns with API endpoint structure in SPEC.md

**Alternatives Considered**:
- GraphQL: Rejected - adds complexity, REST sufficient for MVP scope
- RPC-style endpoints: Rejected - REST provides better resource semantics

**Implementation Pattern**:
- GET endpoints for read operations (list, detail, schema, coverage)
- POST endpoints for create/update operations (add/edit tags)
- DELETE endpoints for remove operations (remove tags)
- Consistent error response format across all endpoints

---

### Decision: Shadcn/ui Components for UI

**Rationale**:
- Already established in project stack (Shadcn/ui)
- Provides accessible, Tailwind-based components
- Owns the code (not a dependency) - can customize as needed
- Components needed: Table, Popover, Sheet, Badge, Button, Input, Card
- Aligns with frontend stack documented in README.md

**Alternatives Considered**:
- Material-UI: Rejected - Shadcn/ui already in use, no need to introduce new library
- Custom components: Rejected - Shadcn/ui provides tested, accessible components

**Implementation Pattern**:
- Use Table component for resource list display
- Use Popover for filter dropdowns and tag selection
- Use Sheet component for bulk edit operations
- Use Badge for tag coverage and filter indicators
- Customize components as needed while maintaining accessibility

---

### Decision: Feature-Based Frontend Organization

**Rationale**:
- Aligns with frontend structure documented in README.md
- Features are self-contained modules (components, logic, types)
- Easier to locate and maintain code
- Better code organization and scalability
- Clear separation between features, shared components, and services

**Alternatives Considered**:
- Component-based organization: Rejected - less scalable, harder to find related code
- Page-based organization: Rejected - doesn't group related functionality

**Implementation Pattern**:
- `features/resources/` contains all resource-related code
- Components, hooks, and services grouped by feature
- Shared components in `components/ui/` and `components/layout/`
- Service layer structure: api.ts, queries.ts, mutations.ts

---

## Best Practices

### API Error Handling

**Pattern**: Consistent error response format
```typescript
interface ErrorResponse {
  error: {
    code: string; // 'NOT_FOUND', 'VALIDATION_ERROR', 'INTERNAL_ERROR'
    message: string; // Human-readable message
    details?: unknown; // Optional additional details
  };
}
```

**Rationale**: Provides consistent error handling across frontend and backend, enables user-friendly error messages.

---

### Tag Validation Strategy

**Pattern**: Validate against tag schema before saving
- Required tags: Environment, Owner, BusinessUnit (must be present and non-empty)
- Enum validation: Environment and BusinessUnit must match allowed values
- Optional tags: CostCenter, Project, Customer (can be added/removed freely)
- Empty string values: Invalid for all tags

**Rationale**: Ensures data integrity and compliance with tag schema requirements.

---

### Coverage Calculation

**Pattern**: Calculate coverage metrics server-side
- Resource coverage: Percentage of required tags present (0-100)
- Compliance: All 3 required tags AND at least 2 optional tags
- Cost-weighted compliance: Percentage of cost from compliant resources

**Rationale**: Centralizes business logic, ensures consistency, enables reuse across endpoints.

---

### Filter and Sort State Management

**Pattern**: Client-side state management with URL query params (future enhancement)
- Current: React state for filters and sort
- Future: Sync with URL query params for shareable/bookmarkable states

**Rationale**: Provides immediate functionality, URL sync can be added later if needed.

---

## Integration Patterns

### Frontend-Backend Communication

**Pattern**: REST API with JSON
- Frontend uses TanStack Query to fetch/mutate data
- Backend Express routes handle HTTP requests
- Shared types ensure type safety across stack
- API client centralizes base URL and error handling

**Rationale**: Standard web application pattern, well-supported by chosen stack.

---

### Type Safety Across Stack

**Pattern**: Shared types package (@spotto/types)
- All types exported from `types/src/index.ts`
- Frontend and backend import from `@spotto/types`
- Types match exactly with SPEC.md data models

**Rationale**: Prevents type drift, ensures consistency, enables compile-time error detection.

---

## Performance Considerations

### List Rendering

**Pattern**: Render all 20 resources without pagination
- No virtualization needed for 20 items
- Table component handles rendering efficiently
- Filtering/sorting happens server-side to reduce client work

**Rationale**: 20 resources is manageable without pagination, simplifies implementation.

---

### API Response Optimization

**Pattern**: Include tag coverage in list response
- Calculate coverage server-side
- Return ResourceWithCoverage[] in list endpoint
- Avoids additional API calls for coverage badges

**Rationale**: Reduces round trips, improves perceived performance.

---

## Security Considerations

**Note**: Authentication/authorization out of scope for MVP (per spec assumptions)

**Future Considerations**:
- Input sanitization for tag values
- Rate limiting for API endpoints
- CORS configuration (already handled in Step 1)

---

## Testing Strategy

### Unit Tests (Vitest)

**Pattern**: Test business logic and utilities
- Coverage calculation functions
- Tag validation logic
- Filter/sort functions
- Component rendering logic

**Rationale**: Fast feedback, catches logic errors early.

---

### Integration Tests (Playwright)

**Pattern**: Test user workflows end-to-end
- Resource list display
- Filtering and sorting
- Tag editing flows
- Bulk operations

**Rationale**: Validates complete user journeys, catches integration issues.

---

## Summary

All technical decisions align with the existing project stack and architecture. No new technologies need to be introduced. The implementation will follow established patterns from Step 1 while adding the resource management functionality specified in the feature spec.

**Key Takeaways**:
- Use existing stack (React, Express, TanStack Query, Zod, Shadcn/ui)
- Follow feature-based frontend organization
- Implement RESTful API with consistent error handling
- Validate tags against schema before saving
- Calculate coverage server-side for consistency
- Test with Vitest (unit) and Playwright (E2E)
