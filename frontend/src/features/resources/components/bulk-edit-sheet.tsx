import { useState, useMemo, useEffect } from 'react';
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
import { useBulkAddEditTag } from '../services/mutations';
import type { ResourceWithCoverage, TagKey, Tags, EnvironmentValue, BusinessUnitValue } from '@spotto/types';
import { Environment, BusinessUnit } from '@spotto/types';

interface BulkEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  operation: 'add' | 'edit' | 'remove';
  selectedResourceIds: string[];
  resources: ResourceWithCoverage[];
  onComplete: () => void;
}

const REQUIRED_TAGS: TagKey[] = ['Environment', 'Owner', 'BusinessUnit'];
const OPTIONAL_TAGS: TagKey[] = ['CostCenter', 'Project', 'Customer'];
const ALL_TAGS: TagKey[] = [...REQUIRED_TAGS, ...OPTIONAL_TAGS];

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
  selectedResourceIds,
  resources,
  onComplete,
}: BulkEditSheetProps) {
  const [selectedTag, setSelectedTag] = useState<TagKey | ''>('');
  const [tagValue, setTagValue] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  
  const bulkMutation = useBulkAddEditTag();

  // Get available tags based on operation
  const availableTags = useMemo(() => {
    if (operation === 'add') {
      // Tags that are not present on ANY selected resource
      const tagsOnResources = new Set<TagKey>();
      resources.forEach((resource) => {
        Object.keys(resource.tags).forEach((key) => {
          if (resource.tags[key as TagKey]) {
            tagsOnResources.add(key as TagKey);
          }
        });
      });
      return ALL_TAGS.filter((tag) => !tagsOnResources.has(tag));
    } else if (operation === 'edit' || operation === 'remove') {
      // Tags that are present on AT LEAST ONE selected resource
      const tagsOnResources = new Set<TagKey>();
      resources.forEach((resource) => {
        Object.keys(resource.tags).forEach((key) => {
          if (resource.tags[key as TagKey]) {
            tagsOnResources.add(key as TagKey);
          }
        });
      });
      return Array.from(tagsOnResources);
    }
    return [];
  }, [operation, resources]);

  // Reset form when operation changes
  useEffect(() => {
    setSelectedTag('');
    setTagValue('');
    setShowPreview(false);
  }, [operation, open]);

  const handlePreview = async () => {
    if (!selectedTag) return;

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
    }
  };

  const handleApply = async () => {
    if (!selectedTag || !tagValue.trim()) return;

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
  };


  const renderTagValueInput = () => {
    if (!selectedTag) return null;

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

  if (operation === 'remove') {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Remove Tag</SheetTitle>
            <SheetDescription>
              Select a tag to remove from {selectedResourceIds.length} resource(s).
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tag to Remove</Label>
              <Select value={selectedTag} onValueChange={(value) => setSelectedTag(value as TagKey)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent>
                  {availableTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm text-muted-foreground">
                Bulk remove operation requires backend DELETE endpoint support. 
                Please remove tags individually from the resource detail page for now.
              </p>
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>
            {operation === 'add' ? 'Add Tag' : 'Edit Tag'} ({selectedResourceIds.length} resources)
          </SheetTitle>
          <SheetDescription>
            {operation === 'add'
              ? 'Add a tag to all selected resources with the same value.'
              : 'Edit a tag value for all selected resources.'}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Tag</Label>
            <Select value={selectedTag} onValueChange={(value) => setSelectedTag(value as TagKey)}>
              <SelectTrigger>
                <SelectValue placeholder="Select tag" />
              </SelectTrigger>
              <SelectContent>
                {availableTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTag && (
            <div className="space-y-2">
              <Label>Value</Label>
              {renderTagValueInput()}
            </div>
          )}

          {showPreview && bulkMutation.data && 'items' in bulkMutation.data && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="rounded-md border p-3 max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  {bulkMutation.data.items.map((item: { resourceId: string; resourceName: string; existingTags: Tags; newTags: Tags }) => (
                    <div key={item.resourceId} className="text-sm">
                      <div className="font-medium">{item.resourceName}</div>
                      <div className="text-muted-foreground">
                        {selectedTag && item.existingTags[selectedTag] ? (
                          <>
                            <span className="line-through">{String(item.existingTags[selectedTag])}</span>
                            {' → '}
                            <span className="font-medium">{String(item.newTags[selectedTag])}</span>
                          </>
                        ) : selectedTag ? (
                          <span className="font-medium">+ {String(item.newTags[selectedTag])}</span>
                        ) : null}
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
          {!showPreview ? (
            <Button
              onClick={handlePreview}
              disabled={!selectedTag || !tagValue.trim() || bulkMutation.isPending}
            >
              Preview
            </Button>
          ) : (
            <Button
              onClick={handleApply}
              disabled={bulkMutation.isPending}
            >
              {bulkMutation.isPending ? 'Applying...' : 'Apply'}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

