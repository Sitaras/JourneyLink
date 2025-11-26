"use client";

import { Button } from "../ui/button";
import { X, Check } from "lucide-react";

interface EditFormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isDirty: boolean;
}

const EditFormActions = ({
  onCancel,
  isSubmitting,
  isDirty,
}: EditFormActionsProps) => {
  return (
    <div className="flex gap-2 justify-end">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        <X className="h-4 w-4 mr-1" />
        Cancel
      </Button>
      <Button
        type="submit"
        size="sm"
        disabled={isSubmitting || !isDirty}
        loading={isSubmitting}
      >
        <Check className="h-4 w-4 mr-1" />
        Save Changes
      </Button>
    </div>
  );
};

export default EditFormActions;
