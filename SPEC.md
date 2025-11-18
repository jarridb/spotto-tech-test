# Spotto Technical Assessment: Cloud Resource Tagging System

## Who we are building for

### FinOps (Financial Operations) is a discipline that combines finance, operations, and engineering to manage cloud costs effectively. A FinOps analyst is responsible for:

- Cost visibility & allocation: Understanding where cloud spending goes across teams, projects, and business units
- Chargeback/showback: Accurately billing internal teams for their cloud resource usage
- Cost optimization: Identifying waste, rightsizing resources, and finding savings opportunities
- Budgeting & forecasting: Predicting future cloud costs based on usage patterns
- Governance & compliance: Ensuring resources follow organizational tagging policies

## Your interpretation of the "Tag Coverage Dashboard" requirement

To understand what a tag coverage dashboard is did a search on What is a "FinOps Analyst?", this has been added above under the who section

This helps me to define what Tag coverage is:
Tag coverage refers to how the resources are tagged how the usage is mesaured, are they compliant or not. If a resource is not tagged correctly then it will be non compliant and finops would not be able to allocate costs.

After looking at hte data I would see that the things a finops would look for in coverage are:

1. per resource - is each resource compliant or not, do they have required tags
2. overall - what % or resources are compliant
3. per tag - which resources have each tag
4. cost-weighted - what % of spend is properly tagged

## What we are building

### Seed data

Create an initial dataset with 20 mock resources. Here's the JSON structure to use:

```json
[
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
  },
  {
    "id": "db-prod-sql-001",
    "name": "sql-primary-prod",
    "type": "SQL Database",
    "provider": "Azure",
    "region": "eastus",
    "monthlyCost": 892.3,
    "tags": {
      "Environment": "Production",
      "Owner": "data-team",
      "BusinessUnit": "Engineering"
    }
  },
  {
    "id": "storage-dev-001",
    "name": "devstorage-artifacts",
    "type": "Storage Account",
    "provider": "Azure",
    "region": "westus",
    "monthlyCost": 45.2,
    "tags": {
      "Environment": "Development",
      "Owner": "dev-team"
    }
  },
  {
    "id": "vm-staging-api-001",
    "name": "api-server-staging",
    "type": "Virtual Machine",
    "provider": "AWS",
    "region": "us-west-2",
    "monthlyCost": 156.8,
    "tags": {
      "Environment": "Staging",
      "Owner": "backend-team",
      "BusinessUnit": "Engineering",
      "Project": "API-v2"
    }
  },
  {
    "id": "cdn-prod-001",
    "name": "cdn-global-prod",
    "type": "CDN",
    "provider": "Azure",
    "region": "global",
    "monthlyCost": 678.9,
    "tags": {
      "Environment": "Production"
    }
  },
  {
    "id": "vm-prod-worker-001",
    "name": "worker-node-prod-1",
    "type": "Virtual Machine",
    "provider": "AWS",
    "region": "us-east-1",
    "monthlyCost": 189.4,
    "tags": {
      "Environment": "Production",
      "Owner": "platform-team",
      "BusinessUnit": "Engineering"
    }
  },
  {
    "id": "db-dev-postgres-001",
    "name": "postgres-dev-instance",
    "type": "PostgreSQL Database",
    "provider": "GCP",
    "region": "us-central1",
    "monthlyCost": 124.6,
    "tags": {
      "Environment": "Development",
      "Owner": "data-team"
    }
  },
  {
    "id": "storage-prod-logs-001",
    "name": "logs-storage-prod",
    "type": "Storage Account",
    "provider": "AWS",
    "region": "us-east-1",
    "monthlyCost": 234.7,
    "tags": {
      "Environment": "Production",
      "Owner": "ops-team",
      "BusinessUnit": "Operations"
    }
  },
  {
    "id": "vm-test-selenium-001",
    "name": "selenium-test-runner",
    "type": "Virtual Machine",
    "provider": "Azure",
    "region": "northeurope",
    "monthlyCost": 98.3,
    "tags": {
      "Environment": "Testing",
      "Owner": "qa-team"
    }
  },
  {
    "id": "db-prod-redis-001",
    "name": "redis-cache-prod",
    "type": "Redis Cache",
    "provider": "Azure",
    "region": "eastus",
    "monthlyCost": 445.2,
    "tags": {
      "Environment": "Production",
      "Owner": "backend-team",
      "BusinessUnit": "Engineering",
      "Project": "API-v2"
    }
  },
  {
    "id": "vm-prod-batch-001",
    "name": "batch-processor-prod",
    "type": "Virtual Machine",
    "provider": "GCP",
    "region": "us-west1",
    "monthlyCost": 312.5,
    "tags": {}
  },
  {
    "id": "storage-staging-media-001",
    "name": "media-storage-staging",
    "type": "Storage Account",
    "provider": "AWS",
    "region": "eu-west-1",
    "monthlyCost": 167.8,
    "tags": {
      "Environment": "Staging",
      "Owner": "frontend-team"
    }
  },
  {
    "id": "db-prod-mongo-001",
    "name": "mongodb-prod-cluster",
    "type": "MongoDB Database",
    "provider": "Azure",
    "region": "eastus",
    "monthlyCost": 756.4,
    "tags": {
      "Environment": "Production",
      "BusinessUnit": "Engineering"
    }
  },
  {
    "id": "vm-dev-jupyter-001",
    "name": "jupyter-notebook-dev",
    "type": "Virtual Machine",
    "provider": "GCP",
    "region": "us-central1",
    "monthlyCost": 87.9,
    "tags": {
      "Environment": "Development",
      "Owner": "data-science-team",
      "BusinessUnit": "Engineering"
    }
  },
  {
    "id": "cdn-staging-001",
    "name": "cdn-staging-global",
    "type": "CDN",
    "provider": "AWS",
    "region": "global",
    "monthlyCost": 123.4,
    "tags": {
      "Environment": "Staging"
    }
  },
  {
    "id": "storage-prod-backup-001",
    "name": "backup-storage-prod",
    "type": "Storage Account",
    "provider": "Azure",
    "region": "westeurope",
    "monthlyCost": 534.6,
    "tags": {
      "Environment": "Production",
      "Owner": "ops-team",
      "BusinessUnit": "Operations",
      "CostCenter": "IT-Infrastructure"
    }
  },
  {
    "id": "vm-prod-elk-001",
    "name": "elasticsearch-prod-node-1",
    "type": "Virtual Machine",
    "provider": "AWS",
    "region": "us-west-2",
    "monthlyCost": 423.7,
    "tags": {
      "Environment": "Production",
      "Owner": "platform-team"
    }
  },
  {
    "id": "db-staging-mysql-001",
    "name": "mysql-staging-db",
    "type": "MySQL Database",
    "provider": "GCP",
    "region": "europe-west1",
    "monthlyCost": 198.2,
    "tags": {
      "Environment": "Staging",
      "Owner": "backend-team",
      "BusinessUnit": "Engineering"
    }
  },
  {
    "id": "vm-prod-monitoring-001",
    "name": "prometheus-prod-monitor",
    "type": "Virtual Machine",
    "provider": "Azure",
    "region": "eastus",
    "monthlyCost": 267.3,
    "tags": {
      "Environment": "Production",
      "Owner": "ops-team",
      "BusinessUnit": "Operations"
    }
  },
  {
    "id": "storage-dev-temp-001",
    "name": "temp-dev-storage",
    "type": "Storage Account",
    "provider": "AWS",
    "region": "us-east-1",
    "monthlyCost": 12.8,
    "tags": {
      "Environment": "Development"
    }
  }
]
```

### Data models

This section defines all data models used throughout the application. Models are based on the seed data structure and requirements for the dashboard and resource management features.

**Model Categories:**

- **Core Models**: Resource, Tags, TagSchema - fundamental data structures
- **Coverage Models**: TagCoverage, CoverageStats - dashboard metrics and calculations
- **API Models**: Request/Response interfaces for API endpoints
- **Utility Models**: Filter, Sort, Validation - supporting data structures

### Enums

```typescript
enum Provider {
  Azure = 'Azure',
  AWS = 'AWS',
  GCP = 'GCP',
}

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

enum Environment {
  Production = 'Production',
  Staging = 'Staging',
  Development = 'Development',
  Testing = 'Testing',
}

enum BusinessUnit {
  Engineering = 'Engineering',
  Sales = 'Sales',
  Marketing = 'Marketing',
  Finance = 'Finance',
  Operations = 'Operations',
}
```

### Tag Types

```typescript
// Shared tag definition - single source of truth for FE and BE
// Both frontend and backend import from shared/types/tag.ts

// Define valid values for enum-type tags
type EnvironmentValue = 'Production' | 'Staging' | 'Development' | 'Testing';
type BusinessUnitValue = 'Engineering' | 'Sales' | 'Marketing' | 'Finance' | 'Operations';

// Unified tags type - works for both JSON (API) and internal use
// All values are strings (as they appear in JSON), but TypeScript enforces valid enum values
type Tags = Partial<{
  Environment: EnvironmentValue;
  Owner: string;
  BusinessUnit: BusinessUnitValue;
  CostCenter: string;
  Project: string;
  Customer: string;
}>;

// Tag key type
type TagKey = keyof Tags;

// Individual tag with type safety
type Tag<K extends TagKey = TagKey> = {
  key: K;
  value: Tags[K];
};
```

### Resource

```typescript
/**
 * Core resource model representing a cloud resource
 * Based on the seed data structure with 20 mock resources
 */
interface Resource {
  // Unique identifier for the resource (e.g., "vm-prod-web-001")
  id: string;

  // Human-readable name (e.g., "web-server-prod-east")
  name: string;

  // Resource type from ResourceType enum
  type: ResourceType;

  // Cloud provider from Provider enum
  provider: Provider;

  // Region where the resource is deployed (e.g., "eastus", "us-west-2", "global")
  region: string;

  // Monthly cost in USD (e.g., 245.5)
  monthlyCost: number;

  // Tags object containing key-value pairs
  // Can be empty object {} if no tags are present
  tags: Tags;
}

/**
 * Example resource from seed data:
 * {
 *   id: "vm-prod-web-001",
 *   name: "web-server-prod-east",
 *   type: "Virtual Machine",
 *   provider: "Azure",
 *   region: "eastus",
 *   monthlyCost: 245.5,
 *   tags: {
 *     Environment: "Production",
 *     Owner: "platform-team"
 *   }
 * }
 */
```

### API Response Models

```typescript
/**
 * Response model for resource list endpoint
 * Includes resources with tag coverage information
 */
interface ResourceListResponse {
  resources: ResourceWithCoverage[];
  total: number;
}

/**
 * Response model for single resource endpoint
 */
interface ResourceDetailResponse {
  resource: Resource;
}

/**
 * Response model for coverage endpoint
 */
interface CoverageResponse {
  coverage: TagCoverage;
}

/**
 * Response model for tag schema endpoint
 */
interface TagSchemaResponse {
  schema: TagSchemaDefinition;
}

/**
 * Bulk tag operation request
 */
interface BulkTagRequest {
  resourceIds: string[]; // Array of resource IDs to update
  tagsToAdd: Tags; // Tags to add/update
  tagsToRemove?: TagKey[]; // Optional: tag keys to remove
}

/**
 * Bulk tag operation preview
 * Shows what changes will be made before applying
 */
interface BulkTagPreview {
  items: BulkTagPreviewItem[];
  summary: {
    totalResources: number;
    resourcesToUpdate: number;
    tagsToAdd: number;
    tagsToRemove: number;
  };
}

interface BulkTagPreviewItem {
  resourceId: string;
  resourceName: string;
  newTags: Tags;
  existingTags: Tags;
}

/**
 * Bulk tag operation response
 */
interface BulkTagResponse {
  success: boolean;
  updated: number; // Number of resources successfully updated
  errors?: BulkOperationError[]; // Errors for resources that failed to update
}

/**
 * Single resource tag update request
 */
interface UpdateResourceTagsRequest {
  tags: Tags; // Complete tags object (will replace existing tags)
}

/**
 * Single resource tag update response
 */
interface UpdateResourceTagsResponse {
  resource: Resource;
}

/**
 * Filter options for resource list
 */
interface ResourceFilterOptions {
  provider?: Provider[]; // Filter by one or more providers
  type?: ResourceType[]; // Filter by one or more resource types
  region?: string[]; // Filter by one or more regions (dynamically populated from resources)
  environment?: EnvironmentValue[]; // Filter by environment tag values
  compliant?: boolean; // Filter by compliance status
}

/**
 * Sort options for resource list
 */
interface ResourceSortOptions {
  field: 'name' | 'provider' | 'type' | 'monthlyCost' | 'tagCoverage';
  direction: 'asc' | 'desc';
}

/**
 * Query parameters for resource list endpoint
 */
interface ResourceListQueryParams {
  filter?: ResourceFilterOptions;
  sort?: ResourceSortOptions;
  limit?: number; // For future pagination support
  offset?: number; // For future pagination support
}
```

### Tag Schema

```typescript
interface TagSchema {
  key: TagKey;
  required: boolean;
  allowedValues?: readonly string[]; // For enum types like Environment, BusinessUnit
}

interface TagSchemaDefinition {
  required: TagSchema[];
  optional: TagSchema[];
}
```

### Tag Coverage Metrics

```typescript
/**
 * Main coverage metrics interface returned by the coverage API endpoint
 * Used by the dashboard to display tag compliance statistics
 */
interface TagCoverage {
  // Overall compliance metrics
  overallCompliance: number; // percentage of resources that are compliant (0-100)
  compliantResources: number; // count of compliant resources
  totalResources: number; // total count of resources

  // Per-tag coverage percentages
  // Maps tag key (e.g., 'Environment', 'Owner') to percentage of resources with that tag
  perTagCoverage: Record<string, number>; // tag key -> percentage (0-100)

  // Cost-weighted coverage metrics
  costWeightedCompliance: number; // percentage of cost that is properly tagged (0-100)
  compliantCost: number; // total monthly cost of compliant resources
  totalCost: number; // total monthly cost of all resources

  // Breakdown statistics by different dimensions
  breakdownByProvider: Record<string, CoverageStats>; // provider name -> stats
  breakdownByType: Record<string, CoverageStats>; // resource type -> stats
  breakdownByEnvironment: Record<string, CoverageStats>; // environment value -> stats
}

/**
 * Coverage statistics for a group of resources
 * Used in breakdowns by provider, type, environment, etc.
 */
interface CoverageStats {
  compliant: number; // count of compliant resources in this group
  total: number; // total count of resources in this group
  percentage: number; // compliance percentage for this group (0-100)
}

/**
 * Resource with tag coverage information
 * Used in resource list views to display coverage badge
 */
interface ResourceWithCoverage extends Resource {
  tagCoverage: number; // percentage of required tags present (0-100)
  // Example: if 2 out of 3 required tags are present, tagCoverage = 66.67
}

/**
 * Validation error for tag operations
 */
interface ValidationError {
  tagKey: TagKey;
  message: string;
  code: 'INVALID_KEY' | 'INVALID_VALUE' | 'MISSING_REQUIRED';
}

/**
 * Error information for bulk tag operations
 */
interface BulkOperationError {
  resourceId: string;
  error: string;
}
```

### Coverage Calculation Details

**Compliance Definition:**
A resource is considered compliant if it has all required tags present and non-empty:

- `Environment` (required)
- `Owner` (required)
- `BusinessUnit` (required)

**Coverage Metrics:**

1. **Overall Compliance**: Percentage of resources that have all required tags

   ```
   overallCompliance = (compliantResources / totalResources) * 100
   ```

2. **Per-Tag Coverage**: Percentage of resources that have each specific tag (required or optional)

   ```
   perTagCoverage[tagKey] = (resourcesWithTag / totalResources) * 100
   ```

3. **Cost-Weighted Compliance**: Percentage of total monthly cost that comes from compliant resources

   ```
   costWeightedCompliance = (compliantCost / totalCost) * 100
   ```

   This metric is important for FinOps as it shows what percentage of spending is properly tagged for cost allocation.

4. **Resource Tag Coverage**: For individual resources, the percentage of required tags present

   ```
   tagCoverage = (presentRequiredTags / totalRequiredTags) * 100
   ```

   Example: If a resource has `Environment` and `Owner` but missing `BusinessUnit`:
   - Present: 2 tags
   - Required: 3 tags
   - Coverage: 66.67%

5. **Breakdown Statistics**: Compliance metrics grouped by:
   - **Provider** (Azure, AWS, GCP): Shows compliance per cloud provider
   - **Type** (Virtual Machine, SQL Database, etc.): Shows compliance per resource type
   - **Environment** (Production, Staging, Development, Testing, or "No Environment"): Shows compliance per environment tag value

### Application details

- Application conssists of two pages
  1. Dashboard
  2. Resources
- The main layout will use shadncns `sidebar` component
- The sidebar will have:
  1. logo
  2. navigation items
     - link to / #Home/Dashboard
     - link to /resources #Resrouces
  3. the sidebar header will have:
     - a collapsible sidebar button
     - breadcrumbs be
       - 'Dashbord' not shown
       - Resources - Home > Resources
       - Resources detail - Resources > Resource
     - page name will come from route meta data

#### 1. Resources Feature (`features/resources`)

**Resource List View** (`resource-list.tsx`)

- Displays all cloud resources in a table format
- Table columns: Name, Type, Provider, Region, Monthly Cost, Tag Coverage
- Features:
  - **Filtering**: Popover-based filters for Provider, Type, and Region
    - Filter buttons show selected values as tags
    - Remove individual filters via X icon on tags
    - "Remove filters" button in popover footer (only visible when filters are active)
    - Region filter dynamically populated from unique values in resources
  - **Sorting**: Clickable column headers with sort indicators (arrows)
    - Sortable columns: Name, Provider, Monthly Cost
    - Visual indicators show current sort column and direction
    - Clicking same column toggles sort order
  - **Selection**: Checkboxes for individual and bulk selection
    - "Select all" checkbox in table header
    - Individual checkboxes per resource row
  - **Tag Coverage Badge**: Clickable badge showing "X/Y required tags"
    - Opens popover/sheet to view in a list and a button to
    - Clicking the edit button opens the sheet component edit
  - **Bulk Edit**: Button appears when resources are selected
    - Opens sheet component for bulk tag operations
    - Shows preview of changes before applying
  - **Single Resource Edit**: Click tag coverage badge to edit individual resource tags
    - Opens sheet component with tag editor
  - **Navigation**: Clicking resource row navigates to detail page
  - **Empty State**: Shows when no resources match filters
    - Includes "Clear filters" action when filters are active

#### 2. Resource Detail Feature (`features/resource`)

**Resource Detail View** (`resource-detail.tsx`)

- Displays complete information for a single resource
- Features:
  - **Back Navigation**: Button to return to resource list
  - **Resource Properties Card**: Displays all resource metadata
    - Properties: Name, ID, Provider, Type, Region, Monthly Cost
    - Displayed in definition list format
  - **Tags Card**: Displays all tags with edit capability
    - Separated into "Required Tags" and "Optional Tags" sections
    - Each tag shown as key-value pair
    - Edit button opens tag editor - Sheet for tag editing
    - Empty state when no tags are present
  - **Tag Editor**:
    - Add new tags (with schema validation)
    - Edit existing tag values
    - Remove optional tags, required tags are not removeal
    - Group required vs optional tags via heading
    - Uses appropriate input types (select for enums, text for free-form)

#### 3. Dashboard (`features/dashboard`)

- Displays 3 dashboard cards in columnsL
  ├─────────────────────────────────────────────────────────┤
  │ Overview │
  │ Overall Compliance: 12/20 resources (60%) │
  │ █████████████░░░░░░░░░░ │
  │ │
  │ Cost Coverage: $4,523.80 / $6,156.10 (73.5%) │
  │ █████████████████░░░░░░ │
  └────────────────────────────────────────────────────────
  ├─────────────────────────────────────────────────────────┤
  │ REQUIRED TAG COVERAGE │
  │ │
  │ Environment ████████████████████░ 19/20 (95%) │
  │ Owner ██████████████████░░░ 17/20 (85%) │
  │ BusinessUnit ████████████░░░░░░░░░ 12/20 (60%) │
  │ │
  └────────────────────────────────────────────────────────
  ├─────────────────────────────────────────────────────────┤
  │ NON-COMPLIANT RESOURCES (by cost) │
  │ │
  │ 🔴 db-prod-mongo-001 $756.40 Non compliant x │
  │ 🔴 cdn-prod-001 $678.90 Non compliant x │
  │ 🔴 storage-prod-logs-001 $534.60 Compliant ✓ │
  │ │
  │ [View All Non-Compliant Resources] │
  └────────────────────────────────────────────────────────
