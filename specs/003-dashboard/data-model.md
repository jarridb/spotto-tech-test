# Data Model: Dashboard Implementation

**Feature**: Dashboard Implementation  
**Date**: 2025-01-27  
**Phase**: Phase 1 - Design & Contracts

## Overview

This document defines the data models used in the dashboard feature. Most models are already defined in the shared `@spotto/types` package from Step 2 Setup. This document focuses on the updated TagCoverage interface and the new NonCompliantResource entity.

## Core Entities (from @spotto/types - Updated)

### TagCoverage (Updated)

```typescript
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

  // NEW: Non-compliant resources list
  nonCompliantResources: NonCompliantResource[]; // Top 5-10 non-compliant resources by cost
}
```

### NonCompliantResource (New)

```typescript
/**
 * Resource summary for dashboard display
 * Contains minimal information needed for non-compliant resources card
 */
interface NonCompliantResource {
  id: string;                    // Resource ID (e.g., "vm-prod-web-001")
  name: string;                  // Resource name (e.g., "web-server-prod-east")
  monthlyCost: number;           // Monthly cost in USD (e.g., 756.4)
  tagCoverage: number;           // Percentage of required tags present (0-100)
}
```

**Validation Rules**:
- Array is sorted by monthlyCost (highest first)
- Limited to top 5-10 resources by backend
- Empty array means all resources are compliant
- Each resource must have tagCoverage < 100 (non-compliant)

### CoverageStats (from @spotto/types)

```typescript
interface CoverageStats {
  compliant: number; // count of compliant resources in this group
  total: number; // total count of resources in this group
  percentage: number; // compliance percentage for this group (0-100)
}
```

## Frontend State Models

### DashboardState

Represents the current state of the dashboard.

```typescript
interface DashboardState {
  coverage: TagCoverage | null;
  isLoading: boolean;
  error: Error | null;
}
```

**State Transitions**:
- Initial load → isLoading: true, coverage: null
- Data fetched → isLoading: false, coverage: TagCoverage
- Error occurred → isLoading: false, error: Error
- Retry → isLoading: true, error: null

## API Request/Response Models

### CoverageResponse (Updated)

```typescript
interface CoverageResponse {
  coverage: TagCoverage; // Now includes nonCompliantResources array
}
```

### ErrorResponse (from @spotto/types)

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
```

## UI Component Props

### DashboardProps

```typescript
interface DashboardProps {
  // No props needed - component fetches its own data
}
```

### OverviewCardProps

```typescript
interface OverviewCardProps {
  overallCompliance: number;
  compliantResources: number;
  totalResources: number;
  costWeightedCompliance: number;
  compliantCost: number;
  totalCost: number;
  isLoading?: boolean;
}
```

### TagCoverageCardProps

```typescript
interface TagCoverageCardProps {
  perTagCoverage: Record<string, number>;
  isLoading?: boolean;
}
```

### NonCompliantCardProps

```typescript
interface NonCompliantCardProps {
  nonCompliantResources: NonCompliantResource[];
  isLoading?: boolean;
  onViewAll: () => void; // Navigate to filtered resources list
  onResourceClick?: (resourceId: string) => void; // Navigate to resource detail
}
```

### ProgressBarProps

```typescript
interface ProgressBarProps {
  value: number; // Percentage (0-100)
  label?: string; // Optional label to display
  showPercentage?: boolean; // Whether to show percentage text
  color?: 'default' | 'success' | 'warning' | 'danger'; // Color variant
}
```

## Validation Rules

### Coverage Data Validation

- **Overall Compliance**: Must be between 0-100
- **Cost Coverage**: Must be between 0-100
- **Per-Tag Coverage**: Each value must be between 0-100
- **Non-Compliant Resources**: Array length should be 0-10, sorted by cost descending
- **Resource Costs**: All cost values must be non-negative numbers

### Progress Bar Validation

- **Value**: Must be between 0-100
- **Color Mapping**: 
  - Green (success): 80-100%
  - Yellow (warning): 50-79%
  - Red (danger): 0-49%

## State Management Strategy

### Server State (TanStack Query)

- Coverage metrics (fetched via useCoverage hook)
- Automatically refetches when resources are updated (query invalidation)

### UI State (React State)

- Loading states (managed by TanStack Query)
- Error states (managed by TanStack Query)
- No local UI state needed beyond component-level loading/error

### Data Flow

1. **Initial Load**: Component mounts → TanStack Query fetches coverage → Display metrics in cards
2. **Resource Update**: Resource tags updated → Coverage query invalidated → TanStack Query refetches → Cards update
3. **Navigation**: User clicks "View All" → Navigate to resources list with compliant filter → Show filtered list
4. **Manual Refresh**: User clicks refresh → TanStack Query refetches → Cards update

## Display Formatting

### Currency Formatting

```typescript
// Format: $X.XX
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
```

### Percentage Formatting

```typescript
// Format: Z% (rounded to 1 decimal place)
const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};
```

### Count Formatting

```typescript
// Format: X/Y resources (Z%)
const formatCompliance = (compliant: number, total: number): string => {
  const percentage = (compliant / total) * 100;
  return `${compliant}/${total} resources (${percentage.toFixed(1)}%)`;
};
```

---

**Data Model Status**: Complete  
**Ready for**: Implementation

