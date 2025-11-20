# Data Model: Resources List Feature

**Date**: 2025-01-27  
**Feature**: Resources List Feature (002-resources-list)

## Overview

This document defines the data models, entities, relationships, and validation rules for the Resources List feature. All models are based on the seed data structure and requirements defined in SPEC.md.

## Core Entities

### Resource

**Purpose**: Represents a cloud resource (VM, database, storage, etc.) with its properties and tags.

**Fields**:
- `id` (string, required): Unique identifier (e.g., "vm-prod-web-001")
- `name` (string, required): Human-readable name (e.g., "web-server-prod-east")
- `type` (ResourceType, required): Resource type from ResourceType enum
- `provider` (Provider, required): Cloud provider from Provider enum
- `region` (string, required): Region where resource is deployed (e.g., "eastus", "us-west-2", "global")
- `monthlyCost` (number, required): Monthly cost in USD (e.g., 245.5)
- `tags` (Tags, required): Tags object containing key-value pairs (can be empty object {})

**Validation Rules**:
- `id` must be unique across all resources
- `monthlyCost` must be >= 0
- `tags` must be a valid Tags object (validated against tag schema)

**State Transitions**:
- Created: When seed data is loaded
- Updated: When tags are added, edited, or removed
- No deletion: Resources persist for MVP (no delete operation)

**Example**:
```json
{
  "id": "vm-prod-web-001",
  "name": "web-server-prod-east",
  "type": "Virtual Machine",
  "provider": "Azure",
  "region": "eastus",
  "monthlyCost": 245.5,
  "tags": {
    "Environment": "Production",
    "Owner": "platform-team"
  }
}
```

---

### Tags

**Purpose**: Represents metadata key-value pairs attached to a resource.

**Structure**:
```typescript
type Tags = Partial<{
  Environment: EnvironmentValue;  // 'Production' | 'Staging' | 'Development' | 'Testing'
  Owner: string;                   // Free-form string
  BusinessUnit: BusinessUnitValue; // 'Engineering' | 'Sales' | 'Marketing' | 'Finance' | 'Operations'
  CostCenter: string;             // Free-form string (optional)
  Project: string;                 // Free-form string (optional)
  Customer: string;               // Free-form string (optional)
}>;
```

**Required Tags**:
- `Environment`: Must be one of the allowed EnvironmentValue values
- `Owner`: Must be present and non-empty string
- `BusinessUnit`: Must be one of the allowed BusinessUnitValue values

**Optional Tags**:
- `CostCenter`: Can be added/removed freely
- `Project`: Can be added/removed freely
- `Customer`: Can be added/removed freely

**Validation Rules**:
- Required tags must be present and non-empty for compliance
- Enum-type tags (Environment, BusinessUnit) must match allowed values
- Empty string values are invalid for all tags
- Unknown tag keys are allowed (for future extensibility)

**Compliance Definition**:
A resource is compliant if:
- All 3 required tags are present and non-empty: Environment, Owner, BusinessUnit
- At least 2 optional tags are present and non-empty

**Note**: Resources can have more than 5 tags total, but compliance requires exactly 3 required + at least 2 optional tags. Coverage badge displays "X/5 tags" where X is the count of tags present (rounded down to 5 for display).

---

### TagSchema

**Purpose**: Defines the structure and validation rules for tags.

**Fields**:
- `key` (TagKey, required): Tag key identifier
- `required` (boolean, required): Whether tag is required for compliance
- `allowedValues` (readonly string[], optional): Allowed values for enum-type tags

**Schema Definition**:
```typescript
interface TagSchemaDefinition {
  required: TagSchema[];   // Required tags: Environment, Owner, BusinessUnit
  optional: TagSchema[];   // Optional tags: CostCenter, Project, Customer
}
```

**Required Tags Schema**:
- Environment: required=true, allowedValues=['Production', 'Staging', 'Development', 'Testing']
- Owner: required=true, allowedValues=undefined (free-form string)
- BusinessUnit: required=true, allowedValues=['Engineering', 'Sales', 'Marketing', 'Finance', 'Operations']

**Optional Tags Schema**:
- CostCenter: required=false, allowedValues=undefined (free-form string)
- Project: required=false, allowedValues=undefined (free-form string)
- Customer: required=false, allowedValues=undefined (free-form string)

---

### ResourceWithCoverage

**Purpose**: Extends Resource with tag coverage information for list display.

**Fields** (inherits all Resource fields plus):
- `tagCoverage` (number, required): Count of tags present (up to 5 total, displayed as "X/5 tags")

**Calculation**:
```
tagCoverage = min(presentTagsCount, 5)
```

**Example**: If resource has Environment, Owner, BusinessUnit, CostCenter, Project, Customer:
- Present: 6 tags total
- Display: 5/5 tags (rounded down to 5)
- Coverage badge: "5/5 tags"

**Note**: Resources can have more than 5 tags total, but coverage badge displays up to 5. Compliance still requires exactly 3 required tags AND at least 2 optional tags regardless of total tag count.

---

### TagCoverage

**Purpose**: Overall coverage metrics for all resources (used by dashboard, also needed for list view).

**Fields**:
- `overallCompliance` (number): Percentage of resources that are compliant (0-100)
- `compliantResources` (number): Count of compliant resources
- `totalResources` (number): Total count of resources
- `perTagCoverage` (Record<string, number>): Tag key -> percentage of resources with that tag (0-100)
- `costWeightedCompliance` (number): Percentage of cost that is properly tagged (0-100)
- `compliantCost` (number): Total monthly cost of compliant resources
- `totalCost` (number): Total monthly cost of all resources
- `breakdownByProvider` (Record<string, CoverageStats>): Provider name -> stats
- `breakdownByType` (Record<string, CoverageStats>): Resource type -> stats
- `breakdownByEnvironment` (Record<string, CoverageStats>): Environment value -> stats

**Note**: This entity is primarily for dashboard but needed for list view tag coverage calculations.

---

### CoverageStats

**Purpose**: Coverage statistics for a group of resources (used in breakdowns).

**Fields**:
- `compliant` (number): Count of compliant resources in this group
- `total` (number): Total count of resources in this group
- `percentage` (number): Compliance percentage for this group (0-100)

---

## API Request/Response Models

### ResourceListResponse

**Purpose**: Response for GET /api/resources endpoint.

**Fields**:
- `resources` (ResourceWithCoverage[]): Array of resources with coverage information
- `total` (number): Total count of resources (after filtering)

---

### ResourceDetailResponse

**Purpose**: Response for GET /api/resources/:id endpoint.

**Fields**:
- `resource` (Resource): Single resource object

---

### AddEditTagRequest

**Purpose**: Request body for POST /api/resources/:id/tag endpoint.

**Structure**: Single key-value tag object
```json
{
  "Owner": "finance-team"
}
```

**Validation**: Tag key must be valid TagKey, value must be valid for that tag type.

---

### RemoveTagRequest

**Purpose**: Request body for DELETE /api/resources/:id/tag endpoint.

**Fields**:
- `key` (TagKey): Tag key to remove

---

### UpdateResourceTagsResponse

**Purpose**: Response for POST/DELETE /api/resources/:id/tag endpoints.

**Fields**:
- `resource` (Resource): Updated resource object

---

### BulkAddEditTagRequest

**Purpose**: Request body for POST /api/resources/bulk/tag endpoint.

**Fields**:
- `ids` (string[]): Array of resource IDs to update
- `tag` ({ [key: string]: string }): Single key-value tag object
- `preview` (boolean, optional): If true, return preview without applying changes

---

### BulkRemoveTagRequest

**Purpose**: Request body for DELETE /api/resources/bulk/tag endpoint.

**Fields**:
- `ids` (string[]): Array of resource IDs to update
- `key` (TagKey): Tag key to remove from all resources
- `preview` (boolean, optional): If true, return preview without applying changes

---

### BulkTagPreview

**Purpose**: Preview response for bulk operations (when preview=true).

**Fields**:
- `items` (BulkTagPreviewItem[]): Preview items for each resource
- `summary` (object): Summary statistics
  - `totalResources` (number): Total resources in request
  - `resourcesToUpdate` (number): Resources that will be updated
  - `tagsToAdd` (number): Tags that will be added
  - `tagsToRemove` (number): Tags that will be removed

---

### BulkTagPreviewItem

**Purpose**: Individual preview item for a resource in bulk operation.

**Fields**:
- `resourceId` (string): Resource ID
- `resourceName` (string): Resource name
- `newTags` (Tags): Tags after operation
- `existingTags` (Tags): Current tags before operation

---

### BulkTagResponse

**Purpose**: Response for bulk tag operations (when preview=false).

**Fields**:
- `success` (boolean): Whether operation succeeded
- `updated` (number): Number of resources successfully updated
- `errors` (BulkOperationError[], optional): Errors for resources that failed to update

---

### ResourceFilterOptions

**Purpose**: Filter criteria for resource list query.

**Fields**:
- `provider` (Provider[], optional): Filter by providers (single selection per clarification)
- `type` (ResourceType[], optional): Filter by resource types (single selection per clarification)
- `region` (string[], optional): Filter by regions (single selection per clarification)
- `environment` (EnvironmentValue[], optional): Filter by environment tag values
- `compliant` (boolean, optional): Filter by compliance status

**Note**: Per clarification, filters use single selection (new value replaces previous).

---

### ResourceSortOptions

**Purpose**: Sort criteria for resource list query.

**Fields**:
- `field` ('name' | 'provider' | 'type' | 'monthlyCost' | 'tagCoverage'): Sort field
- `direction` ('asc' | 'desc'): Sort direction

---

### ResourceListQueryParams

**Purpose**: Query parameters for GET /api/resources endpoint.

**Fields**:
- `filter` (ResourceFilterOptions, optional): Filter criteria
- `sort` (ResourceSortOptions, optional): Sort criteria
- `limit` (number, optional): For future pagination support
- `offset` (number, optional): For future pagination support

---

### ErrorResponse

**Purpose**: Standard error response format for all endpoints.

**Fields**:
- `error` (object): Error details
  - `code` (string): Error code ('NOT_FOUND', 'VALIDATION_ERROR', 'INTERNAL_ERROR')
  - `message` (string): Human-readable error message
  - `details` (unknown, optional): Additional error details

---

### ValidationError

**Purpose**: Tag validation error details.

**Fields**:
- `tagKey` (TagKey): Tag key that failed validation
- `message` (string): Error message
- `code` ('INVALID_KEY' | 'INVALID_VALUE' | 'MISSING_REQUIRED'): Error code

---

### BulkOperationError

**Purpose**: Error information for failed resources in bulk operations.

**Fields**:
- `resourceId` (string): Resource ID that failed
- `error` (string): Error message

---

## Enums

### Provider

```typescript
enum Provider {
  Azure = 'Azure',
  AWS = 'AWS',
  GCP = 'GCP',
}
```

---

### ResourceType

```typescript
enum ResourceType {
  VirtualMachine = 'Virtual Machine',
  SQLDatabase = 'SQL Database',
  StorageAccount = 'Storage Account',
  CDN = 'CDN',
  PostgreSQLDatabase = 'PostgreSQL Database',
  RedisCache = 'Redis Cache',
  MongoDBDatabase = 'MongoDB Database',
  MySQLDatabase = 'MySQL Database',
}
```

---

### EnvironmentValue

```typescript
type EnvironmentValue = 'Production' | 'Staging' | 'Development' | 'Testing';
```

---

### BusinessUnitValue

```typescript
type BusinessUnitValue = 'Engineering' | 'Sales' | 'Marketing' | 'Finance' | 'Operations';
```

---

## Relationships

### Resource → Tags (One-to-One)

- Each Resource has exactly one Tags object
- Tags object can be empty {}
- Tags are stored as part of Resource entity (embedded, not separate table)

### Resource → TagCoverage (One-to-One, Computed)

- Each Resource can have tag coverage calculated
- Coverage is computed server-side, not stored
- ResourceWithCoverage extends Resource with computed tagCoverage field

### TagSchema → Tags (One-to-Many, Validation)

- TagSchema defines validation rules for Tags
- Multiple Tags objects are validated against same TagSchema
- TagSchema is static configuration, not stored per resource

---

## Storage Strategy

**Current (MVP)**:
- In-memory array: `let resources: Resource[] = [...seedResources]`
- Resources stored in `backend/src/data/resources.ts`
- Seed data loaded from `backend/src/data/seed-data.ts`
- Tag schema defined in `backend/src/data/tag-schema.ts`

**Future Considerations**:
- Database persistence (PostgreSQL/MongoDB)
- Tag history/audit log
- Resource versioning

---

## Validation Rules Summary

### Resource Validation

1. `id` must be unique
2. `name` must be non-empty string
3. `type` must be valid ResourceType enum value
4. `provider` must be valid Provider enum value
5. `region` must be non-empty string
6. `monthlyCost` must be >= 0

### Tag Validation

1. Required tags (Environment, Owner, BusinessUnit) must be present and non-empty for compliance
2. Enum-type tags must match allowed values:
   - Environment: 'Production' | 'Staging' | 'Development' | 'Testing'
   - BusinessUnit: 'Engineering' | 'Sales' | 'Marketing' | 'Finance' | 'Operations'
3. Empty string values are invalid for all tags
4. Unknown tag keys are allowed (for extensibility)

### Coverage Calculation

1. Resource coverage: Count of tags present (up to 5 total), displayed as "X/5 tags" format
2. Coverage calculation: `min(presentTagsCount, 5)` - resources can have more than 5 tags but display rounds down to 5
3. Compliance: All 3 required tags AND at least 2 optional tags present and non-empty (regardless of total tag count)
4. Cost-weighted compliance: (compliantCost / totalCost) * 100

---

## Data Flow

### List Resources Flow

1. Frontend requests GET /api/resources?filter=...&sort=...
2. Backend filters/sorts resources from in-memory array
3. Backend calculates tag coverage for each resource
4. Backend returns ResourceListResponse with ResourceWithCoverage[]

### Edit Tag Flow

1. Frontend sends POST /api/resources/:id/tag with tag object
2. Backend validates tag against schema
3. Backend updates resource tags in memory
4. Backend returns updated Resource

### Bulk Edit Flow

1. Frontend sends POST /api/resources/bulk/tag with ids and tag (preview=true)
2. Backend generates preview for each resource
3. Backend returns BulkTagPreview
4. Frontend displays preview, user clicks Apply
5. Frontend sends POST /api/resources/bulk/tag with preview=false
6. Backend updates all resources in memory
7. Backend returns BulkTagResponse
