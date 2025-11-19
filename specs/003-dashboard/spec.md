# Feature Specification: Dashboard Implementation

**Feature Branch**: `003-dashboard`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "use the @SPEC.md and the @README.md to build the resources list see step 3, dashboard the backend / front split are part will be seperate commits."

## Overview

This specification defines the implementation of the tag coverage dashboard feature, which displays key compliance metrics and insights for FinOps analysts. The dashboard provides an at-a-glance view of tag coverage across all cloud resources, helping analysts quickly identify compliance gaps and prioritize remediation efforts.

The implementation will be split into separate commits for backend and frontend work, allowing incremental development and testing.

## Prerequisites

Before starting this feature, ensure the following are complete:

- ✅ Step 1: Hello world state (monorepo setup, basic routing, health check)
- ✅ Step 2: Resources list feature implemented (viewing, filtering, sorting, tag editing)
- ✅ Backend coverage endpoint (`GET /api/coverage`) is implemented and working
- ✅ Frontend API client and TanStack Query hooks are configured
- ✅ Coverage calculation service is implemented and working

## User Scenarios & Testing _(mandatory)_

### User Story 1 - FinOps Analyst Views Dashboard Overview (Priority: P1)

A FinOps analyst needs to view overall compliance metrics on the dashboard so they can quickly understand the current state of tag coverage across all resources.

**Why this priority**: The dashboard is the primary entry point for understanding compliance status. Without this overview, analysts cannot assess the overall health of resource tagging.

**Independent Test**: Can be fully tested by navigating to the dashboard page and verifying overall compliance metrics are displayed correctly.

**Acceptance Scenarios**:

1. **Given** a FinOps analyst navigates to the dashboard page, **When** the page loads, **Then** they see the Overview card displaying overall compliance percentage
2. **Given** the Overview card is displayed, **When** the analyst views it, **Then** they see the overall compliance shown as "X/Y resources (Z%)" format
3. **Given** the Overview card is displayed, **When** the analyst views it, **Then** they see a visual progress bar representing the compliance percentage
4. **Given** the Overview card is displayed, **When** the analyst views it, **Then** they see cost coverage shown as "$X.XX / $Y.YY (Z%)" format
5. **Given** the Overview card is displayed, **When** the analyst views it, **Then** they see a visual progress bar representing the cost coverage percentage
6. **Given** coverage data is loading, **When** the dashboard is displayed, **Then** loading indicators are shown for each card
7. **Given** an error occurs fetching coverage data, **When** the error is displayed, **Then** clear error messages are shown with option to retry

---

### User Story 2 - FinOps Analyst Views Required Tag Coverage (Priority: P1)

A FinOps analyst needs to view per-tag coverage percentages so they can identify which required tags have the lowest coverage and prioritize remediation efforts.

**Why this priority**: Understanding which tags are missing helps analysts focus their efforts on the most impactful improvements.

**Independent Test**: Can be fully tested by viewing the Required Tag Coverage card and verifying all required tags display with correct coverage percentages.

**Acceptance Scenarios**:

1. **Given** a FinOps analyst is on the dashboard page, **When** they view the Required Tag Coverage card, **Then** they see all three required tags listed: Environment, Owner, BusinessUnit
2. **Given** a required tag is displayed, **When** the analyst views it, **Then** they see the tag name, coverage percentage, and count format "X/Y (Z%)"
3. **Given** a required tag is displayed, **When** the analyst views it, **Then** they see a visual progress bar representing the coverage percentage
4. **Given** tags are displayed in order, **When** the analyst views the card, **Then** tags are ordered by coverage percentage (lowest first) or alphabetically
5. **Given** a tag has 100% coverage, **When** the analyst views it, **Then** the progress bar shows full completion visually

---

### User Story 3 - FinOps Analyst Views Non-Compliant Resources (Priority: P1)

A FinOps analyst needs to view the highest-cost non-compliant resources so they can prioritize which resources to fix first based on cost impact.

**Why this priority**: Focusing on high-cost non-compliant resources maximizes the financial impact of compliance improvements. This helps analysts allocate their time effectively.

**Independent Test**: Can be fully tested by viewing the Non-Compliant Resources card and verifying resources are displayed correctly sorted by cost.

**Acceptance Scenarios**:

1. **Given** a FinOps analyst is on the dashboard page, **When** they view the Non-Compliant Resources card, **Then** they see a list of non-compliant resources sorted by monthly cost (highest first)
2. **Given** a non-compliant resource is displayed, **When** the analyst views it, **Then** they see the resource ID, monthly cost formatted as currency, and compliance status indicator
3. **Given** resources are displayed, **When** the analyst views the list, **Then** they see a maximum of 5-10 resources (top non-compliant by cost)
4. **Given** the Non-Compliant Resources card is displayed, **When** the analyst views it, **Then** they see a "View All Non-Compliant Resources" link or button
5. **Given** the analyst clicks "View All Non-Compliant Resources", **When** they navigate, **Then** they are taken to the resources list page with a filter applied to show only non-compliant resources
6. **Given** there are no non-compliant resources, **When** the analyst views the card, **Then** an empty state message is displayed indicating all resources are compliant

---

## Requirements _(mandatory)_

### Functional Requirements

#### Overview Card

- **FR-001**: System MUST display overall compliance percentage in "X/Y resources (Z%)" format
- **FR-002**: System MUST display a visual progress bar representing overall compliance percentage
- **FR-003**: System MUST display cost coverage in "$X.XX / $Y.YY (Z%)" format
- **FR-004**: System MUST display a visual progress bar representing cost coverage percentage
- **FR-005**: System MUST show loading indicators while coverage data is being fetched
- **FR-006**: System MUST display error messages with retry option when coverage fetch fails

#### Required Tag Coverage Card

- **FR-007**: System MUST display all three required tags: Environment, Owner, BusinessUnit
- **FR-008**: System MUST display each tag with coverage percentage in "X/Y (Z%)" format
- **FR-009**: System MUST display a visual progress bar for each tag's coverage percentage
- **FR-010**: System MUST order tags by coverage percentage (lowest first) or alphabetically
- **FR-011**: System MUST visually indicate 100% coverage when a tag has complete coverage

#### Non-Compliant Resources Card

- **FR-012**: System MUST display non-compliant resources from coverage API response, sorted by monthly cost (highest first)
- **FR-013**: System MUST display resource ID, monthly cost (formatted as currency), and compliance status for each resource
- **FR-014**: System MUST display the non-compliant resources provided by the backend (backend limits to top 5-10 by cost)
- **FR-015**: System MUST provide a "View All Non-Compliant Resources" link or button
- **FR-016**: System MUST navigate to resources list with non-compliant filter applied when link is clicked
- **FR-017**: System MUST display empty state when all resources are compliant

#### Dashboard Layout

- **FR-018**: System MUST display all three cards in a responsive grid layout (columns on desktop, stacked on mobile)
- **FR-019**: System MUST ensure cards are visually consistent in styling and spacing
- **FR-020**: System MUST refresh coverage data automatically or provide manual refresh option

### Key Entities

- **TagCoverage**: Coverage metrics interface containing overall compliance, per-tag coverage, cost-weighted compliance, breakdown statistics, and non-compliant resources list
- **CoverageStats**: Statistics for a group of resources (compliant count, total count, percentage)
- **ResourceWithCoverage**: Resource extended with tagCoverage percentage and compliance status
- **NonCompliantResource**: Resource summary for dashboard display (id, name, monthlyCost, compliance status)

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can view overall compliance percentage and cost coverage on the dashboard
- **SC-002**: Users can view per-tag coverage percentages for all required tags
- **SC-003**: Users can identify top non-compliant resources by cost from the dashboard
- **SC-004**: Users can navigate from dashboard to filtered resources list showing non-compliant resources
- **SC-005**: Dashboard loads and displays all metrics within 2 seconds
- **SC-006**: All progress bars accurately represent percentages visually
- **SC-007**: Currency values are formatted correctly with 2 decimal places
- **SC-008**: Loading and error states are handled gracefully with user-friendly messages
- **SC-009**: Dashboard displays correctly on desktop and mobile devices
- **SC-010**: Coverage data refreshes correctly when resources are updated

## Assumptions

- Backend coverage endpoint (`GET /api/coverage`) will be updated to include `nonCompliantResources` array in response
- Frontend API client and TanStack Query hooks are configured
- Coverage calculation service is implemented and working
- Resources list feature is implemented (for navigation to filtered view)
- Backend and frontend implementations will be in separate commits
- Users have modern browsers with JavaScript enabled
- No authentication/authorization required at this stage
- Dashboard is the home page (route: `/` or `/dashboard`)
- Coverage data updates when resources are tagged (via query invalidation)
- Backend will limit non-compliant resources list to top 5-10 by cost for performance

## Dependencies

- Step 1: Hello world setup (monorepo, routing, basic server)
- Step 2: Resources list feature (for navigation to filtered resources)
- Backend API endpoint: GET /api/coverage
- Coverage calculation service
- UI component library (for cards, progress bars, buttons)
- Data fetching and state management library
- Routing library for navigation

## Out of Scope

- Real-time updates or WebSocket connections (coverage updates on manual refresh or query invalidation)
- Historical coverage trends or time-series data
- Export functionality (CSV/JSON export of coverage metrics)
- Custom date ranges for coverage calculations
- Coverage alerts or notifications
- Drill-down into specific provider/type/environment breakdowns (beyond what's in the API response)
- Coverage goal setting or target tracking
- Coverage improvement recommendations

## Implementation Approach

### Backend/Frontend Split

This feature will be implemented in separate commits to allow incremental development and testing:

1. **Backend Implementation**: Ensure coverage endpoint is working correctly, including all breakdown statistics (by provider, type, environment), proper error handling, and accurate calculations.

2. **Frontend Implementation**: Implement all dashboard UI components and interactions, including three dashboard cards, progress bars, navigation to filtered resources list, and proper loading/error states.

### Component Structure

Frontend components should follow feature-based organization:

```
frontend/src/features/dashboard/
├── components/
│   ├── dashboard.tsx              # Main dashboard container
│   ├── overview-card.tsx          # Overview card component
│   ├── tag-coverage-card.tsx      # Required tag coverage card
│   ├── non-compliant-card.tsx     # Non-compliant resources card
│   └── progress-bar.tsx           # Reusable progress bar component
```

### State Management Considerations

- Server state (coverage metrics) should be managed by a data fetching library
- Coverage data should refresh when resources are updated (via query invalidation)
- No local UI state needed beyond loading/error states

### Error Handling Approach

- Display user-friendly error messages for API failures
- Show loading states while fetching coverage data
- Provide retry options for failed requests
- Handle empty states gracefully (e.g., no non-compliant resources)

## Clarifications

### Session 2025-01-27

**Note**: Most implementation details are already specified in SPEC.md. The following clarifications address edge cases:

- **Q: How many non-compliant resources should be displayed in the card?** → **A**: Display top 5-10 non-compliant resources by cost. The exact number can be configurable (default 5) but should be limited to prevent card overflow.

- **Q: Should progress bars be animated?** → **A**: Subtle animation on initial load is acceptable but not required. Progress bars should accurately represent percentages.

- **Q: What should happen when clicking a resource in the non-compliant list?** → **A**: Clicking a resource should navigate to that resource's detail page (if resource detail feature exists) or to the resources list filtered to show that resource.

- **Q: Should the dashboard auto-refresh coverage data?** → **A**: Coverage data should refresh when resources are updated (via query invalidation). Manual refresh button is optional but recommended for user control.

- **Q: What is the default sort order for required tags in the coverage card?** → **A**: Tags should be ordered by coverage percentage (lowest first) to highlight tags needing attention, or alphabetically if percentages are equal.

- **Q: How should the dashboard obtain the list of non-compliant resources?** → **A**: Backend provides non-compliant resources list in the coverage API response. The coverage endpoint will include a `nonCompliantResources` array containing the top non-compliant resources sorted by cost (highest first), with each resource including id, name, monthlyCost, and compliance status.

