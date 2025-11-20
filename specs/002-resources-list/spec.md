# Feature Specification: Resources List Feature

**Feature Branch**: `002-resources-list`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "use the @SPEC.md and the @README.md to build the resources list see step 2, each sub task in the list group of tasks. the backend / front split are part will be seperate commits."

## Clarifications

### Session 2025-01-27

- Q: Tag Coverage Badge Display Location - Should the tag coverage badge appear as a separate column, badge overlay, or only on hover? → A: As a separate "Tag Coverage" column in the table (showing "X/5 tags"), display only (not clickable, no popover)
- Q: Filter Logic When Multiple Values Selected - When selecting multiple filter values within the same category, should the system show resources matching any value (OR), all values (AND), or only the most recent selection? → A: Only the most recently selected value (single selection only)
- Q: "Select All" Checkbox Behavior - When clicking "Select all" checkbox, should it select all resources in system, all matching filters, or only currently visible resources? → A: Only resources currently visible in the filtered/sorted view
- Q: Bulk Edit Tag Value Input - How should tag values be entered for bulk operations? → A: Single input field that applies the same value to all selected resources
- Q: Tag Coverage Calculation - Should coverage be based on 3 required tags or 5 total tags (3 required + 2 optional)? → A: Coverage badge shows "X/5 tags" format, where X is the count of tags present (up to 5 total). Coverage calculation allows more than 5 tags total but rounds down to 5 for display. Compliance still requires 3 required tags AND at least 2 optional tags.
- Q: Bulk Edit Tag Selection UI - How should tags be selected for bulk add/edit/remove operations? → A: Use popovers (like filters) that list available tags. For add/edit: show all tags split into Required and Optional groups, all tags shown normally and selectable. For remove: show only optional tags that are used across any selected resources, split into Optional group.
- Q: Bulk Edit Actions - Should Add Tag and Edit Tag be separate buttons or combined? → A: Combined into a single "Add/Edit Tag" button
- Q: Bulk Edit Preview - When should preview be shown in bulk operations? → A: Preview should be shown immediately as soon as user edits a tag value, before clicking Apply
- Q: Tag Value Input UI for Enum Types - How should users enter values for enum-type tags (Environment, BusinessUnit) versus free-form tags? → A: Dropdown/select menu for enum-type tags (Environment, BusinessUnit), text input for free-form tags (Owner, CostCenter, Project, Customer)
- Q: Preview Calculation Timing in Bulk Operations - When should preview be calculated when user edits tag value? → A: Calculate preview with debounce (300-500ms delay after typing stops) to reduce API calls while maintaining responsive feel
- Q: Greyed-Out Tag Selection Behavior - Should already-added tags be greyed out in popovers? → A: No - all tags should be shown normally and selectable, regardless of whether they're already on the resource

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Resources List (Priority: P1)

A FinOps analyst opens the Resources page and sees a table displaying all cloud resources with their key properties and tag information, allowing them to quickly assess resource inventory and tag coverage across their cloud infrastructure.

**Why this priority**: Viewing the resource list is the foundational capability that enables all other resource management activities. Without this, users cannot identify which resources need attention or perform any tag management operations.

**Independent Test**: Can be fully tested by opening the Resources page and verifying that all 20 resources from the seed data are displayed in a table format with all required columns visible. The test delivers immediate visibility into the resource inventory.

**Acceptance Scenarios**:

1. **Given** a FinOps analyst navigates to the Resources page, **When** the page loads, **Then** they see a table displaying all cloud resources with columns: Checkbox, Name, Type, Provider, Region, Monthly Cost, Tag Coverage, Environment, Owner, BusinessUnit, CostCenter, Project, Customer
2. **Given** resources are displayed in the table, **When** a FinOps analyst views the Tag Coverage column, **Then** they see a badge showing "X/5 tags" format for each resource (where X is the count of tags present, up to 5 total)
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
2. **Given** a FinOps analyst clicks "Add value" for a missing required tag, **When** a popover opens, **Then** they see all tags listed in two groups (Required and Optional), all tags shown normally and selectable
3. **Given** a FinOps analyst selects a tag from the popover, **When** the input field appears, **Then** they see a dropdown/select menu for enum tags (Environment, BusinessUnit) or a text input for free-form tags (Owner, CostCenter, Project, Customer), and can enter/select a value and click Save to add the tag
4. **Given** a FinOps analyst is viewing a resource with existing tags, **When** they click the Edit button for a tag, **Then** a popover opens showing all tags in two groups (Required and Optional), with the current tag pre-selected
5. **Given** a FinOps analyst selects a tag from the edit popover, **When** the input field appears with the current value, **Then** they see a dropdown/select menu (for enum tags) or text input (for free-form tags) with the current value pre-filled, and can modify the value and click Save to update the tag
6. **Given** a FinOps analyst edits a tag value, **When** they click Save, **Then** the tag is updated via POST endpoint and the change is reflected immediately on the page
7. **Given** a FinOps analyst is viewing optional tags, **When** they click the Remove button (X) for an optional tag, **Then** the tag is removed via DELETE endpoint and the change is reflected immediately
8. **Given** a FinOps analyst wants to add an optional tag, **When** they click "Add tag" under optional tags, **Then** a popover opens showing all tags in two groups (Required and Optional), all tags shown normally and selectable
9. **Given** a FinOps analyst selects a tag from the popover, **When** they enter a value and save, **Then** the tag is added to the resource via POST endpoint

---

### User Story 6 - Bulk Edit Tags on Resource List (Priority: P3)

A FinOps analyst selects multiple resources and performs bulk tag operations (add, edit, or remove tags) across all selected resources simultaneously, enabling efficient tag management for groups of resources that share common characteristics.

**Why this priority**: Bulk operations significantly improve efficiency when managing tags across multiple resources. While important, it builds on single-resource editing and can be implemented after core functionality is in place.

**Independent Test**: Can be fully tested by selecting multiple resources, choosing a bulk tag operation, previewing changes, and applying them. The test delivers efficient tag management for resource groups.

**Acceptance Scenarios**:

1. **Given** a FinOps analyst is on the Resources list page, **When** they click the "Select all" checkbox in the table header, **Then** all resources currently visible in the filtered/sorted view are selected
2. **Given** a FinOps analyst has filters applied, **When** they click "Select all", **Then** only resources matching the active filters are selected (not all resources in the system)
3. **Given** a FinOps analyst is on the Resources list page, **When** they select 2 or more resources using checkboxes, **Then** bulk edit action buttons appear (Add/Edit Tag, Remove Tag)
4. **Given** a FinOps analyst has selected multiple resources, **When** they click "Add/Edit Tag", **Then** a popover opens showing all tags in two groups (Required and Optional), all tags shown normally and selectable
5. **Given** a FinOps analyst selects a tag from the popover, **When** they proceed, **Then** a sheet opens showing a single input field (dropdown for enum tags, text input for free-form tags) for entering the tag value
6. **Given** a FinOps analyst enters a tag value in the bulk operation sheet, **When** they type in the input field, **Then** a preview is displayed (with 300-500ms debounce after typing stops) showing how the change will affect each selected resource
7. **Given** a FinOps analyst views the bulk operation preview, **When** they review the changes, **Then** they see each resource's current tags and new tags after the operation
8. **Given** a FinOps analyst reviews the bulk operation preview, **When** they click Apply, **Then** the tag operation is applied to all selected resources via POST endpoint and the list updates to reflect changes
9. **Given** a FinOps analyst reviews the bulk operation preview, **When** they click Cancel, **Then** the sheet closes without making any changes
10. **Given** a FinOps analyst clicks "Remove Tag", **When** the popover opens, **Then** they see only optional tags that are used across any selected resources, displayed in an Optional group
11. **Given** a FinOps analyst selects a tag to remove, **When** they proceed, **Then** a preview is immediately displayed showing how the removal will affect each selected resource
12. **Given** a FinOps analyst reviews the bulk remove preview, **When** they click Apply, **Then** the tag is removed from all selected resources via DELETE endpoint and the list updates to reflect changes

---

### Edge Cases

- **Empty resource list**: When no resources exist in the system, the table displays an empty state with appropriate messaging
- **No resources match filters**: When filters are applied but no resources match, an empty state is displayed with a "Clear filters" action
- **Network errors during API calls**: When API requests fail, user-friendly error messages are displayed with options to retry
- **Invalid tag values**: When a user attempts to save an invalid tag value (e.g., invalid enum value for Environment), validation errors are displayed
- **Concurrent tag updates**: When multiple users edit the same resource simultaneously, the last update wins (no conflict resolution needed for MVP)
- **Resource not found**: When navigating to a resource detail page for a non-existent resource ID, a 404 error page is displayed
- **Detail view endpoint updates**: GET /api/resources/:id endpoint must work correctly and return updated resource data after tag operations
- **Tag coverage calculation**: Coverage badge shows "X/5 tags" where X is the count of tags present (up to 5 total). Resources can have more than 5 tags, but display rounds down to 5. Compliance still requires 3 required + at least 2 optional tags
- **Large number of resources**: System handles displaying all 20 resources without pagination (pagination is out of scope for MVP)
- **Missing required tags**: Resources with missing required tags are clearly indicated in the UI with appropriate visual indicators
- **Empty tag values**: System prevents saving tags with empty string values
- **Bulk operation on single resource**: Bulk edit actions appear when 2 or more resources are selected (not for single selection)

### Known Bugs (Requiring Fixes)

**Bug 1: Automatic Submission on Sheet Open for Add/Edit with Enum Values**

- **Description**: When the bulk add/edit sheet opens for an enum-type tag (Environment, BusinessUnit), selecting a value from the dropdown immediately triggers a submission instead of showing a preview. The sheet continuously re-renders and the preview is never displayed.
- **Impact**: Users cannot review changes before applying them for enum-type tags. The continuous re-rendering creates a poor user experience.
- **Expected Behavior**: When a user selects an enum value from the dropdown, a preview should be displayed (with debounce) showing how the change will affect each selected resource. The operation should only be applied when the user clicks "Apply".
- **Root Cause**: The Select component's `onValueChange` handler immediately updates `tagValue`, which triggers the preview useEffect. This may be causing the mutation to execute with `preview=false` instead of `preview=true`, or the debounce logic is not working correctly for enum selections.

**Bug 2: Continuous Re-rendering on Sheet Open for Add/Edit with String Values**

- **Description**: When the bulk add/edit sheet opens for a string-type tag (Owner, CostCenter, Project, Customer), the preview continuously re-renders as the user types, even with debounce logic in place.
- **Impact**: Poor performance and user experience. The preview may flicker or become unresponsive during typing.
- **Expected Behavior**: Preview should only be calculated after the user stops typing for 300-500ms (debounce). The preview should update smoothly without continuous re-renders.
- **Root Cause**: The debounce logic in the useEffect may not be properly clearing previous timeouts, or the mutation is causing state updates that trigger re-renders in a loop.

**Bug 3: Automatic Submission on Sheet Open for Delete Operation**

- **Description**: When the bulk delete sheet opens, it immediately starts submitting to the delete endpoint and continuously re-renders. No preview is displayed as specified in the requirements.
- **Impact**: Users cannot review which resources will be affected before confirming deletion. The operation may execute unintentionally.
- **Expected Behavior**: When the delete sheet opens, a preview should be immediately displayed (without user input) showing how the tag removal will affect each selected resource. The operation should only be applied when the user clicks "Apply".
- **Root Cause**: The useEffect for remove operations (lines 135-155) immediately calls `fetchPreview()` when the sheet opens, but the mutation may be executing with `preview=false` instead of `preview=true`, or the mutation is being called multiple times causing a re-render loop.

## Requirements *(mandatory)*

### Functional Requirements

#### Task Group 1: View Resources List

- **FR-001**: System MUST display all resources in a table format on the Resources list page
- **FR-002**: System MUST display table columns: Checkbox, Name, Type, Provider, Region, Monthly Cost, Tag Coverage, Environment, Owner, BusinessUnit, CostCenter, Project, Customer
- **FR-002a**: System MUST display Tag Coverage column showing "X/5 tags" format for each resource (where X is the count of tags present, up to 5 total, display only, not interactive)
- **FR-002b**: System MUST display individual columns for each tag: Environment, Owner, BusinessUnit, CostCenter, Project, Customer
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

- **FR-032**: System MUST allow adding missing required tags on the resource detail page via popover interface
- **FR-033**: System MUST allow editing existing tag values on the resource detail page via popover interface
- **FR-034**: System MUST allow removing optional tags on the resource detail page via DELETE endpoint
- **FR-035**: System MUST validate tag values against the tag schema before saving
- **FR-036**: System MUST display validation errors when invalid tag values are entered
- **FR-037**: System MUST update the resource immediately after successful tag operations (POST for add/edit, DELETE for remove)
- **FR-038**: System MUST prevent saving tags with empty string values
- **FR-039**: System MUST display tag selection popovers (like filters) with all tags split into Required and Optional groups
- **FR-040**: System MUST display all tags in popovers normally (not greyed out), regardless of whether they're already on the resource
- **FR-041**: System MUST ensure detail view endpoints (GET /api/resources/:id) work correctly and update after tag operations
- **FR-042**: System MUST provide dropdown/select menu for entering enum-type tag values (Environment, BusinessUnit)
- **FR-043**: System MUST provide text input for entering free-form tag values (Owner, CostCenter, Project, Customer)

#### Task Group 6: Bulk Edit Tags on Resource List

- **FR-042**: System MUST display bulk edit action buttons when 2 or more resources are selected
- **FR-043**: System MUST provide "Add/Edit Tag" (combined) and "Remove Tag" bulk action buttons
- **FR-044**: System MUST open a popover when "Add/Edit Tag" is clicked, showing all tags split into Required and Optional groups
- **FR-045**: System MUST display all tags in the popover normally (not greyed out), regardless of whether they're already on selected resources
- **FR-046**: System MUST open a popover when "Remove Tag" is clicked, showing only optional tags that are used across any selected resources in an Optional group
- **FR-047**: System MUST open a sheet component after tag selection in bulk operations
- **FR-048**: System MUST provide a single input field (dropdown for enum tags, text input for free-form tags) for entering tag value that applies to all selected resources in bulk operations
- **FR-049**: System MUST display a preview of changes with debounce (300-500ms delay after typing stops) when user edits a tag value in the input field
- **FR-050**: System MUST display a preview showing each resource's current tags and new tags after the operation
- **FR-051**: System MUST display summary messages indicating how many resources will be updated
- **FR-052**: System MUST provide Apply and Cancel actions in the bulk operation sheet
- **FR-053**: System MUST update all selected resources via POST endpoint when Apply is clicked for add/edit operations
- **FR-054**: System MUST update all selected resources via DELETE endpoint when Apply is clicked for remove operations
- **FR-055**: System MUST close the sheet without changes when Cancel is clicked

### Key Entities *(include if feature involves data)*

- **Resource**: Represents a cloud resource (VM, database, storage, etc.) with properties: id, name, type, provider, region, monthlyCost, and tags object containing key-value pairs
- **Tag**: Represents a metadata key-value pair attached to a resource (e.g., Environment: "Production", Owner: "platform-team")
- **Required Tags**: Tags that must be present on all resources for compliance (Environment, Owner, BusinessUnit)
- **Optional Tags**: Tags that may be present on resources but are not required (CostCenter, Project, Customer)
- **Tag Coverage**: Count of tags present on a resource displayed as "X/5 tags" format (where X is the count of tags present, up to 5 total). Coverage calculation allows more than 5 tags total but rounds down to 5 for display purposes
- **Compliance Status**: Boolean indicating whether a resource has all 3 required tags AND at least 2 optional tags (compliance requires exactly 3 required + at least 2 optional, even if resource has more than 5 tags total)
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
   - Commit 9: Backend - Implement POST /api/resources/:id/tag and DELETE /api/resources/:id/tag endpoints (ensure DELETE endpoint works correctly)
   - Commit 10: Frontend - Implement tag editing UI on resource detail page with popovers (like filters) showing all tags split into Required and Optional groups

6. **Bulk Edit Tags on Resource List**
   - Commit 11: Backend - Implement POST /api/resources/bulk/tag and DELETE /api/resources/bulk/tag endpoints (ensure DELETE endpoint works correctly)
   - Commit 12: Frontend - Implement bulk edit UI with combined "Add/Edit Tag" button, popovers showing tags split into Required/Optional groups, and immediate preview display as user edits values

### Dependencies

- Step 1 (Repository Setup) must be complete
- Shared types package (@spotto/types) must be available
- Seed data must be initialized in backend
- Tag schema definition must be available
- Coverage calculation service must be available for tag coverage badges

### Assumptions

- All 20 resources from seed data will be displayed without pagination
- Tag validation follows the schema defined in SPEC.md (required tags: Environment, Owner, BusinessUnit; optional tags: CostCenter, Project, Customer)
- Compliance definition: Resource is compliant if it has all 3 required tags AND at least 2 optional tags. Resources can have more than 5 tags total, but coverage badge displays "X/5 tags" (rounding down to 5 for display). Compliance still requires exactly 3 required + at least 2 optional tags regardless of total tag count
- Resource data is stored in-memory (no database persistence required for MVP)
- No authentication/authorization required for MVP
- Single user scenario (no concurrent editing conflicts to resolve)
- Error handling displays user-friendly messages but does not require complex retry logic
- Empty tag values are not allowed (empty strings are invalid)
- Bulk operations require at least 2 selected resources (not available for single selection)
