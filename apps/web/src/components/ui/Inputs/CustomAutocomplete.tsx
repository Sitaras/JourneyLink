import React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  FieldError,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

export interface AutocompleteOption {
  label: string;
  value: Record<string, unknown>;
}

export interface CustomAutocompleteProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<any>;
  name: TName;
  options: readonly AutocompleteOption[];
  label?: React.ReactNode;
  description?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  buttonClassName?: string;
  labelClassName?: string;
  optionsKeyName: string;
  error?: FieldError;
  disabled?: boolean;
  onSearchChange?: (search: string) => void;
}

export const CustomAutocomplete = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  options,
  label,
  description,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyMessage = "No option found.",
  className,
  buttonClassName,
  labelClassName,
  error,
  optionsKeyName,
  disabled = false,
  onSearchChange,
}: CustomAutocompleteProps<TFieldValues, TName>) => {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  return (
    <div className={cn("max-lg:w-full flex flex-col space-y-2", className)}>
      {label && (
        <Label className={labelClassName} htmlFor={name}>
          {label}
        </Label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                id={name}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                disabled={disabled}
                className={cn(
                  "w-[240px] max-lg:w-full justify-between",
                  !field.value && "text-muted-foreground",
                  error && "border-red-500",
                  buttonClassName
                )}
              >
                <p className="truncate">{field?.value?.label || placeholder}</p>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[240px] max-lg:w-full p-0">
              <Command>
                <CommandInput
                  placeholder={searchPlaceholder}
                  className="h-9"
                  value={searchValue}
                  onValueChange={handleSearchChange}
                />
                <CommandList>
                  <CommandEmpty>{emptyMessage}</CommandEmpty>
                  <CommandGroup>
                    {options?.map((option) => (
                      <CommandItem
                        value={option.label}
                        key={option.value?.[optionsKeyName] as string}
                        onSelect={() => {
                          field.onChange(option.value);
                          setOpen(false);
                          setSearchValue("");
                        }}
                      >
                        {option.label}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            option?.value?.[optionsKeyName] ===
                              field?.value?.[optionsKeyName]
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
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
};
