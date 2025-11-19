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
 * Single tag add/edit request for a resource
 */
interface AddEditTagRequest {
  [key: string]: string; // Single key-value tag object (e.g., { "Owner": "finance-team" })
}

/**
 * Single tag remove request for a resource
 */
interface RemoveTagRequest {
  key: TagKey; // Tag key to remove
}

/**
 * Bulk tag add/edit operation request
 */
interface BulkAddEditTagRequest {
  ids: string[]; // Array of resource IDs to update
  tag: { [key: string]: string }; // Single key-value tag object (e.g., { "Owner": "cloud-team" })
  preview?: boolean; // If true, return preview without applying changes
}

/**
 * Bulk tag remove operation request
 */
interface BulkRemoveTagRequest {
  ids: string[]; // Array of resource IDs to update
  key: TagKey; // Tag key to remove from all resources
  preview?: boolean; // If true, return preview without applying changes
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
 * Single resource tag add/edit request
 * Request body is a single key-value tag object (e.g., { "Owner": "finance-team" })
 */
type AddEditTagRequest = { [key: string]: string };

/**
 * Single resource tag remove request
 * Request body contains the tag key to remove (e.g., { "key": "Owner" })
 */
interface RemoveTagRequest {
  key: TagKey;
}

/**
 * Single resource tag operation response
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
A resource is considered compliant if it has all 3 required tags AND at least 2 optional tags present and non-empty:

- `Environment` (required)
- `Owner` (required)
- `BusinessUnit` (required)
- At least 2 of: `CostCenter`, `Project`, `Customer` (optional)

**Coverage Metrics:**

1. **Overall Compliance**: Percentage of resources that have all 3 required tags AND at least 2 optional tags

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

### API Endpoints

All API endpoints are prefixed with `/api`. The base URL is `http://localhost:3001` for local development.

#### Base URL

```
http://localhost:3001/api
```

#### Error Response Format

All endpoints return errors in the following format:

```typescript
interface ErrorResponse {
  error: {
    code: string; // Error code (e.g., 'NOT_FOUND', 'VALIDATION_ERROR', 'INTERNAL_ERROR')
    message: string; // Human-readable error message
    details?: unknown; // Optional additional error details
  };
}
```

**Common HTTP Status Codes:**

- `200 OK` - Successful request
- `400 Bad Request` - Invalid request parameters or body
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

#### Health Check

**GET** `/api/health`

Check if the API server is running.

**Response:** `200 OK`

```json
{
  "status": "ok"
}
```

---

#### Coverage Endpoints

##### Get Coverage Metrics

**GET** `/api/coverage`

Get tag coverage metrics for all resources. Used by the dashboard to display compliance statistics.

**Response:** `200 OK`

**Response Body:** `TagCoverage`

```json
{
  "overallCompliance": 60.0,
  "compliantResources": 12,
  "totalResources": 20,
  "perTagCoverage": {
    "Environment": 95.0,
    "Owner": 85.0,
    "BusinessUnit": 60.0,
    "CostCenter": 5.0,
    "Project": 10.0,
    "Customer": 0.0
  },
  "costWeightedCompliance": 73.5,
  "compliantCost": 4523.8,
  "totalCost": 6156.1,
  "breakdownByProvider": {
    "Azure": {
      "compliant": 5,
      "total": 9,
      "percentage": 55.56
    },
    "AWS": {
      "compliant": 4,
      "total": 6,
      "percentage": 66.67
    },
    "GCP": {
      "compliant": 3,
      "total": 5,
      "percentage": 60.0
    }
  },
  "breakdownByType": {
    "Virtual Machine": {
      "compliant": 6,
      "total": 8,
      "percentage": 75.0
    },
    "SQL Database": {
      "compliant": 1,
      "total": 1,
      "percentage": 100.0
    }
  },
  "breakdownByEnvironment": {
    "Production": {
      "compliant": 8,
      "total": 12,
      "percentage": 66.67
    },
    "Staging": {
      "compliant": 3,
      "total": 4,
      "percentage": 75.0
    },
    "Development": {
      "compliant": 1,
      "total": 3,
      "percentage": 33.33
    },
    "Testing": {
      "compliant": 0,
      "total": 1,
      "percentage": 0.0
    },
    "No Environment": {
      "compliant": 0,
      "total": 1,
      "percentage": 0.0
    }
  }
}
```

**Error Responses:**

- `500 Internal Server Error` - Failed to calculate coverage

---

#### Resource Endpoints

##### List Resources

**GET** `/api/resources`

Get a list of all resources with optional filtering and sorting. Returns resources with tag coverage information.

**Query Parameters:**

| Parameter   | Type   | Description                                                             | Example                 |
| ----------- | ------ | ----------------------------------------------------------------------- | ----------------------- |
| `provider`  | string | Filter by provider (Azure, AWS, GCP)                                    | `?provider=Azure`       |
| `type`      | string | Filter by resource type                                                 | `?type=Virtual Machine` |
| `region`    | string | Filter by region                                                        | `?region=eastus`        |
| `sortBy`    | string | Sort field: `name`, `type`, `provider`, `region`, `monthlyCost`, `tags` | `?sortBy=cost`          |
| `sortOrder` | string | Sort direction: `asc`, `desc`                                           | `?sortOrder=desc`       |

**Example Request:**

```
GET /api/resources?provider=Azure&sortBy=cost&sortOrder=desc
```

**Response:** `200 OK`

**Response Body:** `ResourceListResponse`

```json
{
  "resources": [
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
      },
      "tagCoverage": 100.0
    }
  ],
  "total": 1
}
```

**Error Responses:**

- `500 Internal Server Error` - Failed to fetch resources

---

##### Get Resource by ID

**GET** `/api/resources/:id`

Get a single resource by its ID.

**Path Parameters:**

| Parameter | Type   | Description                           |
| --------- | ------ | ------------------------------------- |
| `id`      | string | Resource ID (e.g., "vm-prod-web-001") |

**Example Request:**

```
GET /api/resources/vm-prod-web-001
```

**Response:** `200 OK`

**Response Body:** `Resource`

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

**Error Responses:**

- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Failed to fetch resource

---

##### Add or Edit Single Tag on Resource

**POST** `/api/resources/:id/tag`

Add or edit a single tag on a resource. If the tag already exists, its value will be replaced. If it doesn't exist, it will be added.

**Path Parameters:**

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| `id`      | string | Resource ID |

**Request Body:** Single key-value tag object (not wrapped)

```json
{
  "Owner": "finance-team"
}
```

**Example Request:**

```
POST /api/resources/vm-prod-web-001/tag
Content-Type: application/json

{
  "Owner": "platform-team"
}
```

**Response:** `200 OK`

**Response Body:** `UpdateResourceTagsResponse`

```json
{
  "resource": {
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
}
```

**Error Responses:**

- `400 Bad Request` - Tag validation failed (invalid tag key or value)
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Failed to update tag

**Validation Error Example:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Tag validation failed",
    "details": [
      {
        "tagKey": "Environment",
        "message": "Invalid value for Environment tag",
        "code": "INVALID_VALUE"
      }
    ]
  }
}
```

---

##### Remove Single Tag from Resource

**DELETE** `/api/resources/:id/tag`

Remove a single tag from a resource.

**Path Parameters:**

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| `id`      | string | Resource ID |

**Request Body:** Object with tag key to remove

```json
{
  "key": "Owner"
}
```

**Example Request:**

```
DELETE /api/resources/vm-prod-web-001/tag
Content-Type: application/json

{
  "key": "Owner"
}
```

**Response:** `200 OK`

**Response Body:** `UpdateResourceTagsResponse`

```json
{
  "resource": {
    "id": "vm-prod-web-001",
    "name": "web-server-prod-east",
    "type": "Virtual Machine",
    "provider": "Azure",
    "region": "eastus",
    "monthlyCost": 245.5,
    "tags": {
      "Environment": "Production"
    }
  }
}
```

**Error Responses:**

- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Failed to remove tag

---

##### Bulk Add or Edit Single Tag

**POST** `/api/resources/bulk/tag`

Add or edit a single tag across multiple resources at once. Supports preview mode to see changes before applying.

**Request Body:**

```typescript
{
  ids: string[]; // Array of resource IDs to update
  tag: { [key: string]: string }; // Single key-value tag object (e.g., { "Owner": "cloud-team" })
  preview?: boolean; // If true, return preview without applying changes
}
```

**Example Request (Apply Tag):**

```
POST /api/resources/bulk/tag
Content-Type: application/json

{
  "ids": ["vm-prod-web-001", "db-prod-sql-001"],
  "tag": {
    "BusinessUnit": "Engineering"
  }
}
```

**Example Request (Preview Only):**

```
POST /api/resources/bulk/tag
Content-Type: application/json

{
  "ids": ["vm-prod-web-001", "db-prod-sql-001"],
  "tag": {
    "Owner": "platform-team"
  },
  "preview": true
}
```

**Response (Preview Mode):** `200 OK`

**Response Body:** `BulkTagPreview`

```json
{
  "items": [
    {
      "resourceId": "vm-prod-web-001",
      "resourceName": "web-server-prod-east",
      "existingTags": {
        "Environment": "Production",
        "Owner": "platform-team"
      },
      "newTags": {
        "Environment": "Production",
        "Owner": "platform-team",
        "BusinessUnit": "Engineering"
      }
    }
  ],
  "summary": {
    "totalResources": 2,
    "resourcesToUpdate": 2,
    "tagsToAdd": 1,
    "tagsToRemove": 0
  }
}
```

**Response (Apply Mode):** `200 OK`

**Response Body:** `BulkTagResponse`

```json
{
  "success": true,
  "updated": 2
}
```

**Partial Success Response:**

```json
{
  "success": false,
  "updated": 1,
  "errors": [
    {
      "resourceId": "invalid-resource-id",
      "error": "Resource not found"
    }
  ]
}
```

**Error Responses:**

- `400 Bad Request` - Invalid request (missing ids or tag, empty ids array, invalid tag key or value)
- `500 Internal Server Error` - Failed to apply bulk tag

---

##### Bulk Remove Single Tag

**DELETE** `/api/resources/bulk/tag`

Remove a single tag from multiple resources at once. Supports preview mode to see changes before applying.

**Request Body:**

```typescript
{
  ids: string[]; // Array of resource IDs to update
  key: TagKey; // Tag key to remove from all resources
  preview?: boolean; // If true, return preview without applying changes
}
```

**Example Request (Remove Tag):**

```
DELETE /api/resources/bulk/tag
Content-Type: application/json

{
  "ids": ["vm-prod-web-001", "db-prod-sql-001"],
  "key": "Owner"
}
```

**Example Request (Preview Only):**

```
DELETE /api/resources/bulk/tag
Content-Type: application/json

{
  "ids": ["vm-prod-web-001", "db-prod-sql-001"],
  "key": "Owner",
  "preview": true
}
```

**Response (Preview Mode):** `200 OK`

**Response Body:** `BulkTagPreview`

```json
{
  "items": [
    {
      "resourceId": "vm-prod-web-001",
      "resourceName": "web-server-prod-east",
      "existingTags": {
        "Environment": "Production",
        "Owner": "platform-team"
      },
      "newTags": {
        "Environment": "Production"
      }
    }
  ],
  "summary": {
    "totalResources": 2,
    "resourcesToUpdate": 2,
    "tagsToAdd": 0,
    "tagsToRemove": 1
  }
}
```

**Response (Apply Mode):** `200 OK`

**Response Body:** `BulkTagResponse`

```json
{
  "success": true,
  "updated": 2
}
```

**Error Responses:**

- `400 Bad Request` - Invalid request (missing ids or key, empty ids array)
- `500 Internal Server Error` - Failed to remove bulk tag

---

#### Tag Schema Endpoints

##### Get Tag Schema

**GET** `/api/tag-schema`

Get the tag schema definition, including required and optional tags with their allowed values.

**Response:** `200 OK`

**Response Body:** `TagSchemaDefinition`

```json
{
  "required": [
    {
      "key": "Environment",
      "required": true,
      "allowedValues": ["Production", "Staging", "Development", "Testing"]
    },
    {
      "key": "Owner",
      "required": true
    },
    {
      "key": "BusinessUnit",
      "required": true,
      "allowedValues": ["Engineering", "Sales", "Marketing", "Finance", "Operations"]
    }
  ],
  "optional": [
    {
      "key": "CostCenter",
      "required": false
    },
    {
      "key": "Project",
      "required": false
    },
    {
      "key": "Customer",
      "required": false
    }
  ]
}
```

**Error Responses:**

- `500 Internal Server Error` - Failed to fetch tag schema

---

### API Endpoint Summary

| Method   | Endpoint                  | Description                                  |
| -------- | ------------------------- | -------------------------------------------- |
| `GET`    | `/api/health`             | Health check                                 |
| `GET`    | `/api/coverage`           | Get tag coverage metrics                     |
| `GET`    | `/api/resources`          | List resources (with filtering/sorting)      |
| `GET`    | `/api/resources/:id`      | Get resource by ID                           |
| `POST`   | `/api/resources/:id/tag`  | Add or edit a single tag on a resource       |
| `DELETE` | `/api/resources/:id/tag`  | Remove a single tag from a resource          |
| `POST`   | `/api/resources/bulk/tag` | Bulk add or edit a single tag (with preview) |
| `DELETE` | `/api/resources/bulk/tag` | Bulk remove a single tag (with preview)      |
| `GET`    | `/api/tag-schema`         | Get tag schema definition                    |

### Application

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
- Table columns: Table columns list: Checkbox, Name, Type, Provider, Region, Monthly Cost, Tag Coverage, Environment, Owner, BusinessUnit, CostCenter, Project, Customer as a in the table
- Each tag (Environment, Owner, BusinessUnit, CostCenter, Project, Customer) is **separate column** in the table
  - Updated table columns list: Checkbox, Name, Type, Provider, Region, Monthly Cost, Environment, Owner, BusinessUnit, CostCenter, Project, Customer,
- Tag columns display the tag value for each resource (empty if not set)
- No pagintation on the list
- Features:
  - **Filtering**: Popover-based filters for Provider, Type, and Region
    - Each filter is button with popover with list of filter values
    - Each filter is button with popover with list of filter optionsmenu
    - Filter buttons show selected value as tag x
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
  - **Bulk Edit**:
  - Shows when **2 or more** resources are selected (not just "when resources are selected")
  - Three action buttons: "Add Tag", "Edit Tag", "Remove Tag"
  - Each button opens dropdown with appropriate tags (split by required/optional):
    - add tag lists the tags that have not been added to any of selected resource
    - edit tag lists the tags that have been added to any of the selected resources
    - remove tag lists the tags that have been added to any of the selected resources
  - Opens a sheet to either edit, add or remove a tag based on the action that was clicked with:
    - when editing we display the name of the tag and an input for the value
    - when adding we display the name of the tag and an input for the value
    - when removing a message to say that the tag will be removed
    - Summary messages based on action:
      - Remove: "5 resources will be updated, 2 did not have this tag"
      - Add (no tag): "5 resources will be updated, 2 already have this tag"
      - Add (has tag): "5 resources will be updated, 2 already have this tag and value"
    - Preview of changes for each resource (fetched via preview mode)
      - List showing each resource's new tags after the operation
    - Apply/Cancel actions
      - Apply: calls `POST /api/resources/bulk/tag` (for add/edit) or `DELETE /api/resources/bulk/tag` (for remove)
      - Cancel: closes the sheet without making changes
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
  - **Tags Card**: Displays all tags
    - Separated into "Required Tags" and "Optional Tags" sections
    - Required tags section list shows all required tags that a resource can have
      - if the tag is on the resource we show the tag, value, and edit button
      - if the tag is not on resource we show the tag, not set error message, and add value
    - Optional tags section lists tags with that are in the resource.tags
      - tag is on the resource we show the tag, value, edit button, remove button
    - Under the optional tags we have a add tag button that opens a popover showing optional tags that have not been added
    -
- **Tag Editing**: In the tags card
  - on clicking edit (for both required and optional tags)
    - the value becomes an input field and a save button is displayed (remove button is hidden)
    - on save: calls `POST /api/resources/:id/tag` with the updated tag key-value pair
  - on clicking x (optional tags only)
    - the tag is removed by calling `DELETE /api/resources/:id/tag` with the tag key
  - on clicking one of the optional tags from the "add tag" popover
    - the new tag is displayed in an edit state (input field with save button)
    - on save: calls `POST /api/resources/:id/tag` with the new tag key-value pair

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

## Plan

1. Get proejct to a hello world state
   - install and setup project structure and required packages
   - frontend allows user to view pages dashbaord and resoures
   - backend has a hello world example

2. Build list
   1. view resources
      - implement backend
      - implement frontend
   2. view resource
      - implement backend
      - implement frontend
   3. filter resources
      - implement backend
      - implement frontend
   4. sort resources
      - implement backend
      - implement frontend
   5. edit tags on detail screen
      1. implement backend
      2. edit tags on the detail
         - implement frontend
   6. bulk tags on the list screen
      1. implement backend
      2. implemnt frontend

3. Build dashboard
   1. implement backend
   2. build each dashboard item

---

## Step 2: Build List - Setup Specification

This specification defines the setup and basic building blocks required to implement the resource list feature (Step 2 from the Plan). This includes shared types, seed data, API structure, and frontend foundation needed before implementing the list functionality.

### Prerequisites

Before starting Step 2, ensure Step 1 is complete:

- ✅ Monorepo structure with workspaces (frontend, backend, types)
- ✅ TypeScript configuration (tsconfig.base.json and workspace-specific configs)
- ✅ Frontend routing setup (TanStack Router with basic routes)
- ✅ Backend Express server running on port 3001
- ✅ Health check endpoint (`GET /api/health`) working
- ✅ Development servers can start (`npm run dev`)

### 1. Shared Types Setup

**Location:** `types/src/index.ts`

**Purpose:** Define all shared TypeScript types and enums that both frontend and backend will use. This ensures type safety across the stack and prevents duplication.

**Required Types:**

1. **Enums** (from SPEC.md lines 297-328):
   - `Provider` (Azure, AWS, GCP)
   - `ResourceType` (Virtual Machine, SQL Database, Storage Account, etc.)
   - `Environment` (Production, Staging, Development, Testing)
   - `BusinessUnit` (Engineering, Sales, Marketing, Finance, Operations)

2. **Tag Types** (from SPEC.md lines 333-360):
   - `EnvironmentValue` type
   - `BusinessUnitValue` type
   - `Tags` type (unified tags object)
   - `TagKey` type

3. **Core Models** (from SPEC.md lines 362-408):
   - `Resource` interface (id, name, type, provider, region, monthlyCost, tags)

4. **Coverage Models** (from SPEC.md lines 540-603):
   - `TagCoverage` interface
   - `CoverageStats` interface
   - `ResourceWithCoverage` interface (extends Resource with tagCoverage)

5. **API Models** (from SPEC.md lines 410-523):
   - `ResourceListResponse`
   - `ResourceDetailResponse`
   - `AddEditTagRequest`
   - `RemoveTagRequest`
   - `UpdateResourceTagsResponse`
   - `BulkAddEditTagRequest`
   - `BulkRemoveTagRequest`
   - `BulkTagPreview`
   - `BulkTagResponse`
   - `ResourceFilterOptions`
   - `ResourceSortOptions`
   - `ResourceListQueryParams`
   - `ErrorResponse`

6. **Tag Schema Models** (from SPEC.md lines 525-538):
   - `TagSchema` interface
   - `TagSchemaDefinition` interface

**Export Structure:**

```typescript
// types/src/index.ts should export:
export { Provider, ResourceType, Environment, BusinessUnit };
export type { Tags, TagKey, EnvironmentValue, BusinessUnitValue };
export type { Resource, ResourceWithCoverage };
export type { TagCoverage, CoverageStats };
export type { ResourceListResponse, ResourceDetailResponse, ... };
export type { TagSchema, TagSchemaDefinition };
```

**Implementation Notes:**

- All types must be exported from `types/src/index.ts`
- Both frontend and backend import from `@spotto/types` package
- Types should match exactly with the data models defined in SPEC.md
- Use `readonly` arrays for enum-type tag allowed values

### 2. Seed Data Setup

**Location:** `backend/src/data/seed-data.ts`

**Purpose:** Initialize the backend with 20 mock resources as defined in SPEC.md (lines 29-282). This data will be stored in-memory and used for all API operations.

**Required Structure:**

```typescript
// backend/src/data/seed-data.ts
import type { Resource } from '@spotto/types';

export const seedResources: Resource[] = [
  // All 20 resources from SPEC.md seed data section
];
```

**Data Requirements:**

- Must include all 20 resources exactly as specified in SPEC.md
- Resources should have varied tags (some compliant, some non-compliant)
- Cost values should total approximately $6,156.10/month
- Mix of providers (Azure, AWS, GCP)
- Mix of resource types
- Mix of environments
- At least one resource with empty tags (`vm-prod-batch-001`)

**Storage Strategy:**

- Store resources in an in-memory array: `let resources: Resource[] = [...seedResources]`
- Provide functions to access and mutate the resources array
- Location: `backend/src/data/resources.ts` or similar

**Initialization:**

- Seed data should be loaded when the backend server starts
- Resources array should be mutable (for tag updates, bulk operations)

### 3. Backend API Structure

**Base URL:** `http://localhost:3001/api`

**Required Endpoints:**

1. **GET /api/resources** - List resources with filtering/sorting
   - Location: `backend/src/routes/resources.ts`
   - Query params: provider, type, region, sortBy, sortOrder
   - Returns: `ResourceListResponse`

2. **GET /api/resources/:id** - Get single resource
   - Location: `backend/src/routes/resources.ts`
   - Returns: `ResourceDetailResponse`

3. **POST /api/resources/:id/tag** - Add or edit a single tag on a resource
   - Location: `backend/src/routes/resources.ts`
   - Request body: a single key-value tag object (e.g., `{ "Owner": "finance-team" }`)
   - Action: Adds the tag if not present, or replaces the value if already set
   - Returns: `UpdateResourceTagsResponse`

4. **DELETE /api/resources/:id/tag** - Remove a single tag from a resource
   - Location: `backend/src/routes/resources.ts`
   - Request body: a single key identifying the tag to remove (e.g., `{ "key": "Owner" }`)
   - Action: Removes the tag from the resource if present
   - Returns: `UpdateResourceTagsResponse`

5. **POST /api/resources/bulk/tag** - Add or edit a single tag across multiple resources
   - Location: `backend/src/routes/resources.ts`
   - Request body: an object with `ids: string[]` (list of resource IDs) and a single key-value tag (e.g., `{ "ids": ["vm-prod-batch-001", "db-prod-redis-001"], "tag": { "Owner": "cloud-team" } }`)
   - Action: For each resource id provided, adds the tag if not present, or replaces its value if already set. Supports preview mode (`preview: true`).
   - Returns: `BulkTagPreview` (if preview) or `BulkTagResponse`

6. **DELETE /api/resources/bulk/tag** - Remove a single tag across multiple resources
   - Location: `backend/src/routes/resources.ts`
   - Request body: an object with `ids: string[]` (list of resource IDs) and `key: string` (tag key to remove), e.g., `{ "ids": ["vm-prod-batch-001", "db-prod-redis-001"], "key": "Owner" }`
   - Action: Removes the specified tag from each listed resource if present. Supports preview mode (`preview: true`).
   - Returns: `BulkTagPreview` (if preview) or `BulkTagResponse`

7. **GET /api/tag-schema** - Get tag schema definition
   - Location: `backend/src/routes/tag-schema.ts`
   - Returns: `TagSchemaResponse`

8. **GET /api/coverage** - Get coverage metrics (for dashboard, but needed for list view tag coverage)
   - Location: `backend/src/routes/coverage.ts`
   - Returns: `CoverageResponse`

**File Structure:**

```
backend/src/
├── index.ts                    # Express app setup
├── data/
│   ├── seed-data.ts           # Seed data array
│   └── resources.ts           # In-memory storage and access functions
├── routes/
│   ├── health.ts              # Existing health check
│   ├── resources.ts           # All resource endpoints
│   ├── tag-schema.ts          # Tag schema endpoint
│   └── coverage.ts            # Coverage metrics endpoint
├── services/
│   ├── resource-service.ts    # Business logic for resources
│   ├── tag-service.ts         # Tag validation and operations
│   └── coverage-service.ts    # Coverage calculation logic
└── middleware/
    └── error-logger.ts        # Existing error logging
```

**Service Layer Responsibilities:**

- **resource-service.ts**: Filtering, sorting, finding resources by ID
- **tag-service.ts**: Tag validation against schema, tag operations
- **coverage-service.ts**: Calculate tag coverage metrics, compliance checks

**Tag Schema Definition:**

- Location: `backend/src/data/tag-schema.ts`
- Required tags: Environment, Owner, BusinessUnit
- Optional tags: CostCenter, Project, Customer
- Must match SPEC.md tag schema definition (lines 1098-1129)

### 4. Frontend Structure

**Feature-Based Organization:**

```
frontend/src/
├── features/
│   └── resources/
│       ├── components/
│       │   ├── resource-list.tsx          # Main list view component
│       │   ├── resource-table.tsx         # Table component with columns
│       │   ├── resource-filters.tsx       # Filter popover component
│       │   ├── resource-row.tsx           # Individual table row
│       │   ├── tag-coverage-badge.tsx     # Coverage badge with popover
│       │   ├── tag-coverage-popover.tsx   # Popover showing tag details
│       │   ├── bulk-edit-sheet.tsx        # Sheet for bulk tag operations
│       │   └── tag-editor-sheet.tsx       # Sheet for single resource tag editing
│       ├── hooks/
│       │   ├── use-resource-filters.ts    # Filter state management
│       │   └── use-resource-sort.ts       # Sort state management
│       └── types.ts                       # Feature-specific types (if any)
├── services/
│   └── resources/
│       ├── api.ts                         # API fetch functions
│       ├── queries.ts                    # TanStack Query queries
│       └── mutations.ts                   # TanStack Query mutations
├── routes/
│   ├── resources.index.tsx               # List view route (existing)
│   └── resources.$id.tsx                # Detail view route (existing)
└── components/
    └── layout/                           # Existing layout components
```

**Service Layer Structure:**

Each API endpoint should have corresponding service functions:

- **api.ts**: Raw fetch functions (GET, PATCH, POST)
- **queries.ts**: TanStack Query hooks for data fetching
- **mutations.ts**: TanStack Query hooks for data mutations

**Example Structure:**

```typescript
// services/resources/api.ts
export async function getResources(params?: ResourceListQueryParams): Promise<ResourceListResponse>;
export async function getResource(id: string): Promise<ResourceDetailResponse>;
export async function addEditResourceTag(
  id: string,
  tag: { [key: string]: string }
): Promise<UpdateResourceTagsResponse>;
export async function removeResourceTag(
  id: string,
  key: TagKey
): Promise<UpdateResourceTagsResponse>;
export async function bulkAddEditTag(
  request: BulkAddEditTagRequest
): Promise<BulkTagPreview | BulkTagResponse>;
export async function bulkRemoveTag(
  request: BulkRemoveTagRequest
): Promise<BulkTagPreview | BulkTagResponse>;

// services/resources/queries.ts
export function useResources(params?: ResourceListQueryParams);
export function useResource(id: string);

// services/resources/mutations.ts
export function useAddEditResourceTag();
export function useRemoveResourceTag();
export function useBulkAddEditTag();
export function useBulkRemoveTag();
```

### 5. Tag Coverage Calculation

**Location:** `backend/src/services/coverage-service.ts`

**Purpose:** Calculate tag coverage metrics for resources. This is needed for:

- Displaying coverage badges in the list view
- Determining compliance status
- Calculating overall metrics

**Required Functions:**

1. **calculateResourceCoverage(resource: Resource): number**
   - Returns percentage of required tags present (0-100)
   - Required tags: Environment, Owner, BusinessUnit
   - Example: 2/3 tags = 66.67%

2. **isCompliant(resource: Resource): boolean**
   - Returns true if all 3 required tags AND at least 2 optional tags are present and non-empty

3. **addCoverageToResource(resource: Resource): ResourceWithCoverage**
   - Adds `tagCoverage` property to resource

**Compliance Definition:**

A resource is compliant if it has all 3 required tags AND at least 2 optional tags present and non-empty:

- `Environment` (required, non-empty)
- `Owner` (required, non-empty)
- `BusinessUnit` (required, non-empty)
- At least 2 of: `CostCenter`, `Project`, `Customer` (optional, non-empty)

### 6. Tag Validation

**Location:** `backend/src/services/tag-service.ts`

**Purpose:** Validate tags against the tag schema before saving.

**Required Functions:**

1. **validateTags(tags: Tags): ValidationError[]**
   - Validates tag keys against schema
   - Validates enum values (Environment, BusinessUnit) against allowed values
   - Returns array of validation errors (empty if valid)

2. **validateTagValue(key: TagKey, value: string): boolean**
   - Validates a single tag value against schema
   - Checks enum constraints for Environment and BusinessUnit

**Validation Rules:**

- Required tags must be present and non-empty
- Enum-type tags (Environment, BusinessUnit) must match allowed values
- Unknown tag keys are allowed (optional tags)
- Empty string values are invalid

### 7. Frontend Component Requirements

**Resource List View (`resource-list.tsx`):**

- Uses TanStack Query to fetch resources
- Manages filter and sort state
- Handles selection state (checkboxes)
- Renders `resource-table.tsx` component
- Shows empty state when no resources match filters
- Displays loading and error states
- No pagination for now

**Resource Table (`resource-table.tsx`):**

- Columns: Name, Type, Provider, Region, Monthly Cost, and each tag as a separate column (Environment, Owner, BusinessUnit, CostCenter, Project, Customer)
- Sortable columns: Name, Provider, Monthly Cost
- Select all checkbox in header
- Individual checkboxes per row
- Clickable rows navigate to detail page

**Tag Coverage Badge (`tag-coverage-badge.tsx`):**

- Displays "X/Y required tags" format
- Color coding: green (compliant), red (non-compliant)
- Clickable to open popover
- Opens `tag-coverage-popover.tsx` on click

### 8. API Client Configuration

**Location:** `frontend/src/lib/api-client.ts`

**Purpose:** Centralized API client configuration for all API calls.

**Required Setup:**

- Base URL: `http://localhost:3001/api`
- Content-Type: `application/json`
- Error handling for network errors
- Response parsing

**Example:**

```typescript
const API_BASE_URL = 'http://localhost:3001/api';

export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API request failed');
  }

  return response.json();
}
```

**Ready for Implementation:**

Once setup is complete, you can proceed with implementing:

- Resource list view with table
- Filtering and sorting UI
- Tag coverage badges
- Tag editing functionality
- Bulk tag operations

---

## Next Steps

After completing this setup specification:

1. Review this specification
2. Run `/speckit.clarify` if any questions or ambiguities
3. Run `/speckit.plan` to create detailed implementation plan
4. Run `/speckit.tasks` to break down into specific tasks
5. Commit changes to SPEC.md
6. Run `/speckit.implement`
