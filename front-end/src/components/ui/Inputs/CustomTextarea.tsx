import * as React from "react";
import { Textarea } from "../textarea"; // Adjust path if needed
import { Label } from "../label";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { cn } from "@/lib/utils";

export interface CustomTextareaProps extends React.ComponentProps<"textarea"> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>;
  errors?: FieldErrors;
  label?: string;
  name: string;
  required?: boolean;
  labelClassName?: string;
  containerClassname?: string;
}

const CustomTextarea = ({
  register,
  errors,
  label,
  name,
  required = false,
  labelClassName,
  containerClassname,
  ...rest
}: CustomTextareaProps) => {
  return (
    <div className={cn("flex flex-col space-y-2", containerClassname)}>
      {label && (
        <Label htmlFor={name} className={labelClassName}>
          {label}
        </Label>
      )}
      <Textarea id={name} required={required} {...register?.(name)} {...rest} />
      {errors?.[name]?.message && (
        <p className="text-red-600 text-sm">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

CustomTextarea.displayName = "CustomTextarea";

export { CustomTextarea };
