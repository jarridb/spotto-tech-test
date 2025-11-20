import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Edit, Plus, Save } from 'lucide-react';
import type { ResourceWithCoverage, TagKey, Tags, EnvironmentValue, BusinessUnitValue } from '@spotto/types';
import { Environment, BusinessUnit } from '@spotto/types';
import { useUpdateResourceTags, useRemoveResourceTag } from '../services/mutations';

interface ResourceTagsCardProps {
  resource: ResourceWithCoverage;
}

const REQUIRED_TAGS: Array<keyof ResourceWithCoverage['tags']> = [
  'Environment',
  'Owner',
  'BusinessUnit',
];

const OPTIONAL_TAGS: Array<keyof ResourceWithCoverage['tags']> = [
  'CostCenter',
  'Project',
  'Customer',
];

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

export function ResourceTagsCard({ resource }: ResourceTagsCardProps) {
  const [editingTag, setEditingTag] = useState<TagKey | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [addTagOpen, setAddTagOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState<Record<TagKey, boolean>>({});
  
  const updateTagsMutation = useUpdateResourceTags();
  const removeTagMutation = useRemoveResourceTag();

  const optionalTags = OPTIONAL_TAGS.filter((key) => {
    const value = resource.tags[key];
    return value !== undefined && value !== null && value !== '';
  });

  const availableOptionalTags = OPTIONAL_TAGS.filter((key) => {
    const value = resource.tags[key];
    return value === undefined || value === null || value === '';
  });

  const handleStartEdit = (tagKey: TagKey, currentValue: string | undefined) => {
    setEditingTag(tagKey);
    setEditValue(currentValue || '');
    setPopoverOpen({ ...popoverOpen, [tagKey]: true });
  };

  const handleCancelEdit = (tagKey: TagKey) => {
    setEditingTag(null);
    setEditValue('');
    setPopoverOpen({ ...popoverOpen, [tagKey]: false });
  };

  const handleSave = async (tagKey: TagKey) => {
    if (!editValue.trim()) {
      return;
    }

    const updatedTags: Tags = {
      ...resource.tags,
      [tagKey]: editValue.trim() as any,
    };

    try {
      await updateTagsMutation.mutateAsync({
        resourceId: resource.id,
        tags: updatedTags,
      });
      setEditingTag(null);
      setEditValue('');
      setPopoverOpen({ ...popoverOpen, [tagKey]: false });
    } catch (error) {
      console.error('Failed to update tag:', error);
    }
  };

  const handleAddValue = (tagKey: TagKey) => {
    setEditingTag(tagKey);
    setEditValue('');
    setPopoverOpen({ ...popoverOpen, [tagKey]: true });
  };

  const handleRemoveTag = async (tagKey: TagKey) => {
    try {
      await removeTagMutation.mutateAsync({
        resourceId: resource.id,
        tagKey,
      });
    } catch (error) {
      console.error('Failed to remove tag:', error);
    }
  };

  const handleAddOptionalTag = (tagKey: TagKey) => {
    setAddTagOpen(false);
    setEditingTag(tagKey);
    setEditValue('');
    setPopoverOpen({ ...popoverOpen, [tagKey]: true });
  };

  const renderTagInput = (tagKey: TagKey) => {
    if (tagKey === 'Environment') {
      return (
        <Select value={editValue} onValueChange={setEditValue}>
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

    if (tagKey === 'BusinessUnit') {
      return (
        <Select value={editValue} onValueChange={setEditValue}>
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
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        placeholder={`Enter ${tagKey} value`}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSave(tagKey);
          } else if (e.key === 'Escape') {
            handleCancelEdit(tagKey);
          }
        }}
      />
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Required Tags Section */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Required Tags</h4>
            <dl className="space-y-3">
              {REQUIRED_TAGS.map((key) => {
                const value = resource.tags[key];
                const isEditing = editingTag === key;
                const hasValue = value !== undefined && value !== null && value !== '';
                const isOpen = popoverOpen[key] || false;

                return (
                  <div key={key} className="flex items-start justify-between gap-2">
                    <dt className="text-sm font-medium text-muted-foreground min-w-[120px]">
                      {key}
                    </dt>
                    <dd className="flex-1">
                      {hasValue ? (
                        <Popover open={isOpen} onOpenChange={(open) => {
                          setPopoverOpen({ ...popoverOpen, [key]: open });
                          if (!open) {
                            setEditingTag(null);
                            setEditValue('');
                          }
                        }}>
                          <PopoverTrigger asChild>
                            <button
                              className="flex items-center gap-2 text-sm hover:underline"
                              onClick={() => handleStartEdit(key, value)}
                            >
                              <span>{String(value)}</span>
                              <Edit className="h-3 w-3 opacity-50" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-3">
                              <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                  {key}
                                </label>
                                {renderTagInput(key)}
                              </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                                  onClick={() => handleSave(key)}
                            disabled={!editValue.trim() || updateTagsMutation.isPending}
                                  className="flex-1"
                          >
                                  <Save className="h-3 w-3 mr-1" />
                                  Save
                          </Button>
                          <Button
                            size="sm"
                                  variant="outline"
                                  onClick={() => handleCancelEdit(key)}
                            disabled={updateTagsMutation.isPending}
                          >
                            Cancel
                          </Button>
                        </div>
                        </div>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <Popover open={isOpen} onOpenChange={(open) => {
                          setPopoverOpen({ ...popoverOpen, [key]: open });
                          if (!open) {
                            setEditingTag(null);
                            setEditValue('');
                          }
                        }}>
                          <PopoverTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddValue(key)}
                          disabled={updateTagsMutation.isPending || removeTagMutation.isPending}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add value
                        </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-3">
                              <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                  {key}
                                </label>
                                {renderTagInput(key)}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleSave(key)}
                                  disabled={!editValue.trim() || updateTagsMutation.isPending}
                                  className="flex-1"
                                >
                                  <Save className="h-3 w-3 mr-1" />
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCancelEdit(key)}
                                  disabled={updateTagsMutation.isPending}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>

          {/* Separator */}
          <Separator />

          {/* Optional Tags Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold">Optional Tags</h4>
              {availableOptionalTags.length > 0 && (
                <Popover open={addTagOpen} onOpenChange={setAddTagOpen}>
                  <PopoverTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Plus className="h-3 w-3 mr-1" />
                      Add tag
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="space-y-2">
                      <p className="text-sm font-medium mb-2">Select tag to add:</p>
                      {availableOptionalTags.map((tagKey) => (
                        <Button
                          key={tagKey}
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => handleAddOptionalTag(tagKey)}
                        >
                          {tagKey}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>

            {optionalTags.length === 0 && availableOptionalTags.length === 0 ? (
              <p className="text-sm text-muted-foreground">No optional tags assigned.</p>
            ) : (
              <dl className="space-y-3">
                {optionalTags.map((key) => {
                  const value = resource.tags[key];
                  const isEditing = editingTag === key;
                  const isOpen = popoverOpen[key] || false;

                  return (
                    <div key={key} className="flex items-start justify-between gap-2">
                      <dt className="text-sm font-medium text-muted-foreground min-w-[120px]">
                        {key}
                      </dt>
                      <dd className="flex-1">
                          <div className="flex items-center gap-2">
                          <Popover open={isOpen} onOpenChange={(open) => {
                            setPopoverOpen({ ...popoverOpen, [key]: open });
                            if (!open) {
                              setEditingTag(null);
                              setEditValue('');
                            }
                          }}>
                            <PopoverTrigger asChild>
                              <button
                                className="flex items-center gap-2 text-sm hover:underline"
                                onClick={() => handleStartEdit(key, value)}
                              >
                                <span>{String(value)}</span>
                                <Edit className="h-3 w-3 opacity-50" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="space-y-3">
                                <div>
                                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                    {key}
                                  </label>
                            {renderTagInput(key)}
                                </div>
                                <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                                    onClick={() => handleSave(key)}
                              disabled={!editValue.trim() || updateTagsMutation.isPending}
                                    className="flex-1"
                            >
                                    <Save className="h-3 w-3 mr-1" />
                                    Save
                            </Button>
                            <Button
                              size="sm"
                                    variant="outline"
                                    onClick={() => handleCancelEdit(key)}
                              disabled={updateTagsMutation.isPending}
                            >
                              Cancel
                            </Button>
                          </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveTag(key)}
                              disabled={updateTagsMutation.isPending || removeTagMutation.isPending}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                      </dd>
                    </div>
                  );
                })}
                {editingTag && availableOptionalTags.includes(editingTag as any) && (
                  <div className="flex items-start justify-between gap-2">
                    <dt className="text-sm font-medium text-muted-foreground min-w-[120px]">
                      {editingTag}
                    </dt>
                    <dd className="flex-1">
                      <Popover open={popoverOpen[editingTag] || false} onOpenChange={(open) => {
                        setPopoverOpen({ ...popoverOpen, [editingTag]: open });
                        if (!open) {
                          setEditingTag(null);
                          setEditValue('');
                        }
                      }}>
                        <PopoverTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Plus className="h-3 w-3 mr-1" />
                            Add value
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                {editingTag}
                              </label>
                              {renderTagInput(editingTag)}
                            </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                                onClick={() => handleSave(editingTag)}
                          disabled={!editValue.trim() || updateTagsMutation.isPending}
                                className="flex-1"
                        >
                                <Save className="h-3 w-3 mr-1" />
                                Save
                        </Button>
                        <Button
                          size="sm"
                                variant="outline"
                                onClick={() => handleCancelEdit(editingTag)}
                          disabled={updateTagsMutation.isPending}
                        >
                          Cancel
                        </Button>
                      </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </dd>
                  </div>
                )}
              </dl>
            )}
          </div>
        </div>

        {/* Error Display */}
        {(updateTagsMutation.isError || removeTagMutation.isError) && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">
              {updateTagsMutation.error instanceof Error
                ? updateTagsMutation.error.message
                : removeTagMutation.error instanceof Error
                ? removeTagMutation.error.message
                : 'An error occurred'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
