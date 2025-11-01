import { DateFormats } from "@/utils/dateFormats";
import { formatDate } from "@/utils/dateUtils";
import React from "react";
import { CustomInput, CustomInputProps } from "./CustomInput";

const BirthdayInput = (props: CustomInputProps) => {
  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 13,
    today.getMonth(),
    today.getDate()
  );
  const minDate = new Date(
    today.getFullYear() - 80,
    today.getMonth(),
    today.getDate()
  );
  return (
    <CustomInput
      {...props}
      label="Date of birth"
      type="date"
      max={formatDate(maxDate, DateFormats.DATE_DASH_REVERSE)}
      min={formatDate(minDate, DateFormats.DATE_DASH_REVERSE)}
    />
  );
};

export default BirthdayInput;
