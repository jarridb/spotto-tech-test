import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ResourceWithCoverage, TagKey } from '@spotto/types';
import { BulkEditSheet } from './bulk-edit-sheet';

interface BulkEditActionsProps {
  selectedResourceIds: string[];
  resources: ResourceWithCoverage[];
  onComplete: () => void;
}

const REQUIRED_TAGS: TagKey[] = ['Environment', 'Owner', 'BusinessUnit'];
const OPTIONAL_TAGS: TagKey[] = ['CostCenter', 'Project', 'Customer'];
const ALL_TAGS: TagKey[] = [...REQUIRED_TAGS, ...OPTIONAL_TAGS];

export function BulkEditActions({
  selectedResourceIds,
  resources,
  onComplete,
}: BulkEditActionsProps) {
  const [operation, setOperation] = useState<'add' | 'remove' | null>(null);
  const [selectedTag, setSelectedTag] = useState<TagKey | null>(null);
  const [addEditPopoverOpen, setAddEditPopoverOpen] = useState(false);
  const [removePopoverOpen, setRemovePopoverOpen] = useState(false);

  if (selectedResourceIds.length < 2) {
    return null;
  }

  // Get optional tags that are used across any selected resources (for remove operation)
  const availableOptionalTags = OPTIONAL_TAGS.filter((tag) => {
    return resources.some((resource) => resource.tags[tag]);
  });

  const handleAddEditTagSelect = (tag: TagKey) => {
    setSelectedTag(tag);
    setAddEditPopoverOpen(false);
    setOperation('add');
  };

  const handleRemoveTagSelect = (tag: TagKey) => {
    setSelectedTag(tag);
    setRemovePopoverOpen(false);
    setOperation('remove');
  };

  const handleSheetClose = (open: boolean) => {
    if (!open) {
      setOperation(null);
      setSelectedTag(null);
    }
  };

  return (
    <>
    <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-3">
      <span className="text-sm font-medium">
        {selectedResourceIds.length} resource{selectedResourceIds.length !== 1 ? 's' : ''} selected
      </span>
      <div className="ml-auto flex items-center gap-2">
          <Popover open={addEditPopoverOpen} onOpenChange={setAddEditPopoverOpen}>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          Add/Edit Tag
                <ChevronDown className="h-4 w-4 ml-1 opacity-50" />
        </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0">
              <div className="p-2">
                <div className="mb-2">
                  <p className="text-xs font-semibold text-muted-foreground px-2 py-1">Required</p>
                  {REQUIRED_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleAddEditTagSelect(tag)}
                      className={cn(
                        'w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent',
                        selectedTag === tag && 'bg-accent font-medium'
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <Separator />
                <div className="mt-2">
                  <p className="text-xs font-semibold text-muted-foreground px-2 py-1">Optional</p>
                  {OPTIONAL_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleAddEditTagSelect(tag)}
                      className={cn(
                        'w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent',
                        selectedTag === tag && 'bg-accent font-medium'
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={removePopoverOpen} onOpenChange={setRemovePopoverOpen}>
            <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
                disabled={availableOptionalTags.length === 0}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Remove Tag
                <ChevronDown className="h-4 w-4 ml-1 opacity-50" />
        </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0">
              <div className="p-2">
                <div className="mb-2">
                  <p className="text-xs font-semibold text-muted-foreground px-2 py-1">Optional</p>
                  {availableOptionalTags.length === 0 ? (
                    <p className="px-2 py-1.5 text-sm text-muted-foreground">No optional tags available</p>
                  ) : (
                    availableOptionalTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleRemoveTagSelect(tag)}
                        className={cn(
                          'w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent',
                          selectedTag === tag && 'bg-accent font-medium'
                        )}
                      >
                        {tag}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {operation && selectedTag && (
        <BulkEditSheet
          open={operation !== null}
          onOpenChange={handleSheetClose}
          operation={operation}
          selectedTag={selectedTag}
          selectedResourceIds={selectedResourceIds}
          resources={resources}
          onComplete={() => {
            setOperation(null);
            setSelectedTag(null);
            onComplete();
          }}
        />
      )}
    </>
  );
}

