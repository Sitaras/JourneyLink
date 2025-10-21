import { FieldErrors } from "react-hook-form";
import { toast } from "sonner";

export const onError = (fieldLabels: Record<string, string>, errors: FieldErrors) => {
  const firstErrorKey = Object.keys(errors)[0];
  const firstError = errors[firstErrorKey];

  if (firstError?.message && firstErrorKey) {
    const fieldLabel = fieldLabels[firstErrorKey] || firstErrorKey;
    toast.error(`${fieldLabel}: ${firstError.message}`);
  } else {
    toast.error("Please check the form for errors");
  }
};
