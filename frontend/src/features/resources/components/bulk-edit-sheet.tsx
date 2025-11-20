import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBulkAddEditTag, useBulkRemoveTag } from '../services/mutations';
import type { ResourceWithCoverage, TagKey, Tags, EnvironmentValue, BusinessUnitValue } from '@spotto/types';
import { Environment, BusinessUnit } from '@spotto/types';

interface BulkEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  operation: 'add' | 'remove';
  selectedTag: TagKey;
  selectedResourceIds: string[];
  resources: ResourceWithCoverage[];
  onComplete: () => void;
}

const ENVIRONMENT_OPTIONS: EnvironmentValue[] = [
  Environment.Production,
  Environment.Staging,
  Environment.Development,
  Environment.Testing,
];

const BUSINESS_UNIT_OPTIONS: BusinessUnitValue[] = [
  BusinessUnit.Engineering,
  BusinessUnit.Sales,
  BusinessUnit.Marketing,
  BusinessUnit.Finance,
  BusinessUnit.Operations,
];

export function BulkEditSheet({
  open,
  onOpenChange,
  operation,
  selectedTag,
  selectedResourceIds,
  resources,
  onComplete,
}: BulkEditSheetProps) {
  const [tagValue, setTagValue] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFetchingPreviewRef = useRef<boolean>(false);
  const lastPreviewKeyRef = useRef<string>('');
  const removePreviewInitializedRef = useRef<boolean>(false);
  
  const bulkMutation = useBulkAddEditTag();
  const bulkRemoveMutation = useBulkRemoveTag();

  // Reset form when sheet opens/closes or tag changes
  useEffect(() => {
    if (!open) {
      setTagValue('');
      setShowPreview(false);
      isFetchingPreviewRef.current = false;
      lastPreviewKeyRef.current = '';
      removePreviewInitializedRef.current = false;
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
        previewTimeoutRef.current = null;
      }
    } else if (open && operation === 'remove') {
      // Reset the initialized flag when sheet opens for remove operation
      removePreviewInitializedRef.current = false;
    }
  }, [open, selectedTag, operation]);

  // Calculate how many resources already have this tag (for add/edit operation)
  const resourcesWithTag = useMemo(() => {
    if (operation === 'add') {
      return resources.filter((r) => {
        const tagVal = r.tags[selectedTag];
        return tagVal !== undefined && tagVal !== null && tagVal !== '';
      }).length;
    }
    return 0;
  }, [operation, resources, selectedTag]);

  // Calculate how many resources don't have this tag (for remove operation)
  const resourcesWithoutTag = useMemo(() => {
    if (operation === 'remove') {
      return resources.filter((r) => {
        const tagVal = r.tags[selectedTag];
        return tagVal === undefined || tagVal === null || tagVal === '';
      }).length;
    }
    return 0;
  }, [operation, resources, selectedTag]);

  // Debounced preview when tag value changes (for add/edit)
  useEffect(() => {
    if (operation !== 'add' || !selectedTag || !tagValue.trim() || !open) {
      setShowPreview(false);
      return;
    }

    // Prevent multiple simultaneous preview fetches
    if (isFetchingPreviewRef.current) {
      return;
    }

    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }

    previewTimeoutRef.current = setTimeout(async () => {
      if (isFetchingPreviewRef.current) {
        return;
      }

      isFetchingPreviewRef.current = true;
      const tagsToAdd: Tags = {
        [selectedTag]: tagValue.trim() as any,
      };

      try {
        await bulkMutation.mutateAsync({
          resourceIds: selectedResourceIds,
          tagsToAdd,
          preview: true,
        });
        setShowPreview(true);
      } catch (error) {
        console.error('Preview failed:', error);
        setShowPreview(false);
      } finally {
        isFetchingPreviewRef.current = false;
      }
    }, 400); // 400ms debounce

    return () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, [tagValue, selectedTag, selectedResourceIds, operation, open]);

  // Immediate preview when tag is selected for remove operation
  useEffect(() => {
    if (operation !== 'remove' || !selectedTag || !open) {
      return;
    }

    // Prevent multiple calls - only fetch once per sheet open
    if (removePreviewInitializedRef.current || isFetchingPreviewRef.current) {
      return;
    }

    const fetchPreview = async () => {
      // Mark as initialized immediately to prevent duplicate calls
      removePreviewInitializedRef.current = true;
      isFetchingPreviewRef.current = true;
      
      try {
        // Explicitly ensure preview is true - create a new object to avoid any reference issues
        const previewParams = {
          resourceIds: [...selectedResourceIds], // Create a new array
          tagKey: selectedTag,
          preview: true as const, // Use 'as const' to ensure it's always true
        };
        
        const result = await bulkRemoveMutation.mutateAsync(previewParams);
        
        // Only show preview if we got a preview response (not a submission response)
        if (result && 'items' in result) {
          setShowPreview(true);
        }
      } catch (error) {
        console.error('Preview failed:', error);
        setShowPreview(false);
        // Reset initialized flag on error so we can retry if sheet stays open
        removePreviewInitializedRef.current = false;
      } finally {
        isFetchingPreviewRef.current = false;
      }
    };

    fetchPreview();
  }, [selectedTag, selectedResourceIds, operation, open]);

  const handleApply = async () => {
    if (operation === 'remove') {
      try {
        await bulkRemoveMutation.mutateAsync({
          resourceIds: selectedResourceIds,
          tagKey: selectedTag,
          preview: false,
        });
        onComplete();
        onOpenChange(false);
      } catch (error) {
        console.error('Bulk remove failed:', error);
      }
    } else {
      if (!tagValue.trim()) return;

      const tagsToAdd: Tags = {
        [selectedTag]: tagValue.trim() as any,
      };

      try {
        await bulkMutation.mutateAsync({
          resourceIds: selectedResourceIds,
          tagsToAdd,
          preview: false,
        });
        onComplete();
        onOpenChange(false);
      } catch (error) {
        console.error('Bulk operation failed:', error);
      }
    }
  };

  const renderTagValueInput = () => {
    if (selectedTag === 'Environment') {
      return (
        <Select value={tagValue} onValueChange={setTagValue}>
          <SelectTrigger>
            <SelectValue placeholder="Select environment" />
          </SelectTrigger>
          <SelectContent>
            {ENVIRONMENT_OPTIONS.map((env) => (
              <SelectItem key={env} value={env}>
                {env}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (selectedTag === 'BusinessUnit') {
      return (
        <Select value={tagValue} onValueChange={setTagValue}>
          <SelectTrigger>
            <SelectValue placeholder="Select business unit" />
          </SelectTrigger>
          <SelectContent>
            {BUSINESS_UNIT_OPTIONS.map((bu) => (
              <SelectItem key={bu} value={bu}>
                {bu}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        value={tagValue}
        onChange={(e) => setTagValue(e.target.value)}
        placeholder={`Enter ${selectedTag} value`}
      />
    );
  };

  // Format tags for display
  const formatTagsForDisplay = (tags: Tags): string => {
    const tagEntries = Object.entries(tags)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    return tagEntries || 'No tags';
  };

  if (operation === 'remove') {
    const previewData = bulkRemoveMutation.data && 'items' in bulkRemoveMutation.data ? bulkRemoveMutation.data : null;

    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-[640px]">
          <SheetHeader>
            <SheetTitle>Remove Tag ({selectedResourceIds.length} resources)</SheetTitle>
            <SheetDescription>
              Remove the "{selectedTag}" tag from all selected resources.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 py-4">
            {/* Summary message */}
            {showPreview && previewData && (
              <div className="rounded-md border p-3 bg-muted/50">
                <p className="text-sm font-medium">
                  {previewData.summary.resourcesToUpdate} resource{previewData.summary.resourcesToUpdate !== 1 ? 's' : ''} will be updated.
                  {resourcesWithoutTag > 0 && (
                    <span className="text-muted-foreground ml-1">
                      {resourcesWithoutTag} do not have this tag.
                    </span>
                      )}
                </p>
                  </div>
            )}

            {/* Preview */}
            {showPreview && previewData && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="rounded-md border p-3 max-h-96 overflow-y-auto">
                  <div className="space-y-4">
                    {previewData.items.map((item: { resourceId: string; resourceName: string; existingTags: Tags; newTags: Tags }) => (
                      <div key={item.resourceId} className="text-sm border-b last:border-b-0 pb-3 last:pb-0">
                        <div className="font-medium mb-2">{item.resourceName}</div>
                        <div className="space-y-1 text-muted-foreground">
                          <div>
                            <span className="font-medium">Current tags:</span>{' '}
                            {formatTagsForDisplay(item.existingTags)}
                          </div>
                          <div>
                            <span className="font-medium">Tags after save:</span>{' '}
                            {formatTagsForDisplay(item.newTags)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {bulkRemoveMutation.isError && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3">
                <p className="text-sm text-destructive">
                  {bulkRemoveMutation.error instanceof Error
                    ? bulkRemoveMutation.error.message
                    : 'An error occurred'}
                </p>
              </div>
            )}
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              disabled={bulkRemoveMutation.isPending}
            >
              {bulkRemoveMutation.isPending ? 'Removing...' : 'Apply'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  // Add/Edit operation
  const previewData = bulkMutation.data && 'items' in bulkMutation.data ? bulkMutation.data : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[640px]">
        <SheetHeader>
          <SheetTitle>
            Add/Edit Tag ({selectedResourceIds.length} resources)
          </SheetTitle>
          <SheetDescription>
            Set the "{selectedTag}" tag value for all selected resources.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Value</Label>
            {renderTagValueInput()}
          </div>

          {/* Summary message */}
          {showPreview && previewData && (
            <div className="rounded-md border p-3 bg-muted/50">
              <p className="text-sm font-medium">
                {previewData.summary.resourcesToUpdate} resource{previewData.summary.resourcesToUpdate !== 1 ? 's' : ''} will be updated.
                {resourcesWithTag > 0 && (
                  <span className="text-muted-foreground ml-1">
                    {resourcesWithTag} already have this tag.
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Preview */}
          {showPreview && previewData && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="rounded-md border p-3 max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  {previewData.items.map((item: { resourceId: string; resourceName: string; existingTags: Tags; newTags: Tags }) => (
                    <div key={item.resourceId} className="text-sm border-b last:border-b-0 pb-3 last:pb-0">
                      <div className="font-medium mb-2">{item.resourceName}</div>
                      <div className="space-y-1 text-muted-foreground">
                        <div>
                          <span className="font-medium">Current tags:</span>{' '}
                          {formatTagsForDisplay(item.existingTags)}
                        </div>
                        <div>
                          <span className="font-medium">Tags after save:</span>{' '}
                          {formatTagsForDisplay(item.newTags)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {bulkMutation.isError && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3">
              <p className="text-sm text-destructive">
                {bulkMutation.error instanceof Error
                  ? bulkMutation.error.message
                  : 'An error occurred'}
              </p>
            </div>
          )}
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={!tagValue.trim() || bulkMutation.isPending}
          >
            {bulkMutation.isPending ? 'Applying...' : 'Apply'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
