# Quick Start Guide: Repository Setup

**Date**: 2025-01-27  
**Feature**: Repository Setup and Basic Building Blocks

## Prerequisites

Before starting, ensure you have:

- **Node.js v20.x** installed (or nvm to install it)
- **npm v10.x** or higher
- **Git** for version control
- A **modern web browser** for testing the frontend

## Setup Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd spotto-tech-test
```

### 2. Install Node.js Version

```bash
# If using nvm (recommended)
nvm use

# If you don't have the required version installed
nvm install
```

### 3. Install Dependencies

```bash
# Install dependencies for all workspaces
npm install
```

This will install dependencies for:

- Root workspace (shared tooling)
- Frontend workspace (React, Vite, etc.)
- Backend workspace (Express, etc.)
- Types workspace (shared TypeScript types)

### 4. Verify Installation

```bash
# Verify Node.js version, workspace structure, and dependencies
npm run verify
```

Expected output: Confirmation that all checks pass.

### 5. Start Development Servers

```bash
# Start both frontend and backend concurrently
npm run dev
```

Or start them separately:

```bash
# Terminal 1: Start backend
npm run dev:backend

# Terminal 2: Start frontend
npm run dev:frontend
```

### 6. Verify Setup

**Frontend**:

- Open http://localhost:5173 in your browser
- You should see the Dashboard page (may be empty)
- Click "Resources" in the sidebar to navigate to Resources page

**Backend**:

- Open http://localhost:3001/api/health in your browser
- You should see: `{"status": "ok"}`

## Project Structure

```
spotto-tech-test/
├── frontend/          # React frontend application
├── backend/          # Express backend API
├── types/            # Shared TypeScript types
└── specs/            # Feature specifications
```

## Available Commands

| Command                | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| `npm install`          | Install dependencies for all workspaces                    |
| `npm run verify`       | Verify Node version, workspace structure, and dependencies |
| `npm run dev`          | Start both frontend and backend servers                    |
| `npm run dev:frontend` | Start only frontend server (port 5173)                     |
| `npm run dev:backend`  | Start only backend server (port 3001)                      |

## Troubleshooting

### Node.js Version Mismatch

**Error**: "Node.js v20.x required"

**Solution**:

```bash
nvm use
# or
nvm install
```

### Port Already in Use

**Error**: "Port 3001 (or 5173) is already in use"

**Solution**:

- Stop the process using the port
- Or change the port in the configuration (not recommended for this phase)

### Dependency Installation Fails

**Error**: Peer dependency warnings or installation errors

**Solution**:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Workspace Not Found

**Error**: "Workspace not found" or similar

**Solution**:

- Verify workspace directories exist (frontend/, backend/, types/)
- Check package.json has correct `workspaces` configuration

## Next Steps

Once setup is complete:

1. ✅ Verify both servers start successfully
2. ✅ Verify frontend routing works (Dashboard and Resources pages)
3. ✅ Verify backend health check endpoint responds
4. ✅ Proceed to next feature implementation

## Success Criteria

Setup is successful when:

- ✅ All dependencies install without conflicts
- ✅ `npm run verify` passes all checks
- ✅ Frontend server starts on port 5173
- ✅ Backend server starts on port 3001
- ✅ Health check endpoint returns `{"status": "ok"}`
- ✅ Frontend pages are accessible via routing

## Support

If you encounter issues not covered here:

1. Check the main [README.md](../../README.md) for detailed architecture information
2. Review the [spec.md](./spec.md) for feature requirements
3. Check error messages for actionable guidance
