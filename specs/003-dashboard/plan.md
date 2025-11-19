# Implementation Plan: Dashboard Implementation

**Branch**: `003-dashboard` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-dashboard/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement the tag coverage dashboard feature enabling FinOps analysts to view key compliance metrics at a glance. The dashboard displays three cards: Overview (overall compliance and cost coverage), Required Tag Coverage (per-tag coverage percentages), and Non-Compliant Resources (top non-compliant resources by cost). Implementation will be split into separate backend and frontend commits for incremental development and testing.

## Technical Context

**Language/Version**: TypeScript 5.9.3, Node.js v20.x  
**Primary Dependencies**:

- Frontend: React 19.2, Vite 7.2.2, TanStack Router 2.15.3, TanStack Query 6.6.7, Tailwind CSS 4.0, Shadcn/ui
- Backend: Express 4.x, TypeScript 5.9.3
- Shared: @spotto/types package (shared types)
- Tooling: npm workspaces, Prettier 3.x, ESLint 9.x

**Storage**: In-memory array (resources stored in backend memory, seeded with 20 mock resources)  
**Testing**: Vitest 4.x (unit/component), Playwright 1.x (E2E/API)  
**Target Platform**: Web application (browser + Node.js server)  
**Project Type**: Web application (monorepo with frontend + backend)  

**Performance Goals**:
- Dashboard loads and displays all metrics within 2 seconds (SC-005)
- Coverage API response time under 500ms
- Progress bars render smoothly without jank
- Responsive layout adapts quickly on window resize

**Constraints**:
- Backend coverage endpoint needs to be updated to include `nonCompliantResources` array
- Frontend API client and TanStack Query hooks already configured
- Coverage calculation service already implemented
- Resources list feature must be implemented (for navigation to filtered view)
- Separate commits for backend and frontend work
- Dashboard is home page (route: `/` or `/dashboard`)

**Scale/Scope**:
- 3 dashboard cards (Overview, Required Tag Coverage, Non-Compliant Resources)
- 1 API endpoint (GET /api/coverage - needs update for non-compliant resources)
- 3 user stories with 20 functional requirements
- Frontend: Dashboard container, 3 card components, progress bar component
- Backend: Update coverage endpoint to include non-compliant resources list

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**Status**: No project-specific constitution file found. Using default development practices.

**Gates**:

- ✅ **Code Quality**: ESLint and Prettier configured for consistent formatting
- ✅ **Testing**: Vitest and Playwright available for test coverage (testing deferred to implementation phase)
- ✅ **Type Safety**: TypeScript strict mode enforced, shared types via @spotto/types
- ✅ **Version Control**: Git hooks via Husky for pre-commit checks
- ✅ **Documentation**: SPEC.md provides comprehensive API and feature documentation
- ✅ **API Design**: RESTful API following existing patterns from Step 2 Setup
- ✅ **Component Architecture**: Feature-based organization following README.md guidelines

**No violations detected** - implementation follows established patterns from Step 2 Setup.

## Project Structure

### Documentation (this feature)

```text
specs/003-dashboard/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Backend structure (update existing coverage endpoint)
backend/src/
├── routes/
│   └── coverage.ts            # Update GET /api/coverage to include nonCompliantResources
├── services/
│   └── coverage-service.ts    # Update to calculate and return non-compliant resources list
└── data/
    └── resources.ts           # In-memory storage (already exists)

# Frontend structure (to be implemented)
frontend/src/
├── features/
│   └── dashboard/
│       ├── components/
│       │   ├── dashboard.tsx              # Main dashboard container
│       │   ├── overview-card.tsx          # Overview card component
│       │   ├── tag-coverage-card.tsx      # Required tag coverage card
│       │   ├── non-compliant-card.tsx     # Non-compliant resources card
│       │   └── progress-bar.tsx           # Reusable progress bar component
│       └── hooks/
│           └── use-coverage.ts            # Coverage data hook (if needed)
├── services/
│   └── coverage/
│       ├── api.ts                        # Coverage API function
│       ├── queries.ts                    # TanStack Query hook
│       └── mutations.ts                  # Mutations (if needed)
└── routes/
    └── index.tsx                         # Dashboard route (home page)
```

## Phase 0: Outline & Research

### Research Tasks

Based on the specification, the following areas need research/validation:

1. **Shadcn/ui Card component usage** - Best practices for dashboard card layouts
2. **Progress bar component patterns** - How to implement accessible, visually accurate progress bars
3. **Responsive grid layouts** - Best practices for 3-column desktop, stacked mobile layout
4. **Currency formatting** - Locale-aware currency formatting patterns
5. **Dashboard data refresh patterns** - Query invalidation strategies for dashboard updates
6. **Empty state patterns** - Best practices for empty states in dashboard cards

### Research Findings

_See research.md for detailed findings. Key decisions:_

- **Card Component**: Use Shadcn/ui Card component as base, customize for dashboard needs
- **Progress Bar**: Use HTML5 progress element or custom div with aria attributes for accessibility
- **Grid Layout**: Use CSS Grid or Flexbox with Tailwind responsive utilities
- **Currency Formatting**: Use Intl.NumberFormat for locale-aware formatting
- **Data Refresh**: Use TanStack Query's query invalidation when resources are updated
- **Empty States**: Use consistent empty state component pattern across all cards

## Phase 1: Design & Contracts

### Data Model

_See data-model.md for detailed entity definitions._

**Key Entities**:

- **TagCoverage**: Coverage metrics interface (extends existing, adds `nonCompliantResources` array)
- **NonCompliantResource**: Resource summary for dashboard (id, name, monthlyCost, compliance status)
- **CoverageStats**: Statistics for a group of resources (compliant count, total count, percentage)

**State Transitions**:

- Coverage data fetched → Display metrics in cards
- Resources updated → Invalidate coverage query → Refetch → Update cards
- Navigation to filtered resources → Apply compliant filter → Show filtered list

### API Contracts

_See contracts/ directory for OpenAPI specifications._

**Endpoints** (update existing):

- `GET /api/coverage` - Get coverage metrics (update to include `nonCompliantResources` array)

**Updated Response Structure**:

```typescript
interface TagCoverage {
  // ... existing fields ...
  nonCompliantResources: NonCompliantResource[]; // NEW: Top 5-10 non-compliant resources by cost
}

interface NonCompliantResource {
  id: string;
  name: string;
  monthlyCost: number;
  tagCoverage: number; // Percentage of required tags present
}
```

### Quickstart Guide

_See quickstart.md for developer setup and implementation steps._

## Phase 2: Implementation Strategy

### Commit Strategy

**Commit 1: Backend Implementation**
- Update coverage endpoint to include `nonCompliantResources` array
- Update coverage service to calculate and return top non-compliant resources
- Ensure proper sorting by cost (highest first)
- Limit to top 5-10 resources
- Test endpoint returns correct structure

**Commit 2: Frontend Implementation**
- Implement dashboard container component
- Implement three card components (Overview, Tag Coverage, Non-Compliant)
- Implement progress bar component
- Wire up TanStack Query hook for coverage data
- Implement navigation to filtered resources list
- Handle loading and error states
- Wire up route

### Implementation Order

1. **Backend Update** (Foundation)
   - Update coverage service to include non-compliant resources
   - Update coverage endpoint response
   - Test endpoint returns correct data

2. **Frontend Foundation** (Foundation)
   - Create dashboard feature directory structure
   - Create coverage API service function
   - Create TanStack Query hook

3. **Dashboard Container** (Core)
   - Create main dashboard component
   - Implement responsive grid layout
   - Wire up coverage data fetching

4. **Overview Card** (Core)
   - Create overview card component
   - Display overall compliance and cost coverage
   - Implement progress bars

5. **Tag Coverage Card** (Core)
   - Create tag coverage card component
   - Display per-tag coverage percentages
   - Implement progress bars for each tag
   - Order tags by coverage (lowest first)

6. **Non-Compliant Resources Card** (Core)
   - Create non-compliant card component
   - Display non-compliant resources list
   - Implement "View All" navigation
   - Handle empty state

7. **Progress Bar Component** (Shared)
   - Create reusable progress bar component
   - Ensure accessibility (ARIA attributes)
   - Support percentage display

8. **Integration & Polish** (Polish)
   - Wire up route
   - Handle loading/error states
   - Ensure responsive design
   - Test navigation to filtered resources

### Testing Strategy

**Unit Tests** (Vitest):
- Coverage service calculation logic
- Progress bar percentage calculations
- Currency formatting utilities
- Tag ordering logic

**Component Tests** (Vitest):
- Dashboard container rendering
- Card component rendering
- Progress bar rendering
- Empty state display

**E2E Tests** (Playwright):
- Dashboard loads and displays metrics
- Navigation to filtered resources list
- Error handling scenarios
- Responsive layout behavior

## Dependencies & Integration Points

### Backend Dependencies (Update Required)

- Coverage service (needs update to include non-compliant resources)
- Coverage route (needs update to include non-compliant resources in response)

### Frontend Dependencies (Already Configured)

- TanStack Query (data fetching)
- TanStack Router (routing and navigation)
- Shadcn/ui components (Card, Button, Progress)
- API client (configured in Step 2 Setup)

### Integration Points

- **API Integration**: Frontend calls updated coverage endpoint
- **Type Safety**: Shared types via @spotto/types package (needs update for NonCompliantResource)
- **Navigation**: Dashboard links to resources list with compliant filter applied
- **Data Refresh**: Coverage query invalidates when resources are updated

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Backend coverage endpoint not updated | High | Verify endpoint update before frontend implementation |
| Performance issues with coverage calculation | Low | Backend already calculates efficiently, non-compliant list is limited to 5-10 |
| Progress bar accessibility | Medium | Use semantic HTML5 progress or proper ARIA attributes |
| Responsive layout complexity | Low | Use Tailwind responsive utilities, test on multiple screen sizes |
| Navigation to filtered resources | Medium | Ensure resources list supports compliant filter parameter |

## Success Metrics

- ✅ All 20 functional requirements implemented
- ✅ All 3 user stories with acceptance scenarios pass
- ✅ All 10 success criteria met
- ✅ Performance: Dashboard loads within 2 seconds
- ✅ Type safety: No TypeScript errors
- ✅ Code quality: ESLint and Prettier pass
- ✅ User experience: Smooth interactions, clear metrics display

## Next Steps

1. Complete Phase 0 research (see research.md)
2. Complete Phase 1 design artifacts (data-model.md, contracts/, quickstart.md)
3. Run `/speckit.tasks` to break down into specific implementation tasks
4. Begin backend implementation (update coverage endpoint)
5. Begin frontend implementation

---

**Plan Status**: Phase 0 & Phase 1 Complete  
**Ready for**: `/speckit.tasks` to create detailed task breakdown

