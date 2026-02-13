import { DateFormats } from "@journey-link/shared";
import { formatDate } from "@journey-link/shared";
import { CustomInput, CustomInputProps } from "./CustomInput";
import { Trans } from "@lingui/react/macro";

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
      label={props.label || <Trans>Date of birth</Trans>}
      type="date"
      max={formatDate(maxDate, DateFormats.DATE_DASH_REVERSE)}
      min={formatDate(minDate, DateFormats.DATE_DASH_REVERSE)}
    />
  );
};

export default BirthdayInput;
