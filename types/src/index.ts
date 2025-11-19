// Enums
export enum Provider {
  Azure = 'Azure',
  AWS = 'AWS',
  GCP = 'GCP',
}

export enum ResourceType {
  VirtualMachine = 'Virtual Machine',
  SQLDatabase = 'SQL Database',
  StorageAccount = 'Storage Account',
  CDN = 'CDN',
  PostgreSQLDatabase = 'PostgreSQL Database',
  RedisCache = 'Redis Cache',
  MongoDBDatabase = 'MongoDB Database',
  MySQLDatabase = 'MySQL Database',
}

export enum Environment {
  Production = 'Production',
  Staging = 'Staging',
  Development = 'Development',
  Testing = 'Testing',
}

export enum BusinessUnit {
  Engineering = 'Engineering',
  Sales = 'Sales',
  Marketing = 'Marketing',
  Finance = 'Finance',
  Operations = 'Operations',
}

// Tag Types
export type EnvironmentValue = 'Production' | 'Staging' | 'Development' | 'Testing';
export type BusinessUnitValue = 'Engineering' | 'Sales' | 'Marketing' | 'Finance' | 'Operations';

export type Tags = Partial<{
  Environment: EnvironmentValue;
  Owner: string;
  BusinessUnit: BusinessUnitValue;
  CostCenter: string;
  Project: string;
  Customer: string;
}>;

export type TagKey = keyof Tags;

// Core Models
export interface Resource {
  id: string;
  name: string;
  type: ResourceType | string; // Allow string for flexibility
  provider: Provider;
  region: string;
  monthlyCost: number;
  tags: Tags;
}

export interface ResourceWithCoverage extends Resource {
  tagCoverage: number; // Percentage 0-100
}

// API Response Models
export interface ResourceListResponse {
  resources: ResourceWithCoverage[];
  total: number;
}

export interface ResourceDetailResponse {
  resource: ResourceWithCoverage;
}

export interface UpdateResourceTagsResponse {
  resource: Resource;
}

export interface BulkTagRequest {
  resourceIds: string[];
  tagsToAdd: Tags;
  tagsToRemove?: TagKey[];
  preview?: boolean;
}

export interface BulkTagPreview {
  items: BulkTagPreviewItem[];
  summary: {
    totalResources: number;
    resourcesToUpdate: number;
    tagsToAdd: number;
    tagsToRemove: number;
  };
}

export interface BulkTagPreviewItem {
  resourceId: string;
  resourceName: string;
  newTags: Tags;
  existingTags: Tags;
}

export interface BulkTagResponse {
  success: boolean;
  updated: number;
  errors?: BulkOperationError[];
}

export interface BulkOperationError {
  resourceId: string;
  error: string;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
