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
