import type { Resource, ResourceWithCoverage, Tags } from '@spotto/types';

/**
 * Required tags that must be present for compliance
 */
const REQUIRED_TAGS: Array<keyof Tags> = ['Environment', 'Owner', 'BusinessUnit'];

/**
 * Optional tags (at least 2 must be present for compliance)
 */
const OPTIONAL_TAGS: Array<keyof Tags> = ['CostCenter', 'Project', 'Customer'];

/**
 * Check if a tag value is present and non-empty
 */
function isTagPresent(tagValue: unknown): boolean {
  return tagValue !== undefined && tagValue !== null && tagValue !== '';
}

/**
 * Calculate tag coverage count for a resource
 * Returns the count of tags present (up to 5 total for display)
 * Resources can have more than 5 tags, but display rounds down to 5
 */
export function calculateTagCoverage(resource: Resource): number {
  const allTags = [...REQUIRED_TAGS, ...OPTIONAL_TAGS];
  const presentTagsCount = allTags.filter((tag) => {
    return isTagPresent(resource.tags[tag]);
  }).length;

  // Round down to 5 for display purposes (X/5 tags format)
  return Math.min(presentTagsCount, 5);
}

/**
 * Check if a resource is compliant
 * A resource is compliant if it has:
 * - All 3 required tags (Environment, Owner, BusinessUnit) AND
 * - At least 2 optional tags (CostCenter, Project, Customer)
 */
export function isCompliant(resource: Resource): boolean {
  // Check all required tags are present
  const hasAllRequiredTags = REQUIRED_TAGS.every((tag) => {
    return isTagPresent(resource.tags[tag]);
  });

  if (!hasAllRequiredTags) {
    return false;
  }

  // Check at least 2 optional tags are present
  const presentOptionalTagsCount = OPTIONAL_TAGS.filter((tag) => {
    return isTagPresent(resource.tags[tag]);
  }).length;

  return presentOptionalTagsCount >= 2;
}

/**
 * Add tag coverage and compliance status to a resource
 * Returns ResourceWithCoverage with tagCoverage and isCompliant
 */
export function addTagCoverage(resource: Resource): ResourceWithCoverage & { isCompliant: boolean } {
  return {
    ...resource,
    tagCoverage: calculateTagCoverage(resource),
    isCompliant: isCompliant(resource),
  };
}

/**
 * Add tag coverage and compliance status to multiple resources
 */
export function addTagCoverageToResources(
  resources: Resource[]
): (ResourceWithCoverage & { isCompliant: boolean })[] {
  return resources.map(addTagCoverage);
}

