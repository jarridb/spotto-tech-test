import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import resourcesRouter from './resources.js';
import * as resourcesData from '../data/resources.js';
import * as resourceService from '../services/resource-service.js';
import * as coverageService from '../services/coverage-service.js';
import { Provider } from '@spotto/types';
import type { Resource, ResourceWithCoverage } from '@spotto/types';

// Mock the data layer
vi.mock('../data/resources.js', () => ({
  getAllResources: vi.fn(),
  getResourceById: vi.fn(),
  updateResourceTags: vi.fn(),
  removeResourceTag: vi.fn(),
  bulkUpdateResourceTags: vi.fn(),
}));

// Mock the service layer
vi.mock('../services/resource-service.js', () => ({
  getFilteredAndSortedResources: vi.fn(),
}));

// Mock coverage service
vi.mock('../services/coverage-service.js', () => ({
  addTagCoverageToResources: vi.fn(),
}));

function calculateMockCoverage(resource: Resource): number {
  const allTags = ['Environment', 'Owner', 'BusinessUnit', 'CostCenter', 'Project', 'Customer'];
  const presentTags = allTags.filter((tag) => {
    const value = resource.tags[tag as keyof typeof resource.tags];
    return value !== undefined && value !== null && value !== '';
  });
  // Return count of tags present (up to 5 for display)
  return Math.min(presentTags.length, 5);
}

// Create test app
function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/resources', resourcesRouter);
  return app;
}

describe('GET /api/resources', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return all resources with tag coverage', async () => {
    const mockResources: Resource[] = [
      {
        id: 'vm-prod-web-001',
        name: 'web-server-prod-east',
        type: 'Virtual Machine',
        provider: Provider.Azure,
        region: 'eastus',
        monthlyCost: 245.5,
        tags: {
          Environment: 'Production',
          Owner: 'platform-team',
        },
      },
      {
        id: 'db-prod-sql-001',
        name: 'sql-primary-prod',
        type: 'SQL Database',
        provider: Provider.Azure,
        region: 'eastus',
        monthlyCost: 892.3,
        tags: {
          Environment: 'Production',
          Owner: 'data-team',
          BusinessUnit: 'Engineering',
        },
      },
    ];

    const resourcesWithCoverage = mockResources.map((r) => ({
      ...r,
      tagCoverage: calculateMockCoverage(r),
    }));

    vi.mocked(resourceService.getFilteredAndSortedResources).mockReturnValue(mockResources);
    vi.mocked(coverageService.addTagCoverageToResources).mockReturnValue(resourcesWithCoverage);

    const app = createTestApp();
    const response = await request(app).get('/api/resources');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('resources');
    expect(response.body).toHaveProperty('total', 2);
    expect(response.body.resources).toHaveLength(2);
    expect(response.body.resources[0]).toHaveProperty('tagCoverage');
    expect(response.body.resources[0].tagCoverage).toBe(2); // 2 tags present
    expect(response.body.resources[1].tagCoverage).toBe(3); // 3 tags present
  });

  it('should filter by provider (single-select)', async () => {
    const filteredResources: Resource[] = [
      {
        id: 'vm-prod-web-001',
        name: 'web-server-prod-east',
        type: 'Virtual Machine',
        provider: Provider.Azure,
        region: 'eastus',
        monthlyCost: 245.5,
        tags: {},
      },
    ];

    const resourcesWithCoverage = filteredResources.map((r) => ({
      ...r,
      tagCoverage: calculateMockCoverage(r),
    }));

    vi.mocked(resourceService.getFilteredAndSortedResources).mockReturnValue(filteredResources);
    vi.mocked(coverageService.addTagCoverageToResources).mockReturnValue(resourcesWithCoverage);

    const app = createTestApp();
    const response = await request(app).get('/api/resources?provider=Azure');

    expect(response.status).toBe(200);
    expect(response.body.resources).toHaveLength(1);
    expect(response.body.resources[0].provider).toBe(Provider.Azure);
    expect(resourceService.getFilteredAndSortedResources).toHaveBeenCalledWith(
      expect.objectContaining({ provider: Provider.Azure })
    );
  });

  it('should filter by type (single-select)', async () => {
    const filteredResources: Resource[] = [
      {
        id: 'vm-prod-web-001',
        name: 'web-server-prod-east',
        type: 'Virtual Machine',
        provider: Provider.Azure,
        region: 'eastus',
        monthlyCost: 245.5,
        tags: {},
      },
    ];

    const resourcesWithCoverage = filteredResources.map((r) => ({
      ...r,
      tagCoverage: calculateMockCoverage(r),
    }));

    vi.mocked(resourceService.getFilteredAndSortedResources).mockReturnValue(filteredResources);
    vi.mocked(coverageService.addTagCoverageToResources).mockReturnValue(resourcesWithCoverage);

    const app = createTestApp();
    const response = await request(app).get('/api/resources?type=Virtual Machine');

    expect(response.status).toBe(200);
    expect(response.body.resources).toHaveLength(1);
    expect(response.body.resources[0].type).toBe('Virtual Machine');
    expect(resourceService.getFilteredAndSortedResources).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'Virtual Machine' })
    );
  });

  it('should filter by region (single-select)', async () => {
    const filteredResources: Resource[] = [
      {
        id: 'vm-prod-web-001',
        name: 'web-server-prod-east',
        type: 'Virtual Machine',
        provider: Provider.Azure,
        region: 'eastus',
        monthlyCost: 245.5,
        tags: {},
      },
    ];

    const resourcesWithCoverage = filteredResources.map((r) => ({
      ...r,
      tagCoverage: calculateMockCoverage(r),
    }));

    vi.mocked(resourceService.getFilteredAndSortedResources).mockReturnValue(filteredResources);
    vi.mocked(coverageService.addTagCoverageToResources).mockReturnValue(resourcesWithCoverage);

    const app = createTestApp();
    const response = await request(app).get('/api/resources?region=eastus');

    expect(response.status).toBe(200);
    expect(response.body.resources).toHaveLength(1);
    expect(response.body.resources[0].region).toBe('eastus');
    expect(resourceService.getFilteredAndSortedResources).toHaveBeenCalledWith(
      expect.objectContaining({ region: 'eastus' })
    );
  });

  it('should sort by monthlyCost ascending', async () => {
    const sortedResources: Resource[] = [
      {
        id: 'db-prod-sql-001',
        name: 'sql-primary-prod',
        type: 'SQL Database',
        provider: Provider.Azure,
        region: 'eastus',
        monthlyCost: 245.5,
        tags: {},
      },
      {
        id: 'vm-prod-web-001',
        name: 'web-server-prod-east',
        type: 'Virtual Machine',
        provider: Provider.Azure,
        region: 'eastus',
        monthlyCost: 892.3,
        tags: {},
      },
    ];

    const resourcesWithCoverage = sortedResources.map((r) => ({
      ...r,
      tagCoverage: calculateMockCoverage(r),
    }));

    vi.mocked(resourceService.getFilteredAndSortedResources).mockReturnValue(sortedResources);
    vi.mocked(coverageService.addTagCoverageToResources).mockReturnValue(resourcesWithCoverage);

    const app = createTestApp();
    const response = await request(app).get('/api/resources?sortBy=monthlyCost&sortOrder=asc');

    expect(response.status).toBe(200);
    expect(response.body.resources[0].monthlyCost).toBe(245.5);
    expect(response.body.resources[1].monthlyCost).toBe(892.3);
    expect(resourceService.getFilteredAndSortedResources).toHaveBeenCalledWith(
      expect.objectContaining({ sortBy: 'monthlyCost', sortOrder: 'asc' })
    );
  });

  it('should sort by monthlyCost descending', async () => {
    const sortedResources: Resource[] = [
      {
        id: 'vm-prod-web-001',
        name: 'web-server-prod-east',
        type: 'Virtual Machine',
        provider: Provider.Azure,
        region: 'eastus',
        monthlyCost: 892.3,
        tags: {},
      },
      {
        id: 'db-prod-sql-001',
        name: 'sql-primary-prod',
        type: 'SQL Database',
        provider: Provider.Azure,
        region: 'eastus',
        monthlyCost: 245.5,
        tags: {},
      },
    ];

    const resourcesWithCoverage = sortedResources.map((r) => ({
      ...r,
      tagCoverage: calculateMockCoverage(r),
    }));

    vi.mocked(resourceService.getFilteredAndSortedResources).mockReturnValue(sortedResources);
    vi.mocked(coverageService.addTagCoverageToResources).mockReturnValue(resourcesWithCoverage);

    const app = createTestApp();
    const response = await request(app).get('/api/resources?sortBy=monthlyCost&sortOrder=desc');

    expect(response.status).toBe(200);
    expect(response.body.resources[0].monthlyCost).toBe(892.3);
    expect(response.body.resources[1].monthlyCost).toBe(245.5);
    expect(resourceService.getFilteredAndSortedResources).toHaveBeenCalledWith(
      expect.objectContaining({ sortBy: 'monthlyCost', sortOrder: 'desc' })
    );
  });

  it('should sort by name ascending', async () => {
    const sortedResources: Resource[] = [
      {
        id: 'db-prod-sql-001',
        name: 'sql-primary-prod',
        type: 'SQL Database',
        provider: Provider.Azure,
        region: 'eastus',
        monthlyCost: 892.3,
        tags: {},
      },
      {
        id: 'vm-prod-web-001',
        name: 'web-server-prod-east',
        type: 'Virtual Machine',
        provider: Provider.Azure,
        region: 'eastus',
        monthlyCost: 245.5,
        tags: {},
      },
    ];

    const resourcesWithCoverage = sortedResources.map((r) => ({
      ...r,
      tagCoverage: calculateMockCoverage(r),
    }));

    vi.mocked(resourceService.getFilteredAndSortedResources).mockReturnValue(sortedResources);
    vi.mocked(coverageService.addTagCoverageToResources).mockReturnValue(resourcesWithCoverage);

    const app = createTestApp();
    const response = await request(app).get('/api/resources?sortBy=name&sortOrder=asc');

    expect(response.status).toBe(200);
    expect(response.body.resources[0].name).toBe('sql-primary-prod');
    expect(response.body.resources[1].name).toBe('web-server-prod-east');
    expect(resourceService.getFilteredAndSortedResources).toHaveBeenCalledWith(
      expect.objectContaining({ sortBy: 'name', sortOrder: 'asc' })
    );
  });

  it('should return 400 for invalid provider', async () => {
    const app = createTestApp();
    const response = await request(app).get('/api/resources?provider=InvalidProvider');

    expect(response.status).toBe(400);
    expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    expect(response.body.error).toHaveProperty('message', 'Invalid query parameters');
    expect(response.body.error.details).toBeDefined();
  });

  it('should return 400 for invalid sortBy', async () => {
    const app = createTestApp();
    const response = await request(app).get('/api/resources?sortBy=invalidField');

    expect(response.status).toBe(400);
    expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
  });
});

describe('GET /api/resources/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a single resource by ID', async () => {
    const mockResource: Resource = {
      id: 'vm-prod-web-001',
      name: 'web-server-prod-east',
      type: 'Virtual Machine',
      provider: Provider.Azure,
      region: 'eastus',
      monthlyCost: 245.5,
      tags: {
        Environment: 'Production',
        Owner: 'platform-team',
      },
    };

    const mockResourceWithCoverage: ResourceWithCoverage = {
      ...mockResource,
      tagCoverage: 2, // 2 tags present (Environment, Owner)
    };

    vi.mocked(resourcesData.getResourceById).mockReturnValue(mockResource);
    vi.mocked(coverageService.addTagCoverageToResources).mockReturnValue([mockResourceWithCoverage]);

    const app = createTestApp();
    const response = await request(app).get('/api/resources/vm-prod-web-001');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('resource');
    expect(response.body.resource.id).toBe('vm-prod-web-001');
    expect(response.body.resource.name).toBe('web-server-prod-east');
    expect(response.body.resource.tagCoverage).toBe(2); // 2 tags present
    expect(resourcesData.getResourceById).toHaveBeenCalledWith('vm-prod-web-001');
    expect(coverageService.addTagCoverageToResources).toHaveBeenCalledWith([mockResource]);
  });

  it('should return 404 for non-existent resource', async () => {
    vi.mocked(resourcesData.getResourceById).mockReturnValue(undefined);

    const app = createTestApp();
    const response = await request(app).get('/api/resources/nonexistent-id');

    expect(response.status).toBe(404);
    expect(response.body.error).toHaveProperty('code', 'NOT_FOUND');
    expect(response.body.error).toHaveProperty('message', 'Resource not found');
  });

  it('should handle empty resource ID path', async () => {
    // Note: Express routes /api/resources/ to the list endpoint, not the detail endpoint
    // This test verifies that the route ordering works correctly
    const mockResources: Resource[] = [];
    const resourcesWithCoverage: ResourceWithCoverage[] = [];

    vi.mocked(resourceService.getFilteredAndSortedResources).mockReturnValue(mockResources);
    vi.mocked(coverageService.addTagCoverageToResources).mockReturnValue(resourcesWithCoverage);

    const app = createTestApp();
    const response = await request(app).get('/api/resources/');

    // Empty path routes to list endpoint, not detail endpoint
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('resources');
  });
});

describe('PATCH /api/resources/:id/tags', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update resource tags successfully', async () => {
    const updatedResource: Resource = {
      id: 'vm-prod-web-001',
      name: 'web-server-prod-east',
      type: 'Virtual Machine',
      provider: Provider.Azure,
      region: 'eastus',
      monthlyCost: 245.5,
      tags: {
        Environment: 'Production',
        Owner: 'test-team',
        BusinessUnit: 'Engineering',
      },
    };

    vi.mocked(resourcesData.updateResourceTags).mockReturnValue(updatedResource);

    const app = createTestApp();
    const response = await request(app)
      .patch('/api/resources/vm-prod-web-001/tags')
      .send({
        Environment: 'Production',
        Owner: 'test-team',
        BusinessUnit: 'Engineering',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('resource');
    expect(response.body.resource.tags.Owner).toBe('test-team');
    expect(response.body.resource.tags.BusinessUnit).toBe('Engineering');
    expect(resourcesData.updateResourceTags).toHaveBeenCalledWith('vm-prod-web-001', {
      Environment: 'Production',
      Owner: 'test-team',
      BusinessUnit: 'Engineering',
    });
  });

  it('should return 400 for invalid Environment enum value', async () => {
    const app = createTestApp();
    const response = await request(app)
      .patch('/api/resources/vm-prod-web-001/tags')
      .send({
        Environment: 'Invalid',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    expect(response.body.error).toHaveProperty('message', 'Invalid tags data');
    expect(response.body.error.details).toBeDefined();
    expect(response.body.error.details[0].path).toContain('Environment');
  });

  it('should return 400 for invalid BusinessUnit enum value', async () => {
    const app = createTestApp();
    const response = await request(app)
      .patch('/api/resources/vm-prod-web-001/tags')
      .send({
        BusinessUnit: 'InvalidUnit',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    expect(response.body.error.details[0].path).toContain('BusinessUnit');
  });

  it('should return 400 for empty Owner string', async () => {
    const app = createTestApp();
    const response = await request(app)
      .patch('/api/resources/vm-prod-web-001/tags')
      .send({
        Owner: '',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
  });

  it('should return 404 for non-existent resource', async () => {
    vi.mocked(resourcesData.updateResourceTags).mockReturnValue(null);

    const app = createTestApp();
    const response = await request(app)
      .patch('/api/resources/nonexistent-id/tags')
      .send({
        Environment: 'Production',
        Owner: 'test-team',
      });

    expect(response.status).toBe(404);
    expect(response.body.error).toHaveProperty('code', 'NOT_FOUND');
  });

  it('should accept valid optional tags', async () => {
    const updatedResource: Resource = {
      id: 'vm-prod-web-001',
      name: 'web-server-prod-east',
      type: 'Virtual Machine',
      provider: Provider.Azure,
      region: 'eastus',
      monthlyCost: 245.5,
      tags: {
        Environment: 'Production',
        Owner: 'test-team',
        Project: 'TestProject',
        CostCenter: 'IT-001',
      },
    };

    vi.mocked(resourcesData.updateResourceTags).mockReturnValue(updatedResource);

    const app = createTestApp();
    const response = await request(app)
      .patch('/api/resources/vm-prod-web-001/tags')
      .send({
        Environment: 'Production',
        Owner: 'test-team',
        Project: 'TestProject',
        CostCenter: 'IT-001',
      });

    expect(response.status).toBe(200);
    expect(response.body.resource.tags.Project).toBe('TestProject');
    expect(response.body.resource.tags.CostCenter).toBe('IT-001');
  });
});

describe('DELETE /api/resources/:id/tags/:tagKey', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should remove a tag from a resource successfully', async () => {
    const updatedResource: Resource = {
      id: 'vm-prod-web-001',
      name: 'web-server-prod-east',
      type: 'Virtual Machine',
      provider: Provider.Azure,
      region: 'eastus',
      monthlyCost: 245.5,
      tags: {
        Environment: 'Production',
        Owner: 'platform-team',
        // Project tag removed
      },
    };

    vi.mocked(resourcesData.removeResourceTag).mockReturnValue(updatedResource);

    const app = createTestApp();
    const response = await request(app).delete('/api/resources/vm-prod-web-001/tags/Project');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('resource');
    expect(response.body.resource.tags.Project).toBeUndefined();
    expect(resourcesData.removeResourceTag).toHaveBeenCalledWith('vm-prod-web-001', 'Project');
  });

  it('should return 400 for invalid tag key', async () => {
    const app = createTestApp();
    const response = await request(app).delete('/api/resources/vm-prod-web-001/tags/InvalidTag');

    expect(response.status).toBe(400);
    expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    expect(response.body.error).toHaveProperty('message', 'Invalid tag key');
  });

  it('should return 404 for non-existent resource', async () => {
    vi.mocked(resourcesData.removeResourceTag).mockReturnValue(null);

    const app = createTestApp();
    const response = await request(app).delete('/api/resources/nonexistent-id/tags/Project');

    expect(response.status).toBe(404);
    expect(response.body.error).toHaveProperty('code', 'NOT_FOUND');
    expect(response.body.error).toHaveProperty('message', 'Resource not found');
  });

  it('should allow removing optional tags', async () => {
    const updatedResource: Resource = {
      id: 'vm-prod-web-001',
      name: 'web-server-prod-east',
      type: 'Virtual Machine',
      provider: Provider.Azure,
      region: 'eastus',
      monthlyCost: 245.5,
      tags: {
        Environment: 'Production',
        Owner: 'platform-team',
        BusinessUnit: 'Engineering',
        // CostCenter removed
      },
    };

    vi.mocked(resourcesData.removeResourceTag).mockReturnValue(updatedResource);

    const app = createTestApp();
    const response = await request(app).delete('/api/resources/vm-prod-web-001/tags/CostCenter');

    expect(response.status).toBe(200);
    expect(response.body.resource.tags.CostCenter).toBeUndefined();
  });
});

