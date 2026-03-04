import { FieldErrors } from "react-hook-form";
import { toast } from "sonner";
import { getValidationMessage } from "@/utils/errorMappings";
import { t } from "@lingui/core/macro";

/**
 * @param fieldLabels - A mapping of field paths to human-readable labels
 *                      Example: { "firstName": "First name", "socials.facebook": "Facebook" }
 * @param errors - The FieldErrors object from react-hook-form containing validation errors
 *
 * @example
 * ```typescript
 * // Field labels mapping
 * const FIELD_LABELS = {
 *   firstName: "First name",
 *   "address.home.street": "Street address"
 * };
 *
 * // Errors example - Direct field error
 * const errors1 = {
 *   firstName: { message: "This field is required" }
 * };
 * onError(FIELD_LABELS, errors1);
 * // Displays: "First name: This field is required"
 *
 * // Errors example - Deeply nested field error (2+ levels)
 * const errors3 = {
 *   address: {
 *     home: {
 *       street: { message: "Street address is required" }
 *     }
 *   }
 * };
 * onError(FIELD_LABELS, errors3);
 * // Displays: "Street address: Street address is required"
 * ```
 */

export const onError = (
  fieldLabels: Record<string, string>,
  errors: FieldErrors
) => {
  const findFirstError = (
    errorNode: any,
    path: string = ""
  ): { path: string; message: string } | null => {
    if (!errorNode || typeof errorNode !== "object") {
      return null;
    }

    // If this object has a message, return it
    if ("message" in errorNode && typeof errorNode.message === "string") {
      return { path, message: errorNode.message };
    }

    // Otherwise, search nested objects
    const keys = Object.keys(errorNode);
    for (const key of keys) {
      const newPath = path ? `${path}.${key}` : key;
      const nestedError = findFirstError(errorNode[key], newPath);
      if (nestedError) {
        return nestedError;
      }
    }

    return null;
  };

  const firstValidationError = findFirstError(errors);

  if (firstValidationError) {
    const fieldLabel = fieldLabels[firstValidationError.path] || firstValidationError.path;
    toast.error(`${fieldLabel}: ${getValidationMessage(firstValidationError.message)}`);
  } else {
    toast.error(t`Please check the form for errors`);
  }
};
