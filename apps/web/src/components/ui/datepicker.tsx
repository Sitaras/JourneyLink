import React from "react";
import { formatDate } from "@/utils/dateUtils";
import { CustomInput } from "./Inputs/CustomInput";
import { UseFormRegister, FieldPath, FieldValues } from "react-hook-form";
import { DateFormats } from "@/utils/dateFormats";

interface DatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<
    React.ComponentProps<"input">,
    "name" | "type" | "className" | "min" | "max"
  > {
  register: UseFormRegister<TFieldValues>;
  name: TName;
  label?: string;
  className?: string;
  buttonClassName?: string;
  labelClassName?: string;
  range?: {
    from: Date;
    to: Date;
  };
}

export function DatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  register,
  name,
  label,
  range = {
    from: new Date(),
    to: new Date(new Date().getFullYear() + 1, 11, 31),
  },
  className,
  buttonClassName,
  labelClassName,
  ...props
}: DatePickerProps<TFieldValues, TName>) {
  return (
    <CustomInput
      type="date"
      label={label}
      name={name}
      register={register}
      min={formatDate(range.from, DateFormats.DATE_DASH_REVERSE)}
      max={formatDate(range.to, DateFormats.DATE_DASH_REVERSE)}
      containerClassname={className}
      labelClassName={labelClassName}
      className={buttonClassName}
      {...props}
    />
  );
}
