# Research: Repository Setup and Basic Building Blocks

**Date**: 2025-01-27  
**Feature**: Repository Setup and Basic Building Blocks  
**Phase**: 0 - Research & Decision Consolidation

## Overview

This document consolidates technology choices and architectural decisions for the initial repository setup phase. All decisions are based on existing project documentation (README.md, SPEC.md) and industry best practices for monorepo development.

## Technology Decisions

### Monorepo Management

**Decision**: npm workspaces for monorepo structure

**Rationale**:
- Native to Node.js ecosystem, no additional tooling required
- Adequate for assessment scope without complexity of pnpm/yarn
- Single `package.json` at root reduces version conflicts
- Enables shared TypeScript configurations and types

**Alternatives considered**:
- **pnpm**: Better disk efficiency but adds complexity for assessment scope
- **yarn workspaces**: Similar to npm but requires additional tooling
- **Turborepo/Nx**: Overkill for simple monorepo structure

### Node.js Version Management

**Decision**: `.nvmrc` file with Node.js v20.11.0

**Rationale**:
- Ensures consistency across developers and CI/CD
- Eliminates "works on my machine" issues
- `.nvmrc` is standard practice for Node version pinning
- v20.x provides modern features and LTS stability

**Alternatives considered**:
- **Docker**: Would eliminate nvm dependency but adds containerization complexity (out of scope)
- **Volta**: Alternative version manager, but nvm is more widely adopted

### TypeScript Configuration

**Decision**: Shared `tsconfig.base.json` with workspace-specific extensions

**Rationale**:
- Centralized compiler options ensure consistent build behavior
- Workspace-specific overrides allow flexibility for different runtime environments
- Prevents duplication of TypeScript configuration
- Enables shared type definitions across workspaces

**Alternatives considered**:
- **Separate tsconfig files**: Would duplicate configuration and risk inconsistencies
- **No TypeScript**: Would reduce setup complexity but lose type safety benefits

### Frontend Build Tool

**Decision**: Vite 7.2.2

**Rationale**:
- Fast HMR for development experience
- Optimized production builds
- Native ESM support
- Excellent TypeScript integration
- Industry standard for modern React applications

**Alternatives considered**:
- **Create React App**: Deprecated, slower, larger bundle size
- **Webpack**: More complex configuration, slower builds
- **Next.js**: Overkill for SPA, adds SSR complexity not needed

### Frontend Routing

**Decision**: TanStack Router 2.15.3

**Rationale**:
- Type-safe routing with excellent TypeScript support
- Modern API better than React Router for TypeScript projects
- Built-in data loading patterns
- Better developer experience for type-safe navigation

**Alternatives considered**:
- **React Router**: Less type-safe, more boilerplate for TypeScript
- **Next.js routing**: Requires Next.js framework (not chosen)

### Backend Framework

**Decision**: Express 4.x

**Rationale**:
- Minimal boilerplate for assessment scope
- Flexible, no opinionated structure
- Fast to scaffold and implement
- Adequate for in-memory storage (no ORM needed)
- Widely adopted and well-documented

**Alternatives considered**:
- **NestJS**: Better structure but adds complexity for simple API
- **Fastify**: Faster but less ecosystem support
- **Next.js API routes**: Would couple frontend/backend unnecessarily

### Testing Framework

**Decision**: Vitest 4.x (unit/component) + Playwright 1.x (E2E/API)

**Rationale**:
- Vitest: Fast, Vite-native, Jest-compatible API, parallel execution
- Playwright: Reliable E2E testing, can test both UI and API
- Consistent testing experience across frontend and backend
- Industry standard tools with excellent debugging support

**Alternatives considered**:
- **Jest**: Slower, requires additional configuration
- **Cypress**: Good for E2E but Playwright more versatile (can test API)
- **Jest + Supertest**: Would require separate tools for UI and API testing

### Code Formatting & Linting

**Decision**: Prettier 3.x + ESLint 9.x

**Rationale**:
- Prettier: Industry standard, zero-configuration formatting
- ESLint: Catches errors early, enforces code quality
- Pre-commit hooks via Husky ensure code quality before commits
- Prevents formatting debates and catches bugs

**Alternatives considered**:
- **No formatter**: Would lead to inconsistent code style
- **Biome**: Newer tool but Prettier/ESLint more established

## Architecture Patterns

### Workspace Structure

**Decision**: Three workspaces (frontend, backend, types)

**Rationale**:
- Clear separation of concerns with explicit boundaries
- Shared types package prevents circular dependencies
- Easy to extract workspaces into separate repositories if needed
- Aligns with monorepo best practices

**Alternatives considered**:
- **Single workspace**: Would mix concerns and prevent code reuse
- **More workspaces**: Would add unnecessary complexity for current scope

### Port Configuration

**Decision**: Backend port 3001, Frontend port 5173

**Rationale**:
- Port 3001: Avoids conflicts with common development servers (3000)
- Port 5173: Vite default port, standard for frontend development
- Both ports documented in SPEC.md for consistency

**Alternatives considered**:
- **Environment variables**: Adds complexity, not needed for local dev
- **Dynamic port assignment**: Could cause confusion, explicit ports clearer

### Error Handling Strategy

**Decision**: Clear, actionable error messages with guidance

**Rationale**:
- Improves developer experience during setup
- Reduces support burden
- Helps developers resolve issues quickly
- Aligns with success criteria (95% first-attempt success rate)

**Alternatives considered**:
- **Silent failures**: Would frustrate developers
- **Generic errors**: Would require more debugging time

### Logging Strategy

**Decision**: Minimal logging (errors and warnings only)

**Rationale**:
- Reduces console noise during development
- Focuses attention on actual issues
- Sufficient for setup phase (no production logging needed)

**Alternatives considered**:
- **Verbose logging**: Would clutter console, not needed for setup
- **No logging**: Would make debugging difficult

## Implementation Patterns

### Health Check Endpoint

**Decision**: Simple JSON response `{"status": "ok"}`

**Rationale**:
- Standard pattern for health checks
- Easy to parse and validate
- Sufficient for verifying server is operational
- Minimal implementation complexity

**Alternatives considered**:
- **Detailed health info**: Adds complexity, not needed for basic check
- **Plain text**: Less structured, harder to parse programmatically

### Page Content Strategy

**Decision**: Empty pages (routing functionality sufficient)

**Rationale**:
- Validates routing infrastructure works
- Minimal implementation effort
- Content will be added in subsequent features
- Focuses on setup rather than feature implementation

**Alternatives considered**:
- **Placeholder content**: Adds unnecessary work for setup phase
- **Full feature implementation**: Out of scope for setup phase

### Verification Command Scope

**Decision**: Verify Node version, workspace structure, and dependencies

**Rationale**:
- Covers critical setup prerequisites
- Provides actionable feedback if misconfigured
- Balances thoroughness with execution speed
- Aligns with success criteria (setup completion <5 minutes)

**Alternatives considered**:
- **Only Node version**: Too minimal, wouldn't catch workspace issues
- **Full compilation check**: Too slow, dependencies check is sufficient

## Dependencies & Constraints

### Required Dependencies

- **Node.js v20.x**: Runtime environment
- **npm v10.x**: Package manager with workspace support
- **Git**: Version control
- **Modern browser**: For frontend testing

### Constraints

- **Port availability**: Ports 3001 and 5173 must be available
- **Node version**: Strict enforcement via .nvmrc
- **Workspace structure**: Must match documented structure
- **TypeScript**: Strict mode enabled across all workspaces

## Risk Assessment

### Low Risk

- ✅ Technology choices are well-established and documented
- ✅ Monorepo structure follows standard patterns
- ✅ All dependencies have clear version specifications

### Mitigation Strategies

- Clear error messages help developers resolve issues quickly
- Verification command catches misconfigurations early
- Comprehensive README provides setup guidance

## Conclusion

All technology decisions are based on existing project documentation and industry best practices. No additional research required - implementation can proceed with documented choices.

