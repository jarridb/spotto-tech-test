# Implementation Plan: Repository Setup and Basic Building Blocks

**Branch**: `001-setup-repo-basics` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-setup-repo-basics/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Set up a monorepo development environment with frontend (React/Vite) and backend (Express) workspaces, enabling developers to clone, install dependencies, verify configuration, and run both servers concurrently. The setup includes basic routing infrastructure (Dashboard and Resources pages) and a health check API endpoint to validate the foundation is operational.

## Technical Context

**Language/Version**: TypeScript 5.9.3, Node.js v20.x  
**Primary Dependencies**: 
- Frontend: React 19.2, Vite 7.2.2, TanStack Router 2.15.3, Tailwind CSS 4.0, Shadcn/ui
- Backend: Express 4.x
- Shared: TypeScript 5.9.3 (via types workspace)
- Tooling: npm workspaces, Prettier 3.x, ESLint 9.x, Husky 9.x  
**Storage**: N/A (in-memory storage for this phase)  
**Testing**: Vitest 4.x (unit/component), Playwright 1.x (E2E/API)  
**Target Platform**: Web application (browser + Node.js server)  
**Project Type**: Web application (monorepo with frontend + backend)  
**Performance Goals**: 
- Setup completion: <5 minutes (SC-001)
- Health check response: <100ms after server startup (SC-004)
- Server startup success rate: 95% on first attempt (SC-002)  
**Constraints**: 
- Node.js v20.x enforced via .nvmrc
- Ports: Backend 3001, Frontend 5173
- npm workspaces for monorepo structure
- TypeScript strict mode across all workspaces  
**Scale/Scope**: 
- Single developer local development environment
- 3 workspaces (frontend, backend, types)
- 2 basic pages (Dashboard, Resources)
- 1 API endpoint (health check)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: No project-specific constitution file found. Using default development practices.

**Gates**:
- ✅ **Code Quality**: ESLint and Prettier configured for consistent formatting
- ✅ **Testing**: Vitest and Playwright available for test coverage
- ✅ **Type Safety**: TypeScript strict mode enforced across workspaces
- ✅ **Version Control**: Git hooks via Husky for pre-commit checks
- ✅ **Documentation**: README.md provides setup instructions

**No violations detected** - setup phase follows standard best practices.

## Project Structure

### Documentation (this feature)

```text
specs/001-setup-repo-basics/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Monorepo structure (npm workspaces)
./
├── .nvmrc                    # Node.js version specification (20.11.0)
├── .npmrc                    # npm configuration (workspaces, exact versions)
├── .prettierrc               # Prettier configuration
├── .eslintrc.json            # ESLint configuration
├── tsconfig.base.json        # Shared TypeScript configuration
├── package.json               # Root workspace manifest
├── package-lock.json          # Locked dependency versions
│
├── frontend/                  # React frontend workspace
│   ├── package.json
│   ├── tsconfig.json         # Extends tsconfig.base.json
│   ├── vite.config.ts        # Vite build configuration
│   ├── index.html            # Entry HTML file
│   └── src/
│       ├── main.tsx           # React entry point
│       ├── App.tsx            # Root component
│       ├── routes/            # TanStack Router routes
│       │   ├── index.tsx      # Route definitions
│       │   ├── dashboard.tsx # Dashboard page (empty)
│       │   └── resources.tsx # Resources page (empty)
│       ├── components/        # React components
│       │   └── ui/           # Shadcn/ui components (to be added)
│       │   └── sidebar.tsx   # Sidebar navigation component
│       └── lib/              # Utility functions
│
├── backend/                  # Express backend workspace
│   ├── package.json
│   ├── tsconfig.json         # Extends tsconfig.base.json
│   └── src/
│       ├── index.ts          # Express server entry point
│       ├── routes/           # API route handlers
│       │   └── health.ts     # Health check endpoint
│       └── middleware/       # Express middleware
│
└── types/                    # Shared TypeScript types workspace
    ├── package.json
    ├── tsconfig.json         # Extends tsconfig.base.json
    └── src/
        └── index.ts          # Type exports (empty for now)
```

**Structure Decision**: Monorepo with npm workspaces containing three workspaces (frontend, backend, types). This structure enables shared TypeScript configuration and type definitions while maintaining clear separation of concerns. The structure aligns with the existing project layout documented in README.md.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected - standard monorepo setup following established patterns.
