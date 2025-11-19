# Implementation Plan: Resources List Feature

**Branch**: `002-resources-list` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-resources-list/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a comprehensive Resources List feature enabling FinOps analysts to view, filter, sort, and manage tags for cloud resources. The feature includes a resource list table with tag coverage indicators, filtering by Provider/Type/Region, sorting capabilities, single-resource tag editing, and bulk tag operations. Implementation follows a backend/frontend split across 12 commits organized into 6 task groups, building on the foundation established in Step 1 (Repository Setup).

## Technical Context

**Language/Version**: TypeScript 5.9.3, Node.js v20.x  
**Primary Dependencies**:
- Frontend: React 19.2, Vite 7.2.2, TanStack Router 2.15.3, TanStack Query 6.6.7, Tailwind CSS 4.0, Shadcn/ui
- Backend: Express 4.x, Zod (for validation)
- Shared: TypeScript 5.9.3 (via @spotto/types workspace)
- Tooling: npm workspaces, Vitest 4.x, Playwright 1.x

**Storage**: In-memory array (no database for MVP)  
**Testing**: Vitest 4.x (unit/component), Playwright 1.x (E2E/API)  
**Target Platform**: Web application (browser + Node.js server)  
**Project Type**: Web application (monorepo with frontend + backend)  

**Performance Goals**:
- Resource list load: <2 seconds for 20 resources (SC-001)
- Filter updates: <1 second response time (SC-002)
- Sort updates: Immediate (no perceived delay) (SC-003)
- Navigation to detail: <1 second (SC-004)
- Tag operations: <2 seconds for single resource, <5 seconds for bulk (SC-005, SC-006)

**Constraints**:
- In-memory storage (no persistence)
- No pagination (20 resources max)
- Single user scenario (no concurrent conflict resolution)
- No authentication/authorization required
- Tag validation via Zod schemas
- Empty tag values not allowed

**Scale/Scope**:
- 20 resources from seed data
- 6 task groups (View List, View Detail, Filter, Sort, Edit Tags, Bulk Edit)
- 12 commits (backend/frontend split per task group)
- 8 API endpoints (GET /resources, GET /resources/:id, POST/DELETE /resources/:id/tag, POST/DELETE /resources/bulk/tag, GET /tag-schema, GET /coverage)
- 1 table component with 13 columns
- 3 filter types (Provider, Type, Region)
- 3 sortable columns (Name, Provider, Monthly Cost)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: No project-specific constitution file found. Using default development practices.

**Gates**:
- ✅ **Code Quality**: ESLint and Prettier configured for consistent formatting
- ✅ **Testing**: Vitest and Playwright available for test coverage
- ✅ **Type Safety**: TypeScript strict mode enforced, shared types via @spotto/types
- ✅ **Version Control**: Git hooks via Husky for pre-commit checks
- ✅ **Documentation**: SPEC.md provides detailed API and data model specifications
- ✅ **Architecture**: Monorepo structure with clear workspace separation

**No violations detected** - feature follows established patterns and best practices.

## Project Structure

### Documentation (this feature)

```text
specs/002-resources-list/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── resources-api.yaml  # OpenAPI spec for resource endpoints
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Monorepo structure (npm workspaces)
./
├── backend/                  # Express backend workspace
│   ├── src/
│   │   ├── index.ts          # Express server entry point
│   │   ├── data/
│   │   │   ├── seed-data.ts # 20 mock resources
│   │   │   ├── resources.ts # In-memory storage and access functions
│   │   │   └── tag-schema.ts # Tag schema definition
│   │   ├── routes/
│   │   │   ├── health.ts     # Health check endpoint (existing)
│   │   │   ├── resources.ts  # Resource CRUD endpoints
│   │   │   ├── tag-schema.ts # Tag schema endpoint
│   │   │   └── coverage.ts   # Coverage metrics endpoint
│   │   ├── services/
│   │   │   ├── resource-service.ts  # Filtering, sorting, finding resources
│   │   │   ├── tag-service.ts       # Tag validation and operations
│   │   │   └── coverage-service.ts  # Coverage calculation logic
│   │   └── schemas/
│   │       ├── resource-schemas.ts   # Zod schemas for resources
│   │       ├── tag-schemas.ts       # Zod schemas for tags
│   │       └── query-schemas.ts     # Zod schemas for query params
│   └── tests/
│       └── routes/
│           └── resources.test.ts   # API endpoint tests
│
├── frontend/                 # React frontend workspace
│   ├── src/
│   │   ├── features/
│   │   │   └── resources/
│   │   │       ├── components/
│   │   │       │   ├── resource-list.tsx          # Main list view
│   │   │       │   ├── resource-table.tsx         # Table component
│   │   │       │   ├── resource-row.tsx           # Table row component
│   │   │       │   ├── resource-filters.tsx       # Filter UI
│   │   │       │   ├── resource-detail.tsx        # Detail view
│   │   │       │   ├── resource-properties-card.tsx # Properties display
│   │   │       │   ├── resource-tags-card.tsx     # Tags display/edit
│   │   │       │   ├── tag-coverage-badge.tsx     # Coverage badge
│   │   │       │   ├── bulk-edit-sheet.tsx        # Bulk operations sheet
│   │   │       │   └── filter-badges.tsx          # Filter badge display
│   │   │       ├── hooks/
│   │   │       │   ├── use-resource-filters.ts    # Filter state management
│   │   │       │   └── use-resource-sort.ts      # Sort state management
│   │   │       └── services/
│   │   │           ├── api.ts                    # API fetch functions
│   │   │           ├── queries.ts                # TanStack Query hooks
│   │   │           └── mutations.ts              # TanStack Query mutations
│   │   ├── routes/
│   │   │   ├── resources.index.tsx               # List view route
│   │   │   └── resources.$id.tsx                  # Detail view route
│   │   └── lib/
│   │       └── api-client.ts                     # API client configuration
│   └── tests/
│       └── features/
│           └── resources/
│               └── resource-list.test.tsx         # Component tests
│
└── types/                    # Shared TypeScript types workspace
    └── src/
        └── index.ts          # All shared types and enums
```

**Structure Decision**: Monorepo with npm workspaces. Backend follows service-oriented structure with routes, services, and data layers. Frontend uses feature-based organization with components, hooks, and services per feature. Shared types exported from @spotto/types package. This structure aligns with existing project layout and enables clear separation of concerns while maintaining type safety across the stack.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected - feature follows established patterns and best practices.

---

## Phase 0: Research Complete

**Status**: ✅ Complete  
**Output**: [research.md](./research.md)

**Key Decisions**:
- TanStack Query for server state management (already in stack)
- Zod for request/response validation (already in stack)
- In-memory storage for MVP (per spec assumptions)
- RESTful API design (standard HTTP methods)
- Shadcn/ui components for UI (already in stack)
- Feature-based frontend organization (per README.md)

**No clarifications needed** - all technical decisions align with existing stack.

---

## Phase 1: Design Complete

**Status**: ✅ Complete  
**Outputs**:
- [data-model.md](./data-model.md) - Entity definitions, relationships, validation rules
- [contracts/resources-api.yaml](./contracts/resources-api.yaml) - OpenAPI specification
- [quickstart.md](./quickstart.md) - Implementation quick start guide

### Data Model Summary

**Core Entities**:
- Resource: Cloud resource with properties and tags
- Tags: Metadata key-value pairs (required: Environment, Owner, BusinessUnit; optional: CostCenter, Project, Customer)
- TagSchema: Validation rules for tags
- ResourceWithCoverage: Resource extended with coverage percentage
- TagCoverage: Overall coverage metrics

**API Models**: 15+ request/response models defined for all endpoints

**Validation Rules**: Tag validation, coverage calculation, compliance definition

### API Contracts Summary

**Endpoints Defined**:
- GET /api/resources - List with filtering/sorting
- GET /api/resources/:id - Get single resource
- POST /api/resources/:id/tag - Add/edit tag
- DELETE /api/resources/:id/tag - Remove tag
- POST /api/resources/bulk/tag - Bulk add/edit tag
- DELETE /api/resources/bulk/tag - Bulk remove tag
- GET /api/tag-schema - Get tag schema
- GET /api/coverage - Get coverage metrics

**All endpoints** include request/response schemas, error responses, and examples.

---

## Phase 2: Task Breakdown

**Status**: Pending  
**Next Command**: `/speckit.tasks`

Task breakdown will be generated by `/speckit.tasks` command, creating `tasks.md` with detailed implementation tasks organized by the 6 task groups and 12 commits.
