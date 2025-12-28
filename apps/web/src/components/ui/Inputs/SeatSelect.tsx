import * as React from "react";
import { Trans } from "@lingui/react/macro";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control, Controller } from "react-hook-form";
import { Label } from "../label";

interface SeatsSelectProps {
  control: Control<any>;
  name: string;
  label: React.ReactNode;
  maxSeats?: number;
  required?: boolean;
  labelClassName?: string;
}

export const SeatsSelect: React.FC<SeatsSelectProps> = ({
  control,
  name,
  label,
  maxSeats = 4,
  required = true,
  labelClassName,
}) => {
  const options = Array.from({ length: maxSeats }, (_, i) => i + 1);

  return (
    <div className="flex flex-col space-y-2">
      {label && (
        <Label htmlFor={name} className={labelClassName}>
          {label}
        </Label>
      )}
      <Controller
        control={control}
        name={name}
        rules={{ required }}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value?.toString()}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={<Trans>Select number of seats</Trans>}
              />
            </SelectTrigger>
            <SelectContent>
              {options.map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
};
