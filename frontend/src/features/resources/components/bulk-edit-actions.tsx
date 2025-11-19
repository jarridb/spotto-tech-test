import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { ResourceWithCoverage } from '@spotto/types';
import { BulkEditSheet } from './bulk-edit-sheet';

interface BulkEditActionsProps {
  selectedResourceIds: string[];
  resources: ResourceWithCoverage[];
  onComplete: () => void;
}

export function BulkEditActions({
  selectedResourceIds,
  resources,
  onComplete,
}: BulkEditActionsProps) {
  const [operation, setOperation] = useState<'add' | 'edit' | 'remove' | null>(null);

  if (selectedResourceIds.length < 2) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-3">
      <span className="text-sm font-medium">
        {selectedResourceIds.length} resource{selectedResourceIds.length !== 1 ? 's' : ''} selected
      </span>
      <div className="ml-auto flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setOperation('add')}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Tag
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setOperation('edit')}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit Tag
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setOperation('remove')}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Remove Tag
        </Button>
      </div>

      {operation && (
        <BulkEditSheet
          open={operation !== null}
          onOpenChange={(open) => !open && setOperation(null)}
          operation={operation}
          selectedResourceIds={selectedResourceIds}
          resources={resources}
          onComplete={() => {
            setOperation(null);
            onComplete();
          }}
        />
      )}
    </div>
  );
}

