import * as React from "react";
import { Input } from "../input";
import { Label } from "../label";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface CustomInputProps extends React.ComponentProps<"input"> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>;
  errors?: FieldErrors;
  label?: string;
  type?: string;
  labelClassName?: string;
  name: string;
  required?: boolean;
}

const CustomInput = ({
  register,
  errors,
  label,
  type = "text",
  name,
  required = true,
  labelClassName,
  ...rest
}: CustomInputProps) => {
  return (
    <>
      {label && (
        <Label htmlFor={name} className={labelClassName}>
          {label}
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
    </>
  );
};

CustomInput.displayName = "CustomInput";

export { CustomInput };
