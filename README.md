# Spotto Technical Assessment: Cloud Resource Tagging System

## Overview

At Spotto, we help enterprises manage multi-cloud costs through accurate resource tagging. 
One of our core features is the Universal Tagging Engine - a system that allows customers to tag cloud resources (VMs, databases, storage accounts) with metadata like Environment, Owner, CostCenter, etc.


## Setup instructions


## Architecture decisions and trade-offs

### Monorepo
This application is built in a monorepo as both frontend and backend are using typescript the project will have share:
#### tsconfig setup
  - ./  # at the `tsconfig.base.json` in the root project, shared tsconfig
  - /frontend/tsconfig.json # extends the `tsconfig.base.json`
  - /backendtsconfig.json # extends the `tsconfig.base.json`
#### Packages
  - ./ 
  - ./backend # packages for frontend
  - ./frontend  # back
  - ./types

### Tooling
- **Package Manager:** npm
- **Foramtting:** prettier
- **Eslint:** prettier
- **GitHooks:** husky

## Frontend stack
- **Framework** React 19.2 with TypeScript 5.9.3
- **Routing** TanstackQuery
- **Styling:** Tailwind 4.0
- **ComoonentLibrary:** Shadcn/ui
- **Build Tools:** Vite 7.2.2
- **Testing Framework:** Vitest and Playwright
- **HTTP Client:** Fetch API with Tanstack Query
- **State Management:**  Tanstack Query


### Backend
- **Backend:** Node.js with TypeScript
As this is an assement we will use Express to build the backend apis. 
This will allow us to quickly build the apis but as it is memory only it will be limited.
Going for this over frames such next / nest.js / remix for simplicity

### Testing
We will use playwright and vitest for both frontend and backend. These tools compliment each other

#### Playwright
Excels at E2E tests

#### Vitest
Ideal for unit testing and compoenent tests, Vitest can use Playwright's browser infrastructure to provide a more reliable browser environment for component testing, but it runs tests natively in the browser instead of through a remote control process like Playwright's own component tests.


## Time log
- Reading supplied task.md - 5 min
- Setting up Repo - 5 min
- Scaffolding project setup - 5 min
- Architecture - 30 minutes

## Assumptions
- not production ready backend at this stage

## Limitations
- backend is only in memory
- shadcn/ui is installed in teh frontend workspace, if we were to add storybook or build addiotional it would be moved into its own workspace

## Future improvements
- backend to be made production ready
  - consider a framework
  - data is stored

# Instructions for running tests