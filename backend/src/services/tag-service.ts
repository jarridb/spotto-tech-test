import type { TagKey, Tags } from '@spotto/types';
import { TagsSchema } from '../schemas/tag-schemas.js';

export interface ValidationError {
  tagKey: TagKey;
  message: string;
  code: 'INVALID_KEY' | 'INVALID_VALUE' | 'MISSING_REQUIRED' | 'EMPTY_VALUE';
}

/**
 * Validate tags against the tag schema
 * Returns array of validation errors (empty if valid)
 */
export function validateTags(tags: Tags): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate using Zod schema
  const result = TagsSchema.safeParse(tags);

  if (!result.success) {
    // Convert Zod errors to ValidationError format
    result.error.issues.forEach((issue) => {
      const tagKey = issue.path[0] as TagKey;
      if (tagKey) {
        // Zod uses 'invalid_value' for enum validation errors
        const isInvalidValue = issue.code === 'invalid_enum_value' || issue.code === 'invalid_value';
        errors.push({
          tagKey,
          message: issue.message,
          code: isInvalidValue ? 'INVALID_VALUE' : 'INVALID_KEY',
        });
      }
    });
  }

  // Additional validation: check for empty string values
  Object.entries(tags).forEach(([key, value]) => {
    if (value === '') {
      errors.push({
        tagKey: key as TagKey,
        message: `Tag "${key}" cannot be empty`,
        code: 'EMPTY_VALUE',
      });
    }
  });

  return errors;
}

/**
 * Validate a single tag value against its schema
 * Returns true if valid, false otherwise
 */
export function validateTagValue(key: TagKey, value: string): boolean {
  // Check for empty string
  if (value === '') {
    return false;
  }

  // Validate enum types
  if (key === 'Environment') {
    const validValues = ['Production', 'Staging', 'Development', 'Testing'];
    return validValues.includes(value);
  }

  if (key === 'BusinessUnit') {
    const validValues = ['Engineering', 'Sales', 'Marketing', 'Finance', 'Operations'];
    return validValues.includes(value);
  }

  // For free-form tags (Owner, CostCenter, Project, Customer), any non-empty string is valid
  if (['Owner', 'CostCenter', 'Project', 'Customer'].includes(key)) {
    return value.trim().length > 0;
  }

  return false;
}

/**
 * Check if a tag key is valid
 */
export function isValidTagKey(key: string): key is TagKey {
  const validKeys: TagKey[] = ['Environment', 'Owner', 'BusinessUnit', 'CostCenter', 'Project', 'Customer'];
  return validKeys.includes(key as TagKey);
}

