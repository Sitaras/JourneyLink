"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/dateUtils";
import { DateFormats } from "@/utils/dateFormats";
import { CustomInput } from "./ui/Inputs/CustomInput";

const HomePage = () => {
  const [date, setDate] = useState<Date | undefined>();

  const handleDateSelect = (selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <form
      className="flex gap-4 items-center w-full flex-wrap pl-10 pr-10"
      noValidate
    >
      <div className="flex items-center gap-2 flex-auto flex-shrink-0">
        <CustomInput
          placeholder="Search for destination"
          label="Start Destination"
          name="startDestination"
          labelClassName="text-lg font-semibold whitespace-nowrap"
          className="w-full"
        />
      </div>

      <div className="flex items-center gap-2 flex-auto flex-shrink-0">
        <CustomInput
          placeholder="Search for destination"
          label="End Destination"
          name="endDestination"
          labelClassName="text-lg font-semibold whitespace-nowrap"
        />
      </div>

      <div className="flex items-center gap-2 flex-2">
        <label className="text-lg font-semibold whitespace-nowrap">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal p-3 text-lg",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-5 w-5" />
              {date ? (
                formatDate(date, DateFormats.LONG_LOCALIZED_DATE)
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Search Button */}
      <div className="flex-3">
        <Button className="w-full p-3 text-lg bg-blue-600 hover:bg-blue-700">
          Search
        </Button>
      </div>
    </form>
  );
};

export default HomePage;
