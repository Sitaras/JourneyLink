"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/ui/Inputs/CustomInput";
import { useForm } from "react-hook-form";
import { DatePicker } from "@/components/ui/datepicker";

export default function HomeForm() {
  const form = useForm();
  
  return (
    <form
      className="flex gap-4 items-center w-full flex-wrap pl-10 pr-10"
      noValidate
    >
      <CustomInput
        placeholder="Search for destination"
        label="Start Destination"
        name="startDestination"
      />
      <CustomInput
        placeholder="Search for destination"
        label="End Destination"
        name="endDestination"
      />
      <DatePicker
        control={form.control}
        name="dateTrip"
        label="Date of trip"
        captionLayout="dropdown"
      />
      <Button type="submit" className="mt-auto">
        Search
      </Button>
    </form>
  );
}
