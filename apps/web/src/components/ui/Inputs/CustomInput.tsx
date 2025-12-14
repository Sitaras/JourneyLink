import * as React from "react";
import { Input } from "../input";
import { Label } from "../label";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { cn } from "@/lib/utils";

export interface CustomInputProps extends React.ComponentProps<"input"> {
  register?: UseFormRegister<any>;
  errors?: FieldErrors;
  label?: string;
  type?: string;
  name: string;
  required?: boolean;
  labelClassName?: string;
  containerClassname?: string;
}

const CustomInput = ({
  register,
  errors,
  label,
  type = "text",
  name,
  required = true,
  labelClassName,
  containerClassname,
  ...rest
}: CustomInputProps) => {
  return (
    <div className={cn("flex flex-col space-y-2", containerClassname)}>
      {label && (
        <Label htmlFor={name} className={labelClassName}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Input
        id={name}
        type={type}
        required={required}
        errorMessage={errors?.[name]?.message as string}
        {...register?.(name)}
        {...rest}
      />
    </div>
  );
};

CustomInput.displayName = "CustomInput";

export { CustomInput };
