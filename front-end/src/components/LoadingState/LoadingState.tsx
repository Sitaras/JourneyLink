import { Loader2 } from "lucide-react";
import React from "react";
import Typography from "../ui/typography";
import { cn } from "@/lib/utils";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

interface LoadingStateProps {
  label?: string;
  classname?: string;
  divProps?: DivProps;
  ref?: React.Ref<HTMLDivElement>;
}

const LoadingState = ({
  label = "Loading...",
  classname,
  divProps,
  ref,
}: LoadingStateProps) => {
  return (
    <div
      {...divProps}
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center py-12 gap-3",
        classname
      )}
    >
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <Typography className="text-muted-foreground">{label}</Typography>
    </div>
  );
};

export default LoadingState;
