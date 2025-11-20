# Tasks: Resources List Feature

**Input**: Design documents from `/specs/002-resources-list/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Organization**: Tasks are organized by user story to enable independent implementation and testing. Each task group follows backend/frontend commit split as specified in spec.md.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2], [US3])
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Set up shared types, seed data, and tag schema that all user stories depend on

- [X] T001 Create shared types and enums in types/src/index.ts (Provider, ResourceType, Environment, BusinessUnit, Tags, TagKey, Resource, ResourceWithCoverage, TagCoverage, CoverageStats, and all API models)
- [X] T002 Create seed data with 20 mock resources in backend/src/data/seed-data.ts
- [X] T003 Create in-memory storage functions in backend/src/data/resources.ts (getAllResources, getResourceById, updateResource)
- [X] T004 Create tag schema definition in backend/src/data/tag-schema.ts (required and optional tags with allowed values) - Note: Implemented as backend/src/schemas/tag-schemas.ts

**Checkpoint**: Shared types, seed data, and tag schema ready - foundational work can begin

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Create coverage calculation service in backend/src/services/coverage-service.ts (calculateResourceCoverage, isCompliant, addCoverageToResource functions)
- [X] T006 Create tag validation service in backend/src/services/tag-service.ts (validateTags, validateTagValue functions)
- [X] T006a [P] Create unit tests for tag validation service in backend/src/services/tag-service.test.ts (test validateTags with valid/invalid enum values, empty strings, test validateTagValue for all tag types, test isValidTagKey)
- [X] T007 Create resource service in backend/src/services/resource-service.ts (filtering and sorting logic functions)
- [X] T008 Create Zod schemas for request/response validation in backend/src/schemas/resource-schemas.ts
- [X] T009 Create Zod schemas for tag validation in backend/src/schemas/tag-schemas.ts
- [X] T010 Create Zod schemas for query parameters in backend/src/schemas/query-schemas.ts
- [X] T011 Create API client configuration in frontend/src/lib/api-client.ts (base URL, error handling, response parsing)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View Resources List (Priority: P1) 🎯 MVP

**Goal**: Display all cloud resources in a table format with tag coverage indicators, enabling FinOps analysts to quickly assess resource inventory and tag coverage.

**Independent Test**: Open Resources page and verify all 20 resources from seed data are displayed in table format with all required columns (Checkbox, Name, Type, Provider, Region, Monthly Cost, Tag Coverage, Environment, Owner, BusinessUnit, CostCenter, Project, Customer) visible.

### Backend Implementation (Commit 1)

- [X] T012 [US1] Create GET /api/resources route handler in backend/src/routes/resources.ts (returns all resources with tag coverage)
- [X] T013 [US1] Integrate coverage service in GET /api/resources endpoint to add tagCoverage to each resource
- [X] T014 [US1] Add error handling middleware for GET /api/resources endpoint in backend/src/routes/resources.ts
- [X] T015 [US1] Register resources routes in backend/src/index.ts
- [X] T015a [US1] [P] Add API endpoint tests for GET /api/resources in backend/src/routes/resources.test.ts (test list endpoint returns resources with coverage, test filtering, test sorting)

### Frontend Implementation (Commit 2)

- [X] T016 [US1] Create API fetch function for GET /api/resources in frontend/src/features/resources/services/api.ts
- [X] T017 [US1] Create TanStack Query hook for resources list in frontend/src/features/resources/services/queries.ts (useResources hook)
- [X] T018 [US1] Create resource table component in frontend/src/features/resources/components/resource-table.tsx (table structure with all 13 columns)
- [X] T019 [US1] Create resource row component in frontend/src/features/resources/components/resource-row.tsx (individual table row)
- [X] T020 [US1] Create tag coverage badge component in frontend/src/features/resources/components/tag-coverage-badge.tsx (displays "X/Y required tags" format)
- [X] T021 [US1] Create main resource list component in frontend/src/features/resources/components/resource-list.tsx (orchestrates table, loading, error states)
- [X] T022 [US1] Update resources index route in frontend/src/routes/resources.index.tsx to render ResourceList component
- [X] T023 [US1] Add checkboxes (select all header checkbox and individual row checkboxes) in frontend/src/features/resources/components/resource-table.tsx
- [X] T024 [US1] Implement empty state component in frontend/src/features/resources/components/resource-list.tsx (displays when no resources match filters)
- [X] T025 [US1] Implement loading state in frontend/src/features/resources/components/resource-list.tsx
- [X] T026 [US1] Implement error state in frontend/src/features/resources/components/resource-list.tsx
- [X] T026a [US1] [P] Create component test for ResourceList in frontend/src/features/resources/components/resource-list.test.tsx (test rendering, loading state, error state, resource display)

**Checkpoint**: User Story 1 should be fully functional - all 20 resources display in table with tag coverage badges

---

## Phase 4: User Story 2 - View Single Resource Details (Priority: P1)

**Goal**: Display complete information for a single resource including all properties and tags, enabling FinOps analysts to understand resource configuration before making tag changes.

**Independent Test**: Click on any resource from the list and verify all resource properties (Name, ID, Provider, Type, Region, Monthly Cost) and tags are displayed correctly in organized cards.

### Backend Implementation (Commit 3)

- [X] T027 [US2] Create GET /api/resources/:id route handler in backend/src/routes/resources.ts (returns single resource by ID)
- [X] T028 [US2] Add 404 error handling for non-existent resource IDs in backend/src/routes/resources.ts
- [X] T029 [US2] Add error handling middleware for GET /api/resources/:id endpoint

### Frontend Implementation (Commit 4)

- [X] T030 [US2] Create API fetch function for GET /api/resources/:id in frontend/src/features/resources/services/api.ts
- [X] T031 [US2] Create TanStack Query hook for single resource in frontend/src/features/resources/services/queries.ts (useResource hook)
- [X] T032 [US2] Create resource detail component in frontend/src/features/resources/components/resource-detail.tsx (main detail view container)
- [X] T033 [US2] Create resource properties card component in frontend/src/features/resources/components/resource-properties-card.tsx (displays Name, ID, Provider, Type, Region, Monthly Cost)
- [X] T034 [US2] Create resource tags card component in frontend/src/features/resources/components/resource-tags-card.tsx (displays Required Tags and Optional Tags sections)
- [X] T035 [US2] Add back navigation button in frontend/src/features/resources/components/resource-detail.tsx
- [X] T036 [US2] Update resources detail route in frontend/src/routes/resources.$id.tsx to render ResourceDetail component
- [X] T037 [US2] Add click handler to resource rows in frontend/src/features/resources/components/resource-row.tsx to navigate to detail page

**Checkpoint**: User Story 2 should be fully functional - clicking a resource navigates to detail page showing all properties and tags

---

## Phase 5: User Story 3 - Filter Resources (Priority: P2)

**Goal**: Enable filtering by Provider, Type, or Region to focus on specific resource subsets for analysis and tag management.

**Independent Test**: Apply filters and verify only matching resources are displayed. Filter badges appear and can be removed individually or all at once.

### Backend Implementation (Commit 5)

- [X] T038 [US3] Add filtering logic to resource service in backend/src/services/resource-service.ts (filterByProvider, filterByType, filterByRegion functions)
- [X] T039 [US3] Update GET /api/resources endpoint to accept filter query parameters (provider, type, region) in backend/src/routes/resources.ts
- [X] T040 [US3] Integrate filtering logic into GET /api/resources endpoint handler
- [X] T041 [US3] Add validation for filter query parameters using Zod schemas in backend/src/routes/resources.ts

### Frontend Implementation (Commit 6)

- [X] T042 [US3] Create filter state management hook in frontend/src/features/resources/hooks/use-resource-filters.ts
- [X] T043 [US3] Create resource filters component in frontend/src/features/resources/components/resource-filters.tsx (filter buttons with popovers)
- [X] T044 [US3] Create filter badges component in frontend/src/features/resources/components/filter-badges.tsx (displays active filters with X icons)
- [X] T045 [US3] Integrate filter state with useResources query hook in frontend/src/features/resources/services/queries.ts
- [X] T046 [US3] Update resource list component to display filter UI in frontend/src/features/resources/components/resource-list.tsx
- [X] T047 [US3] Implement "Remove filters" button in filter popover footer in frontend/src/features/resources/components/resource-filters.tsx
- [X] T048 [US3] Dynamically populate Region filter values from resources data in frontend/src/features/resources/components/resource-filters.tsx
- [X] T049 [US3] Update empty state to show "Clear filters" action when filters are active in frontend/src/features/resources/components/resource-list.tsx

**Checkpoint**: User Story 3 should be fully functional - filters work correctly, badges display, and empty state shows when no matches

---

## Phase 6: User Story 4 - Sort Resources (Priority: P2)

**Goal**: Enable sorting by Name, Provider, or Monthly Cost to organize resources for analysis and identify high-cost resources.

**Independent Test**: Click sortable column headers and verify resources are reordered correctly. Sort indicators show current sort column and direction.

### Backend Implementation (Commit 7)

- [X] T050 [US4] Add sorting logic to resource service in backend/src/services/resource-service.ts (sortByName, sortByProvider, sortByMonthlyCost functions)
- [X] T051 [US4] Update GET /api/resources endpoint to accept sort query parameters (sortBy, sortOrder) in backend/src/routes/resources.ts
- [X] T052 [US4] Integrate sorting logic into GET /api/resources endpoint handler
- [X] T053 [US4] Add validation for sort query parameters using Zod schemas in backend/src/routes/resources.ts

### Frontend Implementation (Commit 8)

- [X] T054 [US4] Create sort state management hook in frontend/src/features/resources/hooks/use-resource-sort.ts
- [X] T055 [US4] Add sortable column headers to resource table in frontend/src/features/resources/components/resource-table.tsx (Name, Provider, Monthly Cost columns)
- [X] T056 [US4] Add visual sort indicators (arrows) to sortable column headers in frontend/src/features/resources/components/resource-table.tsx
- [X] T057 [US4] Implement sort toggle functionality (clicking same column toggles asc/desc) in frontend/src/features/resources/components/resource-table.tsx
- [X] T058 [US4] Integrate sort state with useResources query hook in frontend/src/features/resources/services/queries.ts
- [X] T059 [US4] Ensure sort state persists when filters are applied/removed in frontend/src/features/resources/hooks/use-resource-sort.ts

**Checkpoint**: User Story 4 should be fully functional - sorting works for Name, Provider, and Monthly Cost columns with visual indicators

---

## Phase 7: User Story 5 - Edit Tags on Resource Detail Page (Priority: P2)

**Goal**: Enable adding, editing, and removing tags on a single resource's detail page to improve resource compliance and enable accurate cost allocation.

**Independent Test**: Edit tags on resource detail page and verify changes are saved and reflected immediately. Required tags can be added, optional tags can be added/edited/removed.

### Backend Implementation (Commit 9)

- [X] T060 [US5] Create POST /api/resources/:id/tag route handler in backend/src/routes/resources.ts (adds or edits single tag) - Note: Implemented as PATCH /api/resources/:id/tags
- [X] T061 [US5] Create DELETE /api/resources/:id/tag route handler in backend/src/routes/resources.ts (removes single tag) - Note: Implemented as DELETE /api/resources/:id/tags/:tagKey
- [X] T062 [US5] Integrate tag validation service into POST /api/resources/:id/tag endpoint
- [X] T063 [US5] Add validation error responses for invalid tag keys/values in backend/src/routes/resources.ts
- [X] T064 [US5] Update resource in-memory storage when tags are added/edited/removed in backend/src/data/resources.ts
- [X] T064a [US5] [P] Add API endpoint tests for tag operations in backend/src/routes/resources.test.ts (test PATCH /api/resources/:id/tags updates tags, test DELETE /api/resources/:id/tags/:tagKey removes tags, test validation errors)

### Frontend Implementation (Commit 10)

- [X] T065 [US5] Create API fetch functions for POST /api/resources/:id/tag and DELETE /api/resources/:id/tag in frontend/src/features/resources/services/api.ts - Note: Implemented via mutations.ts
- [X] T066 [US5] Create TanStack Query mutations for tag operations in frontend/src/features/resources/services/mutations.ts (useAddEditResourceTag, useRemoveResourceTag hooks)
- [X] T067 [US5] Implement tag editing UI in resource tags card component in frontend/src/features/resources/components/resource-tags-card.tsx (edit mode with input field and Save button)
- [X] T068 [US5] Implement "Add value" button for missing required tags in frontend/src/features/resources/components/resource-tags-card.tsx
- [X] T069 [US5] Implement Remove button (X) for optional tags in frontend/src/features/resources/components/resource-tags-card.tsx
- [X] T070 [US5] Implement "Add tag" button and popover for optional tags in frontend/src/features/resources/components/resource-tags-card.tsx
- [X] T071 [US5] Add validation error display for invalid tag values in frontend/src/features/resources/components/resource-tags-card.tsx
- [X] T072 [US5] Implement optimistic updates and query invalidation after tag mutations in frontend/src/features/resources/services/mutations.ts
- [X] T073 [US5] Hide Remove button when tag is in edit mode in frontend/src/features/resources/components/resource-tags-card.tsx

**Checkpoint**: User Story 5 should be fully functional - tags can be added, edited, and removed on detail page with validation

---

## Phase 8: User Story 6 - Bulk Edit Tags on Resource List (Priority: P3)

**Goal**: Enable bulk tag operations (add, edit, remove) across multiple selected resources simultaneously for efficient tag management.

**Independent Test**: Select 2+ resources, choose bulk tag operation, preview changes, and apply them. Verify all selected resources are updated correctly.

### Backend Implementation (Commit 11)

- [X] T074 [US6] Create POST /api/resources/bulk/tag route handler in backend/src/routes/resources.ts (bulk add/edit tag with preview support) - Note: Implemented as POST /api/resources/bulk-tag
- [X] T075 [US6] Create DELETE /api/resources/bulk/tag route handler in backend/src/routes/resources.ts (bulk remove tag with preview support) - Note: Implemented as DELETE /api/resources/bulk-tag
- [X] T076 [US6] Implement preview mode logic for bulk operations in backend/src/routes/resources.ts (returns BulkTagPreview when preview=true)
- [X] T077 [US6] Implement bulk tag application logic in backend/src/routes/resources.ts (updates all resources when preview=false)
- [X] T078 [US6] Add validation for bulk operation request bodies using Zod schemas in backend/src/routes/resources.ts
- [X] T079 [US6] Add error handling for partial failures in bulk operations (returns BulkTagResponse with errors array)

### Frontend Implementation (Commit 12)

- [X] T080 [US6] Create API fetch functions for POST /api/resources/bulk/tag and DELETE /api/resources/bulk/tag in frontend/src/features/resources/services/api.ts - Note: Implemented via mutations.ts
- [X] T081 [US6] Create TanStack Query mutations for bulk operations in frontend/src/features/resources/services/mutations.ts (useBulkAddEditTag, useBulkRemoveTag hooks)
- [X] T082 [US6] Implement selection state management in frontend/src/features/resources/components/resource-list.tsx (track selected resource IDs)
- [X] T083 [US6] Implement "Select all" checkbox functionality in frontend/src/features/resources/components/resource-table.tsx (selects only visible resources)
- [X] T084 [US6] Create bulk edit action buttons component in frontend/src/features/resources/components/resource-list.tsx (Add Tag, Edit Tag, Remove Tag buttons - appears when 2+ selected)
- [X] T085 [US6] Create bulk edit sheet component in frontend/src/features/resources/components/bulk-edit-sheet.tsx (sheet UI for bulk operations)
- [X] T086 [US6] Implement tag dropdown logic in bulk edit sheet (shows appropriate tags based on operation type) in frontend/src/features/resources/components/bulk-edit-sheet.tsx
- [X] T087 [US6] Implement single input field for tag value in bulk edit sheet in frontend/src/features/resources/components/bulk-edit-sheet.tsx
- [X] T088 [US6] Implement preview display in bulk edit sheet (shows each resource's current and new tags) in frontend/src/features/resources/components/bulk-edit-sheet.tsx
- [X] T089 [US6] Implement summary messages in bulk edit sheet (shows how many resources will be updated) in frontend/src/features/resources/components/bulk-edit-sheet.tsx
- [X] T090 [US6] Implement Apply and Cancel actions in bulk edit sheet in frontend/src/features/resources/components/bulk-edit-sheet.tsx
- [X] T091 [US6] Implement query invalidation after bulk operations to refresh resource list in frontend/src/features/resources/services/mutations.ts

**Checkpoint**: User Story 6 should be fully functional - bulk tag operations work with preview mode and apply to all selected resources

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and refinements that affect multiple user stories

- [ ] T092 [P] Add comprehensive error handling for all API endpoints in backend/src/routes/resources.ts
- [ ] T093 [P] Add loading states for all async operations in frontend components
- [ ] T094 [P] Add error boundaries for frontend components in frontend/src/features/resources/components/
- [ ] T095 [P] Implement proper TypeScript types throughout (ensure no 'any' types)
- [ ] T096 [P] Add accessibility attributes (ARIA labels, keyboard navigation) to all interactive components
- [ ] T097 [P] Optimize performance (ensure list loads within 2 seconds per SC-001)
- [ ] T098 [P] Verify all success criteria from spec.md are met
- [ ] T099 [P] Run quickstart.md validation checklist
- [ ] T100 [P] Code cleanup and refactoring (remove unused code, improve naming)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately (assumes Step 1 complete)
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories can proceed sequentially in priority order (P1 → P2 → P3)
  - US1 and US2 (both P1) can be done in parallel after foundational
  - US3, US4, US5 (all P2) can be done in parallel after US1/US2
  - US6 (P3) depends on US5 completion (needs tag editing functionality)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Depends on US1 for navigation from list
- **User Story 3 (P2)**: Can start after US1 completion - Extends GET /api/resources endpoint
- **User Story 4 (P2)**: Can start after US1 completion - Extends GET /api/resources endpoint
- **User Story 5 (P2)**: Can start after US2 completion - Needs resource detail page
- **User Story 6 (P3)**: Can start after US5 completion - Needs tag editing functionality

### Within Each User Story

- Backend implementation tasks complete before frontend implementation
- Core functionality before error handling and edge cases
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1**: T002, T003, T004 can run in parallel (different files)
- **Phase 2**: T008, T009, T010 can run in parallel (different schema files)
- **Phase 3 (US1 Backend)**: T012, T013, T014 can run sequentially (same file)
- **Phase 3 (US1 Frontend)**: T018, T019, T020 can run in parallel (different component files)
- **Phase 4 (US2)**: Can start in parallel with US1 frontend after US1 backend complete
- **Phase 5-6 (US3, US4)**: Can run in parallel after US1 complete (different endpoints/UI)
- **Phase 7 (US5)**: Must wait for US2 completion
- **Phase 8 (US6)**: Must wait for US5 completion
- **Phase 9**: All tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1 Frontend

```bash
# Launch all component creation tasks together (different files):
Task: "Create resource table component in frontend/src/features/resources/components/resource-table.tsx"
Task: "Create resource row component in frontend/src/features/resources/components/resource-row.tsx"
Task: "Create tag coverage badge component in frontend/src/features/resources/components/tag-coverage-badge.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (shared types, seed data, tag schema)
2. Complete Phase 2: Foundational (services, API client)
3. Complete Phase 3: User Story 1 (View Resources List)
4. **STOP and VALIDATE**: Test User Story 1 independently - verify all 20 resources display correctly
5. Deploy/demo if ready

### Incremental Delivery (Recommended)

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Stories 3 & 4 → Test independently → Deploy/Demo (filtering and sorting)
5. Add User Story 5 → Test independently → Deploy/Demo (tag editing)
6. Add User Story 6 → Test independently → Deploy/Demo (bulk operations)
7. Polish phase → Final refinements

### Backend/Frontend Split Strategy

As specified in spec.md, each task group follows backend/frontend commit split:

- **Commit 1**: View Resources List (Backend) (T012-T015)
- **Commit 2**: View Resources List (Frontend) (T016-T026)
- **Commit 3**: View Single Resource Details (Backend) (T027-T029)
- **Commit 4**: View Single Resource Details (Frontend) (T030-T037)
- **Commit 5**: Resources (Backend) (T038-T041)
- **Commit 6**: Resources (Frontend) (T042-T049)
- **Commit 7**: Sort Resources (Backend) (T050-T053)
- **Commit 8**: Sort Resources (Frontend) (T054-T059)
- **Commit 9**: Edit Tags on Resource Detail Page (Backend) (T060-T064)
- **Commit 10**: Edit Tags on Resource Detail Page (Frontend) (T065-T073)
- **Commit 11**: Bulk Edit Tags on Resource List (Backend) (T074-T079)
- **Commit 12**: Bulk Edit Tags on Resource List (Frontend) (T080-T091)

---

## Notes

- [P] tasks = different files, no dependencies - can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Backend tasks complete before frontend tasks for each story
- Commit after each task group (backend + frontend) as specified
- Stop at any checkpoint to validate story independently
- Verify all acceptance scenarios from spec.md are met
- Ensure performance meets success criteria (SC-001 through SC-010)
