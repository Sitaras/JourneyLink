"use client";

import Typography from "../ui/typography";

interface InfoFieldProps {
  label: string;
  value?: string;
}

const InfoField = ({ label, value }: InfoFieldProps) => {
  return (
    <div>
      <Typography className="text-sm text-muted-foreground mb-1">
        {label}
      </Typography>
      <Typography className={"font-medium break-words"}>
        {value || "-"}
      </Typography>
    </div>
  );
};

export default InfoField;
