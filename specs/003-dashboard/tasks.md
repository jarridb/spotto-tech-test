# Implementation Tasks: Dashboard Implementation

**Feature**: Dashboard Implementation  
**Branch**: `003-dashboard`  
**Date**: 2025-01-27  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Summary

This document breaks down the dashboard feature implementation into actionable, dependency-ordered tasks organized by user story. Each task is independently executable and includes specific file paths.

**Total Tasks**: 63  
**P1 User Stories**: 3 (US1, US2, US3)  
**MVP Scope**: Phase 3 (US1 - Views Dashboard Overview) provides the foundation for all other dashboard cards.

## Implementation Strategy

**MVP First**: Start with User Story 1 (Views Dashboard Overview) to establish the foundation. This enables viewing overall compliance metrics and validates the API integration.

**Incremental Delivery**: Each user story phase is independently testable and can be delivered incrementally. All stories are P1 priority, so they can be implemented in sequence or in parallel.

**Backend/Frontend Split**: Backend update (coverage endpoint) is implemented first, then frontend components. Backend and frontend work will be in separate commits.

## Dependencies

**Story Completion Order**:
1. US1 (P1) - Views Dashboard Overview → Foundation for dashboard display
2. US2 (P1) - Views Required Tag Coverage → Depends on US1 for dashboard layout
3. US3 (P1) - Views Non-Compliant Resources → Depends on US1 for dashboard layout

**Parallel Opportunities**: Tasks marked with [P] can be executed in parallel within the same phase.

---

## Phase 1: Setup

**Goal**: Verify backend coverage endpoint and set up frontend project structure

**Independent Test**: Backend coverage endpoint responds correctly, frontend directory structure exists

### Backend Verification

- [ ] T001 Verify GET /api/coverage endpoint exists and returns coverage metrics in backend/src/routes/coverage.ts
- [ ] T002 Verify coverage service calculates overall compliance correctly in backend/src/services/coverage-service.ts
- [ ] T003 Verify coverage service calculates per-tag coverage correctly in backend/src/services/coverage-service.ts
- [ ] T004 Verify coverage service calculates cost-weighted compliance correctly in backend/src/services/coverage-service.ts

### Frontend Structure Setup

- [ ] T005 Create feature directory structure at frontend/src/features/dashboard/components
- [ ] T006 Verify services directory exists at frontend/src/services/coverage

---

## Phase 2: Foundational

**Goal**: Update backend coverage endpoint and set up frontend API service layer and shared components needed by all user stories

**Independent Test**: Backend coverage endpoint includes nonCompliantResources array, frontend API functions can fetch coverage data, progress bar component exists

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Backend Update

- [ ] T007 Update NonCompliantResource type definition in types/src/index.ts
- [ ] T008 Update TagCoverage interface to include nonCompliantResources array in types/src/index.ts
- [ ] T009 [P] Implement calculateNonCompliantResources function in backend/src/services/coverage-service.ts
- [ ] T010 [P] Update calculateCoverage function to include nonCompliantResources in backend/src/services/coverage-service.ts
- [ ] T011 Update GET /api/coverage endpoint to return nonCompliantResources array in backend/src/routes/coverage.ts
- [ ] T012 Test coverage endpoint returns nonCompliantResources array with correct structure

### Frontend API Service Layer

- [ ] T013 [P] Create getCoverage API function in frontend/src/services/coverage/api.ts
- [ ] T014 [P] Create useCoverage query hook in frontend/src/services/coverage/queries.ts

### Shared Components

- [ ] T015 [P] Create progress-bar.tsx component in frontend/src/features/dashboard/components/progress-bar.tsx
- [ ] T016 [P] Implement progress bar visual display with percentage in frontend/src/features/dashboard/components/progress-bar.tsx
- [ ] T017 [P] Add ARIA attributes for accessibility in frontend/src/features/dashboard/components/progress-bar.tsx
- [ ] T018 [P] Implement color variants (green/yellow/red) in frontend/src/features/dashboard/components/progress-bar.tsx
- [ ] T019 [P] Create currency formatting utility function in frontend/src/lib/utils.ts
- [ ] T020 [P] Create percentage formatting utility function in frontend/src/lib/utils.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - FinOps Analyst Views Dashboard Overview (Priority: P1) 🎯 MVP

**Goal**: Display overall compliance percentage and cost coverage metrics on the dashboard

**Independent Test**: Navigate to dashboard page and verify Overview card displays overall compliance as "X/Y resources (Z%)" and cost coverage as "$X.XX / $Y.YY (Z%)" with progress bars

**Acceptance Criteria**: All 7 acceptance scenarios from US1 pass

### Implementation for User Story 1

- [ ] T021 [US1] Create dashboard.tsx container component in frontend/src/features/dashboard/components/dashboard.tsx
- [ ] T022 [US1] Implement responsive grid layout (3 columns desktop, stacked mobile) in frontend/src/features/dashboard/components/dashboard.tsx
- [ ] T023 [US1] Integrate useCoverage hook in frontend/src/features/dashboard/components/dashboard.tsx
- [ ] T024 [US1] Handle loading state in dashboard container in frontend/src/features/dashboard/components/dashboard.tsx
- [ ] T025 [US1] Handle error state with retry option in frontend/src/features/dashboard/components/dashboard.tsx
- [ ] T026 [US1] Create overview-card.tsx component in frontend/src/features/dashboard/components/overview-card.tsx
- [ ] T027 [US1] Display overall compliance in "X/Y resources (Z%)" format in frontend/src/features/dashboard/components/overview-card.tsx
- [ ] T028 [US1] Display cost coverage in "$X.XX / $Y.YY (Z%)" format in frontend/src/features/dashboard/components/overview-card.tsx
- [ ] T029 [US1] Implement progress bar for overall compliance percentage in frontend/src/features/dashboard/components/overview-card.tsx
- [ ] T030 [US1] Implement progress bar for cost coverage percentage in frontend/src/features/dashboard/components/overview-card.tsx
- [ ] T031 [US1] Add OverviewCard to dashboard layout in frontend/src/features/dashboard/components/dashboard.tsx
- [ ] T032 [US1] Wire up dashboard route in frontend/src/routes/index.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - FinOps Analyst Views Required Tag Coverage (Priority: P1)

**Goal**: Display per-tag coverage percentages for all required tags (Environment, Owner, BusinessUnit)

**Independent Test**: View Required Tag Coverage card and verify all three required tags display with coverage percentages in "X/Y (Z%)" format and progress bars

**Acceptance Criteria**: All 5 acceptance scenarios from US2 pass

### Implementation for User Story 2

- [ ] T033 [US2] Create tag-coverage-card.tsx component in frontend/src/features/dashboard/components/tag-coverage-card.tsx
- [ ] T034 [US2] Display all three required tags (Environment, Owner, BusinessUnit) in frontend/src/features/dashboard/components/tag-coverage-card.tsx
- [ ] T035 [US2] Display each tag with coverage percentage in "X/Y (Z%)" format in frontend/src/features/dashboard/components/tag-coverage-card.tsx
- [ ] T036 [US2] Implement progress bar for each tag's coverage percentage in frontend/src/features/dashboard/components/tag-coverage-card.tsx
- [ ] T037 [US2] Implement tag ordering by coverage percentage (lowest first) in frontend/src/features/dashboard/components/tag-coverage-card.tsx
- [ ] T038 [US2] Handle alphabetical ordering when percentages are equal in frontend/src/features/dashboard/components/tag-coverage-card.tsx
- [ ] T039 [US2] Visually indicate 100% coverage when tag has complete coverage in frontend/src/features/dashboard/components/tag-coverage-card.tsx
- [ ] T040 [US2] Add TagCoverageCard to dashboard layout in frontend/src/features/dashboard/components/dashboard.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - FinOps Analyst Views Non-Compliant Resources (Priority: P1)

**Goal**: Display top non-compliant resources sorted by monthly cost (highest first)

**Independent Test**: View Non-Compliant Resources card and verify resources are displayed correctly sorted by cost with resource ID, formatted cost, and compliance status

**Acceptance Criteria**: All 6 acceptance scenarios from US3 pass

### Implementation for User Story 3

- [ ] T041 [US3] Create non-compliant-card.tsx component in frontend/src/features/dashboard/components/non-compliant-card.tsx
- [ ] T042 [US3] Display non-compliant resources list sorted by monthly cost (highest first) in frontend/src/features/dashboard/components/non-compliant-card.tsx
- [ ] T043 [US3] Display resource ID for each non-compliant resource in frontend/src/features/dashboard/components/non-compliant-card.tsx
- [ ] T044 [US3] Display monthly cost formatted as currency for each resource in frontend/src/features/dashboard/components/non-compliant-card.tsx
- [ ] T045 [US3] Display compliance status indicator for each resource in frontend/src/features/dashboard/components/non-compliant-card.tsx
- [ ] T046 [US3] Implement "View All Non-Compliant Resources" button in frontend/src/features/dashboard/components/non-compliant-card.tsx
- [ ] T047 [US3] Wire up navigation to resources list with compliant filter applied in frontend/src/features/dashboard/components/non-compliant-card.tsx
- [ ] T048 [US3] Implement empty state when all resources are compliant in frontend/src/features/dashboard/components/non-compliant-card.tsx
- [ ] T049 [US3] Add NonCompliantCard to dashboard layout in frontend/src/features/dashboard/components/dashboard.tsx

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final integration

- [ ] T050 [P] Add loading skeletons for each card in frontend/src/features/dashboard/components/dashboard.tsx
- [ ] T051 [P] Ensure all cards display loading states correctly in frontend/src/features/dashboard/components/dashboard.tsx
- [ ] T052 [P] Ensure all cards display error states correctly in frontend/src/features/dashboard/components/dashboard.tsx
- [ ] T053 [P] Test responsive design on desktop (3 columns) in frontend/src/features/dashboard/components/dashboard.tsx
- [ ] T054 [P] Test responsive design on tablet (2 columns) in frontend/src/features/dashboard/components/dashboard.tsx
- [ ] T055 [P] Test responsive design on mobile (stacked) in frontend/src/features/dashboard/components/dashboard.tsx
- [ ] T056 Verify coverage data refreshes when resources are updated (query invalidation) in frontend/src/services/coverage/queries.ts
- [ ] T057 Test navigation from dashboard to filtered resources list works correctly
- [ ] T058 Ensure all progress bars accurately represent percentages visually
- [ ] T059 Ensure currency values are formatted correctly with 2 decimal places
- [ ] T060 Verify dashboard loads and displays all metrics within 2 seconds
- [ ] T061 Run quickstart.md validation checklist
- [ ] T062 [P] Code cleanup and refactoring across dashboard components
- [ ] T063 [P] Update documentation if needed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can proceed sequentially (US1 → US2 → US3)
  - Or in parallel if team capacity allows (all are P1)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Depends on US1 for dashboard layout
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - Depends on US1 for dashboard layout

### Within Each User Story

- Components before integration
- Core implementation before polish
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, user stories can start in parallel (if team capacity allows)
- All shared component tasks marked [P] can run in parallel
- Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# All these tasks can run in parallel (different files, no dependencies):
Task: "Create dashboard.tsx container component"
Task: "Create overview-card.tsx component"
Task: "Wire up dashboard route"
```

---

## Parallel Example: Foundational Phase

```bash
# Backend update tasks (can run in parallel):
Task: "Implement calculateNonCompliantResources function"
Task: "Update calculateCoverage function to include nonCompliantResources"

# Frontend API tasks (can run in parallel):
Task: "Create getCoverage API function"
Task: "Create useCoverage query hook"

# Shared component tasks (can run in parallel):
Task: "Create progress-bar.tsx component"
Task: "Create currency formatting utility function"
Task: "Create percentage formatting utility function"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Overview Card)
   - Developer B: User Story 2 (Tag Coverage Card) - after US1 layout is ready
   - Developer C: User Story 3 (Non-Compliant Card) - after US1 layout is ready
3. Stories complete and integrate independently

### Backend/Frontend Split

**Commit 1: Backend Implementation**
- Tasks T007-T012 (Backend Update section)
- Update coverage endpoint to include nonCompliantResources array
- Test endpoint returns correct structure

**Commit 2: Frontend Implementation**
- Tasks T013-T063 (Frontend API, Components, Integration)
- Implement all dashboard UI components
- Wire up routes and navigation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each logical group (backend update, frontend components, integration)
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Backend and frontend work should be in separate commits
- All three user stories are P1 priority, so they can be implemented in sequence or parallel

---

**Tasks Status**: Complete  
**Ready for**: Implementation

