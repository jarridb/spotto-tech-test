import { describe, it, expect } from 'vitest';
import { validateTags, validateTagValue, isValidTagKey } from './tag-service.js';
import type { Tags } from '@spotto/types';

describe('tag-service', () => {
  describe('validateTags', () => {
    it('should return empty array for valid tags', () => {
      const validTags: Tags = {
        Environment: 'Production',
        Owner: 'platform-team',
        BusinessUnit: 'Engineering',
        CostCenter: 'IT-001',
        Project: 'API-v2',
      };

      const errors = validateTags(validTags);
      expect(errors).toHaveLength(0);
    });

    it('should return errors for invalid enum values', () => {
      const invalidTags: Tags = {
        Environment: 'Invalid' as any,
        BusinessUnit: 'InvalidUnit' as any,
        Owner: 'test-team',
      };

      const errors = validateTags(invalidTags);
      expect(errors.length).toBeGreaterThan(0);
      
      // Check that we have errors for invalid enum values
      const environmentError = errors.find((e) => e.tagKey === 'Environment');
      const businessUnitError = errors.find((e) => e.tagKey === 'BusinessUnit');
      
      expect(environmentError).toBeDefined();
      expect(environmentError?.code).toBe('INVALID_VALUE');
      expect(businessUnitError).toBeDefined();
      expect(businessUnitError?.code).toBe('INVALID_VALUE');
    });

    it('should return errors for empty string values', () => {
      const tagsWithEmptyValues: Tags = {
        Environment: 'Production',
        Owner: '', // Empty string
        BusinessUnit: 'Engineering',
        CostCenter: '', // Empty string
      };

      const errors = validateTags(tagsWithEmptyValues);
      expect(errors.length).toBeGreaterThan(0);
      
      // Check for empty value errors
      const ownerError = errors.find((e) => e.tagKey === 'Owner' && e.code === 'EMPTY_VALUE');
      const costCenterError = errors.find((e) => e.tagKey === 'CostCenter' && e.code === 'EMPTY_VALUE');
      
      expect(ownerError).toBeDefined();
      expect(ownerError?.message).toContain('cannot be empty');
      expect(costCenterError).toBeDefined();
    });

    it('should accept valid optional tags', () => {
      const tagsWithOptional: Tags = {
        Environment: 'Production',
        Owner: 'test-team',
        BusinessUnit: 'Engineering',
        Project: 'TestProject',
        Customer: 'TestCustomer',
      };

      const errors = validateTags(tagsWithOptional);
      expect(errors).toHaveLength(0);
    });

    it('should accept partial tags (not all tags required)', () => {
      const partialTags: Tags = {
        Environment: 'Production',
        Owner: 'test-team',
      };

      const errors = validateTags(partialTags);
      expect(errors).toHaveLength(0);
    });
  });

  describe('validateTagValue', () => {
    it('should return true for valid Environment values', () => {
      expect(validateTagValue('Environment', 'Production')).toBe(true);
      expect(validateTagValue('Environment', 'Staging')).toBe(true);
      expect(validateTagValue('Environment', 'Development')).toBe(true);
      expect(validateTagValue('Environment', 'Testing')).toBe(true);
    });

    it('should return false for invalid Environment values', () => {
      expect(validateTagValue('Environment', 'Invalid')).toBe(false);
      expect(validateTagValue('Environment', '')).toBe(false);
      expect(validateTagValue('Environment', 'production')).toBe(false); // Case sensitive
    });

    it('should return true for valid BusinessUnit values', () => {
      expect(validateTagValue('BusinessUnit', 'Engineering')).toBe(true);
      expect(validateTagValue('BusinessUnit', 'Sales')).toBe(true);
      expect(validateTagValue('BusinessUnit', 'Marketing')).toBe(true);
      expect(validateTagValue('BusinessUnit', 'Finance')).toBe(true);
      expect(validateTagValue('BusinessUnit', 'Operations')).toBe(true);
    });

    it('should return false for invalid BusinessUnit values', () => {
      expect(validateTagValue('BusinessUnit', 'Invalid')).toBe(false);
      expect(validateTagValue('BusinessUnit', '')).toBe(false);
    });

    it('should return true for non-empty free-form tag values', () => {
      expect(validateTagValue('Owner', 'test-team')).toBe(true);
      expect(validateTagValue('CostCenter', 'IT-001')).toBe(true);
      expect(validateTagValue('Project', 'API-v2')).toBe(true);
      expect(validateTagValue('Customer', 'Acme Corp')).toBe(true);
    });

    it('should return false for empty free-form tag values', () => {
      expect(validateTagValue('Owner', '')).toBe(false);
      expect(validateTagValue('CostCenter', '   ')).toBe(false); // Only whitespace
      expect(validateTagValue('Project', '')).toBe(false);
    });
  });

  describe('isValidTagKey', () => {
    it('should return true for valid tag keys', () => {
      expect(isValidTagKey('Environment')).toBe(true);
      expect(isValidTagKey('Owner')).toBe(true);
      expect(isValidTagKey('BusinessUnit')).toBe(true);
      expect(isValidTagKey('CostCenter')).toBe(true);
      expect(isValidTagKey('Project')).toBe(true);
      expect(isValidTagKey('Customer')).toBe(true);
    });

    it('should return false for invalid tag keys', () => {
      expect(isValidTagKey('InvalidTag')).toBe(false);
      expect(isValidTagKey('')).toBe(false);
      expect(isValidTagKey('environment')).toBe(false); // Case sensitive
      expect(isValidTagKey('ENVIRONMENT')).toBe(false); // Case sensitive
    });
  });
});

