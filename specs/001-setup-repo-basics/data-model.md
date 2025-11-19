# Data Model: Repository Setup and Basic Building Blocks

**Date**: 2025-01-27  
**Feature**: Repository Setup and Basic Building Blocks  
**Phase**: 1 - Design

## Overview

This feature focuses on repository setup and infrastructure, so the data model is minimal. The primary entities are configuration structures rather than domain data models. Domain data models (Resources, Tags, etc.) will be introduced in subsequent features.

## Entities

### Workspace Configuration

**Purpose**: Represents the monorepo structure and workspace metadata

**Attributes**:
- `name`: string - Workspace name (e.g., "frontend", "backend", "types")
- `path`: string - Relative path to workspace directory
- `packageJson`: object - Parsed package.json contents
- `tsconfig`: object - TypeScript configuration (extends base config)

**Relationships**:
- Root workspace contains multiple child workspaces
- Each workspace has its own package.json and tsconfig.json

**Validation Rules**:
- Workspace name must match directory name
- package.json must exist in workspace directory
- tsconfig.json must extend tsconfig.base.json

**State**: Static (configured at setup time)

### Development Server

**Purpose**: Represents a running development server instance

**Attributes**:
- `type`: "frontend" | "backend" - Server type
- `port`: number - Port number (3001 for backend, 5173 for frontend)
- `status`: "running" | "stopped" | "error" - Current server status
- `processId`: number | null - Node.js process ID when running

**Relationships**:
- Belongs to a workspace (frontend or backend)
- Can have multiple instances (though only one per workspace in this phase)

**Validation Rules**:
- Port must be available before starting server
- Process ID must be valid when status is "running"

**State Transitions**:
- stopped → running (server start)
- running → stopped (server stop)
- running → error (server crash)
- error → stopped (cleanup)

### Health Check Response

**Purpose**: Response structure for backend health check endpoint

**Attributes**:
- `status`: string - Status indicator (e.g., "ok")

**Relationships**: None (standalone response structure)

**Validation Rules**:
- Status must be a non-empty string
- Response must be valid JSON

**State**: N/A (stateless response)

## Configuration Files

### .nvmrc

**Purpose**: Node.js version specification

**Content**: Single line with version number (e.g., "20.11.0")

**Validation**: Must match Node.js v20.x requirement

### .npmrc

**Purpose**: npm configuration for workspace management

**Key Settings**:
- `workspaces=true` - Enable workspace support
- `save-exact=true` - Use exact versions
- `engine-strict=true` - Enforce Node version

### tsconfig.base.json

**Purpose**: Shared TypeScript configuration

**Key Settings**:
- Strict mode enabled
- ESM module system
- Common compiler options for all workspaces

### package.json (Root)

**Purpose**: Root workspace manifest

**Key Fields**:
- `workspaces`: string[] - List of workspace directories
- `scripts`: object - Root-level npm scripts
- `devDependencies`: object - Shared development dependencies

## Routes/Endpoints

### Frontend Routes

**Dashboard Route** (`/`)
- **Component**: Dashboard page (empty)
- **Purpose**: Root route, validates routing works

**Resources Route** (`/resources`)
- **Component**: Resources page (empty)
- **Purpose**: Secondary route, validates navigation works

### Backend Endpoints

**Health Check** (`GET /api/health`)
- **Request**: None (no query params or body)
- **Response**: `{"status": "ok"}`
- **Status Codes**: 200 OK
- **Purpose**: Verify backend server is operational

## Type Definitions

### WorkspaceInfo

```typescript
interface WorkspaceInfo {
  name: string;
  path: string;
  packageJson: PackageJson;
  tsconfig: TsConfig;
}
```

### ServerStatus

```typescript
type ServerStatus = "running" | "stopped" | "error";

interface DevelopmentServer {
  type: "frontend" | "backend";
  port: number;
  status: ServerStatus;
  processId: number | null;
}
```

### HealthCheckResponse

```typescript
interface HealthCheckResponse {
  status: string;
}
```

## Validation Rules Summary

1. **Node.js Version**: Must be v20.x (enforced by .nvmrc)
2. **Workspace Structure**: Must have frontend/, backend/, types/ directories
3. **Port Availability**: Ports 3001 and 5173 must be available
4. **Dependencies**: All workspace dependencies must install without conflicts
5. **TypeScript**: All workspaces must compile without errors

## Notes

- This data model is minimal as this feature focuses on infrastructure setup
- Domain entities (Resource, Tag, etc.) will be introduced in subsequent features
- Configuration entities are file-based rather than database-backed
- Server state is ephemeral (exists only while servers are running)

