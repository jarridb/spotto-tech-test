# Spotto Technical Assessment: Cloud Resource Tagging System

## Overview

At Spotto, we help enterprises manage multi-cloud costs through accurate resource tagging. One of our core features is the Universal Tagging Engine - a system that allows customers to tag cloud resources (VMs, databases, storage accounts) with metadata like Environment, Owner, CostCenter, etc.

---

## Setup Instructions

### Prerequisites

- **Node.js:** v20.x or higher (managed via `.nvmrc`)
- **npm:** v10.x or higher (configured via `.npmrc`)

### Initial Setup

```bash
# 1. Ensure you're using the correct Node version
nvm use

# If you don't have the required version installed:
nvm install

# 2. Clone the repository
git clone <repository-url>
cd spotto-tagging-system

# 3. Install dependencies
npm install

# 4. Set up environment variables (optional)
# Copy the root example environment file and customize if needed
cp .env.example .env

# Note: The application works with defaults, so this step is optional
# Only customize .env if you need to change ports or URLs
# Both backend and frontend read from the root .env file

# 5. Verify installation
npm run verify
```

### Running the Application

```bash
# Start both frontend and backend concurrently
npm run dev

# Or start them separately:
npm run dev:backend   # Starts on http://localhost:3000
npm run dev:frontend  # Starts on http://localhost:5173
```

---

## Architecture Decisions and Trade-offs

### Monorepo Structure

This application is built as a monorepo to leverage shared TypeScript configurations and types between frontend and backend.

**Reasons:**

- **Code Reuse:** Shared type definitions prevent duplication and ensure consistency across the stack
- **Simplified Dependency Management:** Single `package.json` at root reduces version conflicts
- **Atomic Changes:** Frontend and backend changes can be committed and deployed together
- **Developer Experience:** Single repository checkout with unified tooling

#### TypeScript Configuration

```
./tsconfig.base.json          # Root shared configuration
./frontend/tsconfig.json      # Extends base, frontend-specific settings
./backend/tsconfig.json       # Extends base, backend-specific settings
```

**Reasons:**

- Centralized compiler options ensure consistent build behavior
- Workspace-specific overrides allow flexibility for different runtime environments

#### Workspace Structure

```
./                  # Root workspace
./types             # Shared type definitions
./frontend          # React application
./backend           # Express API server
```

**Reasons:**

- Clear separation of concerns with explicit boundaries
- Shared types package prevents circular dependencies
- Easy to extract workspaces into separate repositories if needed

---

### Tooling

| Tool         | Version | Purpose         | Reasoning                                                                                 |
| ------------ | ------- | --------------- | ----------------------------------------------------------------------------------------- |
| **npm**      | 10.x    | Package Manager | Native to Node.js, adequate for monorepo without workspace complexity requiring pnpm/yarn |
| **Prettier** | 3.x     | Code Formatting | Industry standard, zero-configuration formatting                                          |
| **ESLint**   | 9.x     | Linting         | Catches errors early, enforces code quality standards                                     |
| **Husky**    | 9.x     | Git Hooks       | Pre-commit hooks ensure code quality before commits                                       |

#### Node Version Management (.nvmrc)

**Purpose:** Ensures all developers and CI/CD environments use the same Node.js version

**File Location:** `./.nvmrc`

**Content:**

```
20.11.0
```

**Reasons:**

- **Consistency:** Eliminates "works on my machine" issues caused by Node version differences
- **Compatibility:** Ensures all dependencies work with the specified Node version
- **CI/CD Alignment:** Build servers use the same version as local development
- **Team Onboarding:** New developers automatically use the correct version with `nvm use`

**Usage:**

```bash
# Automatically switch to project's Node version
nvm use

# Install the required version if not present
nvm install

# Verify current version
node --version  # Should match .nvmrc
```

**Trade-offs:**

- Requires developers to have `nvm` (Node Version Manager) installed
- Additional step in setup process
- **Benefit:** Prevents subtle bugs from Node version mismatches

---

#### NPM Configuration (.npmrc)

**Purpose:** Standardizes npm behavior across all developers and environments

**File Location:** `./.npmrc`

**Content:**

```
# Ensure consistent dependency resolution
save-exact=true

# Use package-lock.json for deterministic installs
package-lock=true

# Automatically install peer dependencies
legacy-peer-deps=false

# Prevent automatic updates during install
save-prefix=""

# Engine strict mode - fail if Node version doesn't match
engine-strict=true

# Increase log level for better debugging
loglevel=warn

# Workspace configuration
workspaces=true
```

**Configuration Breakdown:**

| Setting                  | Value                                  | Reasoning                                                     |
| ------------------------ | -------------------------------------- | ------------------------------------------------------------- |
| `save-exact=true`        | Exact versions (no `^` or `~`)         | Prevents unexpected breaking changes from minor/patch updates |
| `package-lock=true`      | Always generate lockfile               | Ensures reproducible builds across environments               |
| `legacy-peer-deps=false` | Strict peer dependency resolution      | Catches incompatible dependency versions early                |
| `save-prefix=""`         | No version prefixes                    | Works with `save-exact` for complete version locking          |
| `engine-strict=true`     | Enforce Node version from package.json | Fails fast if wrong Node version is used                      |
| `loglevel=warn`          | Show warnings                          | Balance between verbosity and useful information              |
| `workspaces=true`        | Enable npm workspaces                  | Required for monorepo structure                               |

**Reasons:**

- **Reproducibility:** Same `npm install` output on every machine
- **Security:** Exact versions prevent supply chain attacks via unexpected updates
- **Debugging:** Easier to identify when dependency updates cause issues
- **Team Alignment:** All developers follow same npm behavior

**Example Workflow:**

```bash
# Install dependencies (respects .npmrc settings)
npm install

# Add new dependency (saves exact version)
npm install lodash
# Results in: "lodash": "4.17.21" (not "^4.17.21")

# Update dependency (explicit action required)
npm install lodash@latest --save-exact
```

**Trade-offs:**

- **Strict Version Locking:** Must manually update dependencies
  - **Pro:** Complete control over dependency versions
  - **Con:** More maintenance overhead
- **Engine Strict Mode:** Fails if Node version mismatches
  - **Pro:** Catches version issues immediately
  - **Con:** Requires all developers to use `nvm use`

**Production Benefits:**

- Identical dependency versions between dev, staging, and production
- Reduced "it works locally" incidents
- Easier to audit dependencies for security vulnerabilities
- Clearer git diffs (exact version changes visible)

---

**NPM and NVM Setup:**

npm over pnpm/yarn:\*\* Simpler setup for assessment scope, though pnpm would be preferred for production monorepos due to disk efficiency

- **Prettier + ESLint:** Some configuration overhead but prevents formatting debates and catches bugs
- **nvm + .nvmrc:** Small setup cost for significant consistency benefits
- **.npmrc:** Stricter dependency management requires more manual updates but prevents surprises

---

## Frontend Stack

| Technology          | Version | Purpose           | Reasoning                                                               |
| ------------------- | ------- | ----------------- | ----------------------------------------------------------------------- |
| **React**           | 19.2    | UI Framework      | Industry standard, excellent TypeScript support, vast ecosystem         |
| **TypeScript**      | 5.9.3   | Type Safety       | Catches errors at compile-time, improves IDE experience                 |
| **Vite**            | 7.2.2   | Build Tool        | Fast HMR, optimized production builds, excellent DX                     |
| **TanStack Router** | 2.15.3  | Routing           | Type-safe routing, modern API, better than React Router for TypeScript  |
| **TanStack Query**  | 6.6.7   | Data Fetching     | Handles caching, loading states, refetching automatically               |
| **Tailwind CSS**    | 4.0     | Styling           | Rapid prototyping, utility-first approach, minimal CSS bundle           |
| **Shadcn/ui**       | Latest  | Component Library | Accessible components, owns the code (not a dependency), Tailwind-based |
| **Vitest**          | 4.x     | Unit Testing      | Fast, Vite-native, Jest-compatible API                                  |
| **Playwright**      | 1.x     | E2E Testing       | Reliable, cross-browser, excellent debugging tools                      |

### State Management Strategy

**TanStack Query for server state** instead of Redux/Zustand

**Reasons:**

- Server state (API data) is fundamentally different from client state
- Automatic caching, background refetching, and stale-while-revalidate patterns
- Eliminates boilerplate for loading/error states
- Built-in optimistic updates and mutation handling

**Trade-offs:**

- Learning curve for developers familiar with Redux
- Less control over cache invalidation strategies (though this is usually beneficial)

---

## Backend Stack

| Technology     | Version | Purpose       | Reasoning                                          |
| -------------- | ------- | ------------- | -------------------------------------------------- |
| **Node.js**    | 20.x    | Runtime       | JavaScript ecosystem, async I/O, wide adoption     |
| **TypeScript** | 5.9.3   | Type Safety   | Shared types with frontend, reduces runtime errors |
| **Express**    | 4.x     | Web Framework | Minimal, flexible, adequate for assessment scope   |
| **Vitest**     | 4.x     | Unit Testing  | Consistent testing experience with frontend        |
| **Playwright** | 1.x     | API Testing   | Can test both UI and API with same tool            |

### Framework Choice: Express

**Why Express over NestJS/Next.js/Remix:**

**Reasons:**

- **Simplicity:** Minimal boilerplate for assessment scope
- **Flexibility:** No opinionated structure, easy to demonstrate core concepts
- **Assessment Constraints:** In-memory storage makes framework features like ORMs unnecessary
- **Speed:** Fastest to scaffold and implement

**Trade-offs:**

- **Production Readiness:** Would require significant additions (validation, error handling middleware, security)
- **Scalability:** Manual routing and middleware organization vs. NestJS decorators
- **TypeScript Integration:** Less sophisticated than NestJS's dependency injection

**Production Alternative:**
For a real-world system, **NestJS** would be preferred:

- Built-in dependency injection
- Decorators for validation (class-validator)
- Swagger integration
- Modular architecture
- Better testability

---

### Validation: Zod

**Why Zod:**

**Reasons:**

- **frontend/backend:** both our frontend and backend can use it
- **shadcn:** Shadcn already uses it in it's form components
- **TypeScript Integration:** Can work with typescript

**Trade-offs:**

- **complixity:** zod offers a lot and can be complex to use

---

## Testing Strategy

### Testing Stack

- **Vitest:** Unit and component tests
- **Playwright:** E2E and integration tests

**Reasons for This Combination:**

#### Vitest Advantages

- **Fast execution:** Native ESM support, parallel test runs
- **Vite integration:** Uses same transform pipeline as dev server
- **Component testing:** Can test React components in isolation
- **Jest compatibility:** Familiar API for developers
- **Watch mode:** Instant feedback during development

#### Playwright Advantages

- **Real browser testing:** Tests actual user interactions
- **Cross-browser:** Chromium, Firefox, WebKit support
- **Reliable selectors:** Auto-waiting, retry logic
- **Debugging tools:** Trace viewer, inspector, codegen
- **API testing:** Can test backend endpoints directly

**Test Distribution:**

```
Vitest:
- Utility functions
- React hooks
- Component rendering logic
- Backend API logic
- Data transformations

Playwright:
- User workflows (tag creation, filtering)
- Form submissions
- Navigation
- API integration
- Error handling flows
```

**Trade-offs:**

- **Setup complexity:** Two testing tools vs. one
- **Maintenance:** Separate test suites to maintain
- **Benefits:** Each tool used for its strengths, better coverage

## Code guidelines

---

## Identified Gaps & Improvements

### Current Gaps

1. **No Input Validation**
   - Backend accepts any payload without validation
   - **Risk:** Invalid data causes runtime errors

2. **No Error Handling**
   - Generic error responses
   - No error boundaries in frontend
   - **Fix:** Structured error responses, error boundary components

3. **No Authentication/Authorization**
   - All endpoints are public
   - **Risk:** Anyone can modify tags
   - **Fix:** JWT authentication, role-based access control

4. **No Data Persistence**
   - In-memory storage lost on restart
   - **Risk:** All data lost on deployment/crash
   - **Fix:** PostgreSQL or MongoDB integration

5. **No API Documentation**
   - Endpoints not documented
   - **Fix:** OpenAPI/Swagger documentation

6. **No Logging**
   - Debugging difficult in production
   - **Fix:** Winston or Pino logging

7. **No Rate Limiting**
   - API can be abused
   - **Fix:** Express rate limit middleware

8. **No Pagination**
   - Large datasets would cause performance issues
   - **Fix:** Cursor or offset-based pagination

---

## Environment Setup Instructions

### 1. Install Node Version Manager (nvm)

**macOS/Linux:**

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell configuration
source ~/.bashrc  # or ~/.zshrc

# Verify installation
nvm --version
```

**Windows:**
Download and install [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)

### 2. Project Setup

```bash
# Navigate to project directory
cd spotto-tagging-system

# Install and use the correct Node version
nvm install  # Reads from .nvmrc
nvm use      # Switches to the version specified in .nvmrc

# Verify Node and npm versions
node --version  # Should show v20.11.0
npm --version   # Should show v10.x

# Install dependencies (respects .npmrc settings)
npm install

# Verify installation succeeded
npm run verify
```

### 3. Environment Variables

The application uses a single root `.env` file for configuration (shared across all workspaces). Copy the example file and customize as needed:

```bash
# Copy the root example environment file
cp .env.example .env
```

**Why a single root .env file?**

- Simpler configuration: one file instead of multiple
- Single source of truth for all environment variables
- Both backend and frontend automatically read from the root `.env` file
- Easier to manage and maintain

**Environment Variables:**

| Variable       | Location | Default                     | Description                         |
| -------------- | -------- | --------------------------- | ----------------------------------- |
| `PORT`         | Backend  | `3001`                      | Backend server port                 |
| `HOST`         | Backend  | `localhost`                 | Backend server host                 |
| `FRONTEND_URL` | Backend  | `http://localhost:5173`     | Frontend URL for CORS configuration |
| `VITE_API_URL` | Frontend | `http://localhost:3001/api` | Backend API base URL                |
| `VITE_PORT`    | Frontend | `5173`                      | Frontend dev server port            |
| `VITE_HOST`    | Frontend | `localhost`                 | Frontend dev server host            |

**Note:** Vite requires the `VITE_` prefix for environment variables to be exposed to the client-side code.

**Minimal Configuration:**

- For local development, defaults work out of the box
- Only set environment variables if you need to change ports or URLs
- The backend CORS middleware uses `FRONTEND_URL` to allow cross-origin requests
- The frontend API client uses `VITE_API_URL` to connect to the backend

### 4. Verify Environment

```bash
# Check that workspaces are detected
npm ls --workspaces

# Expected output:
# spotto-tagging-system@1.0.0
# ├── @spotto/backend@1.0.0
# ├── @spotto/frontend@1.0.0
# └── @spotto/types@1.0.0
```

### 5. IDE Configuration

**VS Code Settings (.vscode/settings.json):**

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Editor config

```
# http://EditorConfig.org
root = true

# Unix-style newlines with a newline ending every file
[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

# https://www.markdownguide.org/basic-syntax/#line-breaks
[*.md]
trim_trailing_whitespace = false
```

### Prettier

Keeping prettier config simple but to get imports organised we should use

```
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "plugins": ["prettier-plugin-organize-imports", "prettier-plugin-tailwindcss"]
}
```

- **prettier-plugin-organize-imports** - organizes imports
- **prettier-plugin-tailwindcsss** - organizes tailwind classes: note this can be a pain if editing shadcn compoents but so are eslint/linting rules.

## Naming conventions

**File Names:**

- Use **lowercase** with **kebab-case** (hyphens) for all files
- Examples: `resource-list.tsx`, `tag-validator.ts`, `api-client.ts`
- Exception: Markdown files can use any case (e.g., `SPEC.md`, `README.md`)

**TypeScript/JavaScript Files:**

- Components: `resource-list.tsx`, `tag-editor.tsx`
- Utilities: `format-currency.ts`, `validate-tags.ts`
- Types: `resource.ts`, `tag.ts`, `api.ts`
- Services: `api-client.ts`, `tag-service.ts`
- Routes: `resources.ts`, `coverage.ts`

**Directories:**

- Use lowercase kebab-case: `resource-detail/`, `tag-management/`
- Feature folders: `dashboard/`, `resources/`

**Variables and Functions:**

- Use camelCase: `resourceList`, `updateResourceTags`, `isLoading`
- Constants: UPPER_SNAKE_CASE: `API_BASE_URL`, `MAX_RESOURCES`
- React components: PascalCase: `ResourceList`, `TagEditor`, `Dashboard`

**TypeScript Types/Interfaces:**

- Interfaces: PascalCase: `Resource`, `TagSchema`, `ApiError`
- Types: PascalCase: `TagKey`, `EnvironmentValue`
- Enums: PascalCase: `Provider`, `ResourceType`

### Eslint

Keeping eslint config simple use recommended setups for now

### Coding standard

**Formatting**

- Code should be auto-formatted on save (configured in `.vscode/settings.json`)
- Run `npm run format` to format all files
- Ensure consistent formatting across the codebase

**TypeScript**

- Avoid `any` types - use proper types or `unknown`
- Enable strict mode in `tsconfig.json`
- Fix all TypeScript errors before committing

**Import Organization**

- Group imports: external packages → internal modules → types
- Remove unused imports
- **CRITICAL: Always use alias paths (`@/`) unless importing from the same directory or a child directory**
- Same directory: Use relative imports (`./component`, `./utils`)
- Child directory: Use relative imports (`./components/sub-component`, `../sibling`)
- All other imports: Use alias paths (`@/services/...`, `@/components/...`, `@/features/...`, `@/lib/...`)

**Import Path Rules:**

- ✅ **Use alias (`@/`)** for:
  - `@/services/...` - API services
  - `@/components/...` - Shared UI components
  - `@/features/...` - Feature modules
  - `@/lib/...` - Utility libraries
  - `@/hooks/...` - Shared hooks
  - `@/routes/...` - Route files
  - `@spotto/types` - Shared types package

- ✅ **Use relative paths** for:
  - Same directory: `./component`, `./utils`, `./types`
  - Child directory: `./components/sub-component`, `./utils/helper`
  - Parent/sibling: `../sibling-component`, `../../parent`

### Front Compontent structure

**components**
This folder is for shared components or generic that dont are used across multiple features

- each component will have a folder with an the default component and an export
- child components will live in `./components/<compoent-name>/components/sub-component`
- only the root component is exported
- other components are relative

**components/ui**
shadcn/ui components

**features**
We will use feature driven setup

- Features are self-contained modules (components, logic, types)
- Easier to locate and maintain code
- Better code organization and scalability
- Clear separation between features, shared components, and services

**services**
each api end point will have a service and this will be made up of 3 files

- **api** - fetch for api calls
- **queries** - tanstack query to fetch data
- **mutations** - tanstack query mutation to make updates

### 5. Common Issues & Solutions

**Issue: `npm install` fails with peer dependency errors**

```bash
# Solution: Ensure legacy-peer-deps is false in .npmrc
npm install --legacy-peer-deps=false
```

**Issue: Wrong Node version**

```bash
# Solution: Use nvm to switch versions
nvm use
# or
nvm install
```

**Issue: Package-lock.json conflicts**

```bash
# Solution: Clean install
rm -rf node_modules package-lock.json
npm install
```

**Issue: Husky hooks not running**

```bash
# Solution: Reinstall husky
npm run prepare
```

---

## Time Log

| Task                      | Duration | Notes                                    |
| ------------------------- | -------- | ---------------------------------------- |
| Reading supplied task.md  | 5 min    | Initial requirements review              |
| Setting up repository     | 5 min    | Git initialization, .gitignore           |
| Scaffolding project setup | 5 min    | Workspace structure, package.json        |
| Architecture decisions    | 20 min   | Technology selection, trade-off analysis |
| Documentation             | 15 min   | README creation and refinement           |
| SPEC.MD                   | 90 min   | Creating the spec.md to use for spec-kit |
| Spec-kit from spec ot mvp | 30 min   |                                          |

---

## Assumptions

1. **Assessment Scope:** This is a proof-of-concept, not production-ready code
2. **Single User:** No multi-tenancy considerations
3. **Local Development:** No Docker/cloud deployment configuration
4. **Data Volume:** Small dataset, no performance optimization needed
5. **Browser Support:** Modern evergreen browsers only
6. **Network:** Local network, no offline-first considerations
7. **Development Environment:** Developers have nvm installed

---

## Known Limitations

1. **Backend Storage:** In-memory only - data lost on restart
2. **No Database:** Cannot handle complex queries or relationships
3. **No Caching:** Every request hits the backend (no Redis)
4. **Single Instance:** No horizontal scaling support
5. **Component Library Placement:** Shadcn/ui in frontend workspace - would be extracted to dedicated workspace for Storybook or shared component library
6. **No CI/CD:** Manual testing and deployment
7. **No Monitoring:** No observability or performance metrics
8. **NVM Dependency:** Requires developers to install and use nvm
9. **Manual Dependency Updates:** Exact version pinning requires explicit updates

---

## Future Improvements

The following are suggestion of things to do

### Phase 1: Production Backend

- [ ] Replace Express with **NestJS** for better structure
- [ ] Add **PostgreSQL** with TypeORM/Prisma
- [ ] Implement **JWT authentication**
- [ ] Implement structured error handling
- [ ] Add logging

### Phase 2: Enhanced Features

- [ ] Add Analytics #posthog
- [ ] Implement pagination and filtering
- [ ] Add bulk operations (tag multiple resources)
- [ ] Tag suggestions based on history
- [ ] Export functionality (CSV/JSON)
- [ ] Audit log for tag changes

### Phase 3: Scalability

- [ ] Add caching
- [ ] Implement rate limiting
- [ ] Add database indexing
- [ ] Containerize with **Docker**
- [ ] Set up **Kubernetes** deployment

### Phase 4: Developer Experience

- [ ] Extract Shadcn/ui to separate workspace
- [ ] Add **Storybook** for component documentation
- [ ] Set up **GitHub Actions** CI/CD
- [ ] Add **Changesets** for versioning
- [ ] Implement feature flags
- [ ] Add **Docker** to eliminate nvm dependency
- [ ] Add analytics, google, posthog
- [ ] Automate dependency updates with **Renovate**

---

## Instructions for Running Tests

### Unit Tests (Vitest)

```bash
# Run all unit tests
npm run test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch

# Run specific test file
npm run test -- path/to/test.spec.ts
```

### E2E Tests (Playwright)

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run all E2E tests
npm run test:e2e

# Run in UI mode (interactive)
npm run test:e2e:ui

# Run specific test file
npm run test:e2e -- tests/tagging.spec.ts

# Debug mode
npm run test:e2e:debug
```

### Test Coverage Reports

# Todo

---

## API Endpoints

---

## Project Files Reference

```
spotto-tagging-system/
├── .nvmrc                   # Node version specification
├── .npmrc                   # NPM configuration
├── .gitignore               # Git ignore rules
├── .prettierrc              # Prettier configuration
├── .eslintrc.json           # ESLint configuration
├── tsconfig.base.json       # Shared TypeScript config
├── package.json             # Root package manifest
├── package-lock.json        # Locked dependency versions
├── README.md                # This file
├── frontend/
│   ├── tsconfig.json
│   ├── package.json
│   └── src/
├── backend/
│   ├── tsconfig.json
│   ├── package.json
│   └── src/
└── types/
    ├── tsconfig.json
    └── index.ts
```

---

_This README will be updated as the project evolves._
