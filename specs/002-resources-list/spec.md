# Feature Specification: Resources List Feature

**Feature Branch**: `002-resources-list`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "use the @SPEC.md and the @README.md to build the resources list see step 2, each sub task in the list group of tasks. the backend / front split are part will be seperate commits."

## Clarifications

### Session 2025-01-27

- Q: Tag Coverage Badge Display Location - Should the tag coverage badge appear as a separate column, badge overlay, or only on hover? → A: As a separate "Tag Coverage" column in the table (showing "X/Y required tags"), display only (not clickable, no popover)
- Q: Filter Logic When Multiple Values Selected - When selecting multiple filter values within the same category, should the system show resources matching any value (OR), all values (AND), or only the most recent selection? → A: Only the most recently selected value (single selection only)
- Q: "Select All" Checkbox Behavior - When clicking "Select all" checkbox, should it select all resources in system, all matching filters, or only currently visible resources? → A: Only resources currently visible in the filtered/sorted view
- Q: Bulk Edit Tag Value Input - How should tag values be entered for bulk operations? → A: Single input field that applies the same value to all selected resources

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Resources List (Priority: P1)

A FinOps analyst opens the Resources page and sees a table displaying all cloud resources with their key properties and tag information, allowing them to quickly assess resource inventory and tag coverage across their cloud infrastructure.

**Why this priority**: Viewing the resource list is the foundational capability that enables all other resource management activities. Without this, users cannot identify which resources need attention or perform any tag management operations.

**Independent Test**: Can be fully tested by opening the Resources page and verifying that all 20 resources from the seed data are displayed in a table format with all required columns visible. The test delivers immediate visibility into the resource inventory.

**Acceptance Scenarios**:

1. **Given** a FinOps analyst navigates to the Resources page, **When** the page loads, **Then** they see a table displaying all cloud resources with columns: Checkbox, Name, Type, Provider, Region, Monthly Cost, Tag Coverage, Environment, Owner, BusinessUnit, CostCenter, Project, Customer
2. **Given** resources are displayed in the table, **When** a FinOps analyst views the Tag Coverage column, **Then** they see a badge showing "X/Y required tags" format for each resource
3. **Given** resources are displayed in the table, **When** a resource has a tag value, **Then** the tag value appears in the corresponding tag column
4. **Given** resources are displayed in the table, **When** a resource does not have a tag value, **Then** the corresponding tag column appears empty
5. **Given** the resource list is displayed, **When** a FinOps analyst clicks on a resource row, **Then** they are navigated to the resource detail page

---

### User Story 2 - View Single Resource Details (Priority: P1)

A FinOps analyst clicks on a resource from the list and views detailed information about that specific resource, including all properties and tags, enabling them to understand the complete resource configuration.

**Why this priority**: Resource detail view is essential for understanding individual resource context before making tag changes. This is a prerequisite for tag editing functionality.

**Independent Test**: Can be fully tested by clicking on any resource from the list and verifying that all resource properties (Name, ID, Provider, Type, Region, Monthly Cost) and tags are displayed correctly. The test delivers complete resource visibility for tag management decisions.

**Acceptance Scenarios**:

1. **Given** a FinOps analyst is on the Resources list page, **When** they click on a resource row, **Then** they are navigated to the resource detail page showing that resource's complete information
2. **Given** a FinOps analyst is viewing a resource detail page, **When** the page loads, **Then** they see a Resource Properties Card displaying Name, ID, Provider, Type, Region, and Monthly Cost
3. **Given** a FinOps analyst is viewing a resource detail page, **When** the page loads, **Then** they see a Tags Card displaying all tags organized into Required Tags and Optional Tags sections
4. **Given** a FinOps analyst is viewing a resource detail page, **When** they click the back navigation button, **Then** they return to the Resources list page

---

### User Story 3 - Filter Resources (Priority: P2)

A FinOps analyst filters the resource list by Provider, Type, or Region to focus on specific subsets of resources, enabling them to analyze compliance and tag coverage for particular resource groups.

**Why this priority**: Filtering is essential for managing large resource inventories. It allows analysts to focus on specific providers, resource types, or regions when performing tag management operations.

**Independent Test**: Can be fully tested by applying filters and verifying that only matching resources are displayed. The test delivers the ability to focus on specific resource subsets for analysis and tag management.

**Acceptance Scenarios**:

1. **Given** a FinOps analyst is on the Resources list page, **When** they click the Provider filter button, **Then** a popover opens showing all available providers (Azure, AWS, GCP) as filter options
2. **Given** a FinOps analyst opens a filter popover, **When** they select a filter value, **Then** the table updates to show only resources matching that filter and a filter badge appears showing the selected value
3. **Given** a FinOps analyst has an active filter, **When** they select a different value in the same filter category, **Then** the previous selection is replaced with the new value and the table updates accordingly
4. **Given** filter badges are displayed, **When** a FinOps analyst clicks the X icon on a filter badge, **Then** that filter is removed and the table updates to show all resources matching the remaining filters
5. **Given** filters are active, **When** a FinOps analyst opens any filter popover, **Then** they see a "Remove filters" button in the footer that clears all active filters when clicked
6. **Given** a FinOps analyst applies filters, **When** no resources match the filter criteria, **Then** an empty state is displayed with a "Clear filters" action

---

### User Story 4 - Sort Resources (Priority: P2)

A FinOps analyst sorts the resource list by Name, Provider, or Monthly Cost to organize resources for analysis, enabling them to identify high-cost resources or locate specific resources quickly.

**Why this priority**: Sorting improves usability by allowing analysts to organize resources by different criteria, making it easier to identify resources that need attention or analyze cost distribution.

**Independent Test**: Can be fully tested by clicking sortable column headers and verifying that resources are reordered correctly. The test delivers improved resource organization and analysis capabilities.

**Acceptance Scenarios**:

1. **Given** a FinOps analyst is on the Resources list page, **When** they click the Name column header, **Then** resources are sorted alphabetically by name and a sort indicator appears showing the sort direction
2. **Given** resources are sorted by a column, **When** a FinOps analyst clicks the same column header again, **Then** the sort order toggles between ascending and descending
3. **Given** a FinOps analyst clicks the Monthly Cost column header, **When** sorting is applied, **Then** resources are ordered by cost value (highest to lowest or lowest to highest based on current sort direction)
4. **Given** a FinOps analyst clicks the Provider column header, **When** sorting is applied, **Then** resources are grouped by provider name alphabetically

---

### User Story 5 - Edit Tags on Resource Detail Page (Priority: P2)

A FinOps analyst edits tags on a single resource's detail page, adding missing required tags, updating tag values, or removing optional tags to improve resource compliance and enable accurate cost allocation.

**Why this priority**: Single-resource tag editing is the core tag management capability. It allows analysts to fix compliance issues one resource at a time, which is essential for maintaining accurate resource metadata.

**Independent Test**: Can be fully tested by editing tags on a resource detail page and verifying that changes are saved and reflected immediately. The test delivers the ability to maintain accurate resource tagging for cost allocation.

**Acceptance Scenarios**:

1. **Given** a FinOps analyst is viewing a resource detail page, **When** a required tag is missing, **Then** they see the tag name, a "not set" message, and an "Add value" button
2. **Given** a FinOps analyst clicks "Add value" for a missing required tag, **When** the input field appears, **Then** they can enter a tag value and click Save to add the tag
3. **Given** a FinOps analyst is viewing a resource with existing tags, **When** they click the Edit button for a tag, **Then** the tag value becomes an editable input field with a Save button
4. **Given** a FinOps analyst edits a tag value, **When** they click Save, **Then** the tag is updated and the change is reflected immediately on the page
5. **Given** a FinOps analyst is viewing optional tags, **When** they click the Remove button (X) for an optional tag, **Then** the tag is removed from the resource
6. **Given** a FinOps analyst wants to add an optional tag, **When** they click "Add tag" under optional tags, **Then** a popover opens showing optional tags that are not yet on the resource
7. **Given** a FinOps analyst selects an optional tag from the popover, **When** they enter a value and save, **Then** the tag is added to the resource

---

### User Story 6 - Bulk Edit Tags on Resource List (Priority: P3)

A FinOps analyst selects multiple resources and performs bulk tag operations (add, edit, or remove tags) across all selected resources simultaneously, enabling efficient tag management for groups of resources that share common characteristics.

**Why this priority**: Bulk operations significantly improve efficiency when managing tags across multiple resources. While important, it builds on single-resource editing and can be implemented after core functionality is in place.

**Independent Test**: Can be fully tested by selecting multiple resources, choosing a bulk tag operation, previewing changes, and applying them. The test delivers efficient tag management for resource groups.

**Acceptance Scenarios**:

1. **Given** a FinOps analyst is on the Resources list page, **When** they click the "Select all" checkbox in the table header, **Then** all resources currently visible in the filtered/sorted view are selected
2. **Given** a FinOps analyst has filters applied, **When** they click "Select all", **Then** only resources matching the active filters are selected (not all resources in the system)
3. **Given** a FinOps analyst is on the Resources list page, **When** they select 2 or more resources using checkboxes, **Then** bulk edit action buttons appear (Add Tag, Edit Tag, Remove Tag)
4. **Given** a FinOps analyst has selected multiple resources, **When** they click "Add Tag", **Then** a dropdown opens showing tags that are not present on any selected resource
5. **Given** a FinOps analyst selects a tag to add/edit/remove, **When** they proceed, **Then** a sheet opens showing a single input field for entering the tag value (for add/edit operations)
6. **Given** a FinOps analyst enters a tag value in the bulk operation sheet, **When** they proceed, **Then** the same value is applied to all selected resources in the preview
7. **Given** a FinOps analyst views the bulk operation preview, **When** they review the changes, **Then** they see each resource's current tags and new tags after the operation
8. **Given** a FinOps analyst reviews the bulk operation preview, **When** they click Apply, **Then** the tag operation is applied to all selected resources with the entered value and the list updates to reflect changes
9. **Given** a FinOps analyst reviews the bulk operation preview, **When** they click Cancel, **Then** the sheet closes without making any changes
10. **Given** a FinOps analyst performs a bulk remove operation, **When** they view the preview, **Then** they see a summary message indicating how many resources will be updated and how many did not have the tag

---

### Edge Cases

- **Empty resource list**: When no resources exist in the system, the table displays an empty state with appropriate messaging
- **No resources match filters**: When filters are applied but no resources match, an empty state is displayed with a "Clear filters" action
- **Network errors during API calls**: When API requests fail, user-friendly error messages are displayed with options to retry
- **Invalid tag values**: When a user attempts to save an invalid tag value (e.g., invalid enum value for Environment), validation errors are displayed
- **Concurrent tag updates**: When multiple users edit the same resource simultaneously, the last update wins (no conflict resolution needed for MVP)
- **Resource not found**: When navigating to a resource detail page for a non-existent resource ID, a 404 error page is displayed
- **Large number of resources**: System handles displaying all 20 resources without pagination (pagination is out of scope for MVP)
- **Missing required tags**: Resources with missing required tags are clearly indicated in the UI with appropriate visual indicators
- **Empty tag values**: System prevents saving tags with empty string values
- **Bulk operation on single resource**: Bulk edit actions appear when 2 or more resources are selected (not for single selection)

## Requirements *(mandatory)*

### Functional Requirements

#### Task Group 1: View Resources List

- **FR-001**: System MUST display all resources in a table format on the Resources list page
- **FR-002**: System MUST display table columns: Checkbox, Name, Type, Provider, Region, Monthly Cost, Tag Coverage, Environment, Owner, BusinessUnit, CostCenter, Project, Customer
- **FR-002a**: System MUST display Tag Coverage column showing "X/Y required tags" format for each resource (display only, not interactive)
- **FR-003**: System MUST display tag values in their corresponding tag columns when present on a resource
- **FR-004**: System MUST display empty tag columns when tags are not present on a resource
- **FR-005**: System MUST enable navigation to resource detail page when clicking on a resource row
- **FR-006**: System MUST display a checkbox in the table header for "Select all" functionality
- **FR-006a**: System MUST select only resources currently visible in the filtered/sorted view when "Select all" is clicked
- **FR-007**: System MUST display individual checkboxes for each resource row
- **FR-008**: System MUST display an empty state when no resources match active filters
- **FR-009**: System MUST display loading state while fetching resources
- **FR-010**: System MUST display error state when resource fetching fails

#### Task Group 2: View Single Resource Details

- **FR-011**: System MUST display a Resource Properties Card showing Name, ID, Provider, Type, Region, and Monthly Cost
- **FR-012**: System MUST display a Tags Card organized into Required Tags and Optional Tags sections
- **FR-013**: System MUST display required tags that are present on the resource with their values and an Edit button
- **FR-014**: System MUST display required tags that are missing with a "not set" message and an "Add value" button
- **FR-015**: System MUST display optional tags that are present with their values, Edit button, and Remove button
- **FR-016**: System MUST provide a back navigation button to return to the Resources list page
- **FR-017**: System MUST display an "Add tag" button under optional tags that opens a popover with available optional tags

#### Task Group 3: Filter Resources

- **FR-018**: System MUST provide filter buttons for Provider, Type, and Region
- **FR-019**: System MUST open a popover when clicking a filter button, showing available filter values
- **FR-020**: System MUST update the resource list when a filter value is selected
- **FR-021**: System MUST display filter badges showing active filter values
- **FR-022**: System MUST allow removal of individual filters via X icon on filter badges
- **FR-023**: System MUST display a "Remove filters" button in filter popover footer when filters are active
- **FR-024**: System MUST dynamically populate Region filter values from unique regions in the resource data
- **FR-025**: System MUST support single selection per filter category (selecting a new value replaces the previous selection)

#### Task Group 4: Sort Resources

- **FR-026**: System MUST enable sorting by Name column (alphabetical)
- **FR-027**: System MUST enable sorting by Provider column (alphabetical)
- **FR-028**: System MUST enable sorting by Monthly Cost column (numerical)
- **FR-029**: System MUST display visual sort indicators (arrows) showing current sort column and direction
- **FR-030**: System MUST toggle sort order (ascending/descending) when clicking the same column header again
- **FR-031**: System MUST maintain sort state when filters are applied or removed

#### Task Group 5: Edit Tags on Resource Detail Page

- **FR-032**: System MUST allow adding missing required tags on the resource detail page
- **FR-033**: System MUST allow editing existing tag values on the resource detail page
- **FR-034**: System MUST allow removing optional tags on the resource detail page
- **FR-035**: System MUST validate tag values against the tag schema before saving
- **FR-036**: System MUST display validation errors when invalid tag values are entered
- **FR-037**: System MUST update the resource immediately after successful tag operations
- **FR-038**: System MUST prevent saving tags with empty string values
- **FR-039**: System MUST display tag input fields in edit mode with Save button
- **FR-040**: System MUST hide Remove button when a tag is in edit mode

#### Task Group 6: Bulk Edit Tags on Resource List

- **FR-041**: System MUST display bulk edit action buttons when 2 or more resources are selected
- **FR-042**: System MUST provide "Add Tag", "Edit Tag", and "Remove Tag" bulk action buttons
- **FR-043**: System MUST show only tags that are not present on any selected resource in the "Add Tag" dropdown
- **FR-044**: System MUST show only tags that are present on at least one selected resource in the "Edit Tag" and "Remove Tag" dropdowns
- **FR-045**: System MUST open a sheet component when a bulk tag operation is initiated
- **FR-045a**: System MUST provide a single input field for entering tag value that applies to all selected resources in bulk operations
- **FR-046**: System MUST display a preview of changes for each resource in the bulk operation sheet
- **FR-047**: System MUST display summary messages indicating how many resources will be updated
- **FR-048**: System MUST support preview mode for bulk operations before applying changes
- **FR-049**: System MUST provide Apply and Cancel actions in the bulk operation sheet
- **FR-050**: System MUST update all selected resources when Apply is clicked
- **FR-051**: System MUST close the sheet without changes when Cancel is clicked

### Key Entities *(include if feature involves data)*

- **Resource**: Represents a cloud resource (VM, database, storage, etc.) with properties: id, name, type, provider, region, monthlyCost, and tags object containing key-value pairs
- **Tag**: Represents a metadata key-value pair attached to a resource (e.g., Environment: "Production", Owner: "platform-team")
- **Required Tags**: Tags that must be present on all resources for compliance (Environment, Owner, BusinessUnit)
- **Optional Tags**: Tags that may be present on resources but are not required (CostCenter, Project, Customer)
- **Tag Coverage**: Percentage of required tags present on a resource (e.g., 2/3 required tags = 66.67% coverage)
- **Compliance Status**: Boolean indicating whether a resource has all required tags and at least 2 optional tags
- **Filter Criteria**: User-selected values for Provider, Type, or Region used to narrow the resource list
- **Sort Criteria**: User-selected column and direction (ascending/descending) for organizing the resource list
- **Bulk Operation**: Tag add/edit/remove operation applied to multiple selected resources simultaneously

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: FinOps analysts can view all 20 resources in the list within 2 seconds of page load
- **SC-002**: FinOps analysts can filter resources by Provider, Type, or Region and see filtered results update within 1 second
- **SC-003**: FinOps analysts can sort resources by Name, Provider, or Monthly Cost and see sorted results update immediately
- **SC-004**: FinOps analysts can navigate to any resource detail page within 1 second of clicking a resource row
- **SC-005**: FinOps analysts can add, edit, or remove tags on a resource detail page and see changes reflected within 2 seconds
- **SC-006**: FinOps analysts can perform bulk tag operations on 2 or more resources and see changes applied to all selected resources within 5 seconds
- **SC-007**: 100% of tag operations (add, edit, remove) successfully persist and are reflected in subsequent page loads
- **SC-008**: FinOps analysts can complete tag editing on a single resource in under 30 seconds
- **SC-009**: System displays appropriate error messages when tag validation fails, enabling users to correct errors immediately
- **SC-010**: Filter and sort state persists during user session, allowing analysts to refine their view without losing context

## Implementation Notes

### Backend/Frontend Split for Commits

Each task group should be implemented in separate commits with backend and frontend split:

1. **View Resources List**
   - Commit 1: Backend - Implement GET /api/resources endpoint
   - Commit 2: Frontend - Implement resource list table component

2. **View Single Resource Details**
   - Commit 3: Backend - Implement GET /api/resources/:id endpoint
   - Commit 4: Frontend - Implement resource detail page component

3. **Filter Resources**
   - Commit 5: Backend - Add filtering logic to GET /api/resources endpoint
   - Commit 6: Frontend - Implement filter UI components and integration

4. **Sort Resources**
   - Commit 7: Backend - Add sorting logic to GET /api/resources endpoint
   - Commit 8: Frontend - Implement sortable column headers and integration

5. **Edit Tags on Resource Detail Page**
   - Commit 9: Backend - Implement POST /api/resources/:id/tag and DELETE /api/resources/:id/tag endpoints
   - Commit 10: Frontend - Implement tag editing UI on resource detail page

6. **Bulk Edit Tags on Resource List**
   - Commit 11: Backend - Implement POST /api/resources/bulk/tag and DELETE /api/resources/bulk/tag endpoints
   - Commit 12: Frontend - Implement bulk edit UI and sheet component

### Dependencies

- Step 1 (Repository Setup) must be complete
- Shared types package (@spotto/types) must be available
- Seed data must be initialized in backend
- Tag schema definition must be available
- Coverage calculation service must be available for tag coverage badges

### Assumptions

- All 20 resources from seed data will be displayed without pagination
- Tag validation follows the schema defined in SPEC.md (required tags: Environment, Owner, BusinessUnit; optional tags: CostCenter, Project, Customer)
- Compliance definition: Resource is compliant if it has all 3 required tags AND at least 2 optional tags
- Resource data is stored in-memory (no database persistence required for MVP)
- No authentication/authorization required for MVP
- Single user scenario (no concurrent editing conflicts to resolve)
- Error handling displays user-friendly messages but does not require complex retry logic
- Empty tag values are not allowed (empty strings are invalid)
- Bulk operations require at least 2 selected resources (not available for single selection)
