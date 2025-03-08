"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const HomePage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <div>
      <div className="flex gap-9 items-center">
        <div className="flex items-center gap-2 flex-1">
          <label className="text-lg font-semibold whitespace-nowrap">
            Start Destination
          </label>
          <Input placeholder="Enter start destination" className="w-full p-3 text-lg" />
        </div>

        <div className="flex items-center gap-2 flex-1">
          <label className="text-lg font-semibold whitespace-nowrap">
            End Destination
          </label>
          <Input placeholder="Enter end destination" className="w-full p-3 text-lg" />
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
                {date ? format(date, "PPP") : <span>Pick a date</span>}
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
      </div>
    </div>
  );
};

export default HomePage;