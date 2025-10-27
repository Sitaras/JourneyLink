import React from "react";
import { formatDate } from "@/utils/dateUtils";
import { CalendarIcon } from "lucide-react";
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  FieldError,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateFormats } from "@/utils/dateFormats";
import { Label } from "./label";

interface DatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  dateFormat?: DateFormats;
  labelClassName?: string;
  displayIcon?: boolean;
  captionLayout?:
    | "dropdown"
    | "label"
    | "dropdown-months"
    | "dropdown-years"
    | undefined;
  error?: FieldError;
  range?: {
    from: Date;
    to: Date;
  };
}

export function DatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  description,
  placeholder = "Pick a date",
  range = {
    from: new Date(),
    to: new Date(new Date().getFullYear() + 1, 11, 31),
  },
  className,
  buttonClassName,
  dateFormat = DateFormats.LONG_LOCALIZED_DATE,
  error,
  labelClassName,
  captionLayout = "dropdown",
  displayIcon = true,
}: DatePickerProps<TFieldValues, TName>) {
  return (
    <div className={cn("max-lg:w-full flex flex-col space-y-2", className)}>
      {label && (
        <Label htmlFor={name} className={labelClassName}>
          {label}
        </Label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id={name}
                variant="outline"
                className={cn(
                  "w-[240px] max-lg:w-full pl-3 text-left font-normal",
                  !field.value && "text-muted-foreground",
                  error && "border-red-500",
                  buttonClassName
                )}
              >
                {field.value ? (
                  formatDate(field.value, dateFormat)
                ) : (
                  <span>{placeholder}</span>
                )}
                {displayIcon && (
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date < range.from || date > range.to}
                startMonth={range.from}
                endMonth={range.to}
                captionLayout={captionLayout}
              />
            </PopoverContent>
          </Popover>
        )}
      />
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-sm font-medium text-red-500">{error.message}</p>
      )}
    </div>
  );
}
