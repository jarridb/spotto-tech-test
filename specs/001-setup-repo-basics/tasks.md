# Tasks: Repository Setup and Basic Building Blocks

**Input**: Design documents from `/specs/001-setup-repo-basics/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are NOT included in this phase as they were not explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`, `types/src/`
- Root configuration files: `.nvmrc`, `.npmrc`, `tsconfig.base.json`, `package.json`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create root package.json with workspaces configuration in package.json
- [x] T002 Create .nvmrc file with Node.js version 20.11.0 in .nvmrc
- [x] T003 Create .npmrc file with workspace configuration in .npmrc
- [x] T004 [P] Create tsconfig.base.json with shared TypeScript configuration in tsconfig.base.json
- [x] T005 [P] Create .prettierrc configuration file in .prettierrc
- [x] T006 [P] Create .eslintrc.json configuration file in .eslintrc.json
- [x] T007 Create frontend workspace directory structure (frontend/package.json, frontend/tsconfig.json, frontend/src/)
- [x] T008 Create backend workspace directory structure (backend/package.json, backend/tsconfig.json, backend/src/)
- [x] T009 Create types workspace directory structure (types/package.json, types/tsconfig.json, types/src/)
- [x] T010 [P] Install frontend dependencies (React, Vite, TanStack Router, Tailwind CSS) in frontend/package.json
- [x] T011 [P] Install backend dependencies (Express, TypeScript) in backend/package.json
- [x] T012 [P] Install shared types workspace dependencies in types/package.json
- [x] T013 [P] Install root devDependencies (Prettier, ESLint, Husky) in package.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T014 Configure frontend tsconfig.json to extend tsconfig.base.json in frontend/tsconfig.json
- [x] T015 Configure backend tsconfig.json to extend tsconfig.base.json in backend/tsconfig.json
- [x] T016 Configure types tsconfig.json to extend tsconfig.base.json in types/tsconfig.json
- [x] T017 [P] Create Vite configuration file in frontend/vite.config.ts
- [x] T018 [P] Create frontend index.html entry point in frontend/index.html
- [x] T019 Create root npm scripts for concurrent server startup in package.json (dev, dev:frontend, dev:backend)
- [x] T020 Create verification script that checks Node version, workspace structure, and dependencies in package.json (verify script)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Developer Sets Up Development Environment (Priority: P1) 🎯 MVP

**Goal**: Enable developers to clone the repository, install dependencies, verify configuration, and run both frontend and backend servers successfully.

**Independent Test**: A developer can clone the repository, run `npm install`, execute `npm run verify` (passes all checks), and run `npm run dev` (both servers start successfully).

### Implementation for User Story 1

- [x] T021 [US1] Implement Node.js version check in verification script (package.json verify script)
- [x] T022 [US1] Implement workspace structure validation in verification script (package.json verify script)
- [x] T023 [US1] Implement dependency installation check in verification script (package.json verify script)
- [x] T024 [US1] Create frontend dev server script in frontend/package.json (dev script using Vite)
- [x] T025 [US1] Create backend dev server script in backend/package.json (dev script using tsx/ts-node)
- [x] T026 [US1] Implement concurrent server startup script in package.json (dev script using concurrently)
- [x] T027 [US1] Add error handling for Node.js version mismatch with actionable messages
- [x] T028 [US1] Add error handling for port conflicts (3001, 5173) with clear error messages
- [x] T029 [US1] Add error handling for missing workspace directories with clear error messages
- [x] T030 [US1] Add error handling for dependency installation failures with actionable guidance

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Developers can successfully set up and run the development environment.

---

## Phase 4: User Story 2 - Developer Views Basic Application Pages (Priority: P2)

**Goal**: Enable developers to navigate between Dashboard and Resources pages, confirming frontend routing and basic layout are functional.

**Independent Test**: With frontend server running, a developer can navigate to root URL (sees Dashboard page), click "Resources" link (navigates to Resources page), and see sidebar navigation on all pages.

### Implementation for User Story 2

- [ ] T031 [US2] Create React entry point in frontend/src/main.tsx
- [ ] T032 [US2] Create root App component in frontend/src/App.tsx
- [ ] T033 [US2] Configure TanStack Router with route definitions in frontend/src/routes/index.tsx
- [ ] T034 [P] [US2] Create Dashboard page component (empty) in frontend/src/routes/dashboard.tsx
- [ ] T035 [P] [US2] Create Resources page component (empty) in frontend/src/routes/resources.tsx
- [ ] T036 [US2] Create Sidebar navigation component with Dashboard and Resources links in frontend/src/components/sidebar.tsx
- [ ] T037 [US2] Integrate Sidebar component into App layout in frontend/src/App.tsx
- [ ] T038 [US2] Configure root route (/) to render Dashboard page in frontend/src/routes/index.tsx
- [ ] T039 [US2] Configure /resources route to render Resources page in frontend/src/routes/index.tsx
- [ ] T040 [US2] Add Tailwind CSS configuration and base styles in frontend/
- [ ] T041 [US2] Verify routing works by testing navigation between pages

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Frontend routing and navigation are functional.

---

## Phase 5: User Story 3 - Developer Verifies Backend API is Responsive (Priority: P2)

**Goal**: Enable developers to verify the backend API server is running and responding to requests, establishing backend infrastructure is operational.

**Independent Test**: With backend server running, a developer can make GET request to /api/health and receive JSON response `{"status": "ok"}`. Errors and warnings are logged to console.

### Implementation for User Story 3

- [ ] T042 [US3] Create Express server entry point in backend/src/index.ts
- [ ] T043 [US3] Configure Express server to listen on port 3001 in backend/src/index.ts
- [ ] T044 [US3] Create health check route handler in backend/src/routes/health.ts
- [ ] T045 [US3] Implement GET /api/health endpoint returning `{"status": "ok"}` in backend/src/routes/health.ts
- [ ] T046 [US3] Register health check route in Express app in backend/src/index.ts
- [ ] T047 [US3] Implement 404 handler for non-existent endpoints in backend/src/index.ts
- [ ] T048 [US3] Configure error logging middleware (errors and warnings only) in backend/src/middleware/error-logger.ts
- [ ] T049 [US3] Add error handling for port conflicts with clear error messages in backend/src/index.ts
- [ ] T050 [US3] Verify health check endpoint responds correctly

**Checkpoint**: At this point, all user stories should be independently functional. Backend API is operational and responsive.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T051 [P] Update README.md with setup instructions from quickstart.md
- [ ] T052 [P] Verify all TypeScript compilation succeeds without errors across all workspaces
- [ ] T053 [P] Verify all npm scripts work correctly (dev, dev:frontend, dev:backend, verify)
- [ ] T054 [P] Test edge cases: wrong Node version, port conflicts, missing configs, dependency failures
- [ ] T055 [P] Ensure error messages are clear and actionable per FR-016
- [ ] T056 [P] Verify concurrent server startup works without port conflicts
- [ ] T057 [P] Run quickstart.md validation steps
- [ ] T058 Code cleanup and formatting (run Prettier/ESLint)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 for dev server scripts, but routing can be implemented independently
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Completely independent of US1 and US2

### Within Each User Story

- Configuration before implementation
- Core implementation before error handling
- Basic functionality before edge cases
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T004-T006, T010-T013)
- All Foundational tasks marked [P] can run in parallel (T017-T018)
- Once Foundational phase completes, User Stories 2 and 3 can start in parallel (they don't depend on each other)
- Models/components within a story marked [P] can run in parallel (T034-T035)
- Different user stories can be worked on in parallel by different team members after Foundational phase

---

## Parallel Example: User Story 2

```bash
# Launch Dashboard and Resources page components in parallel:
Task: "Create Dashboard page component (empty) in frontend/src/routes/dashboard.tsx"
Task: "Create Resources page component (empty) in frontend/src/routes/resources.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Run `npm install` → verify dependencies install
   - Run `npm run verify` → verify all checks pass
   - Run `npm run dev` → verify both servers start
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
   - Developers can set up and run development environment
3. Add User Story 2 → Test independently → Deploy/Demo
   - Developers can navigate frontend pages
4. Add User Story 3 → Test independently → Deploy/Demo
   - Developers can verify backend API is responsive
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (setup and dev scripts)
   - Developer B: User Story 2 (frontend routing) - can start in parallel with US1
   - Developer C: User Story 3 (backend API) - can start in parallel with US1
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Error handling tasks (T027-T030, T048-T049) should provide clear, actionable messages per FR-016
- Port configuration: Backend 3001, Frontend 5173 (per plan.md)
- Empty pages are acceptable for US2 (routing validation is the goal)

---

## Task Summary

**Total Tasks**: 58

**Tasks per Phase**:

- Phase 1 (Setup): 13 tasks
- Phase 2 (Foundational): 7 tasks
- Phase 3 (User Story 1): 10 tasks
- Phase 4 (User Story 2): 11 tasks
- Phase 5 (User Story 3): 9 tasks
- Phase 6 (Polish): 8 tasks

**Tasks per User Story**:

- User Story 1: 10 tasks
- User Story 2: 11 tasks
- User Story 3: 9 tasks

**Parallel Opportunities Identified**:

- Setup phase: 8 parallelizable tasks
- Foundational phase: 2 parallelizable tasks
- User Story 2: 2 parallelizable tasks (Dashboard and Resources pages)
- User Stories 2 and 3 can be implemented in parallel after Foundational phase

**Independent Test Criteria**:

- **User Story 1**: Clone repo → `npm install` → `npm run verify` (passes) → `npm run dev` (both servers start)
- **User Story 2**: Frontend running → navigate to `/` (Dashboard) → click "Resources" → navigate to `/resources` → see sidebar on all pages
- **User Story 3**: Backend running → GET `/api/health` → receive `{"status": "ok"}` → verify error logging works

**Suggested MVP Scope**: User Story 1 only (enables development environment setup)

**Format Validation**: ✅ All tasks follow checklist format with checkbox, ID, optional [P] marker, optional [Story] label, and file paths
