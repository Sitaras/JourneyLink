"use client";

import { useBookSeatMutation } from "@/hooks/mutations/useBookingMutations";
import { Button } from "../ui/button";
import { LucideIcon, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BookingButtonProps {
  rideId: string;
  canBook?: boolean;
  variant?: "default" | "icon";
  className?: string;
  Icon?: LucideIcon;
}

const BookingButton = ({
  rideId,
  canBook = true,
  variant = "default",
  className,
  Icon = RotateCcw,
}: BookingButtonProps) => {
  const { isPending, mutate } = useBookSeatMutation(rideId);

  const isIcon = variant === "icon";

  const isLoading = isPending;

  const button = (
    <Button
      size={isIcon ? "icon" : "lg"}
      type="button"
      className={cn(!isIcon && "w-full text-base font-semibold", className)}
      disabled={isLoading || !canBook}
      loading={isLoading}
      onClick={() => {
        mutate({ rideId });
      }}
    >
      {isIcon ? (
        !isLoading ? (
          <Icon className="h-4 w-4" />
        ) : null
      ) : canBook ? (
        "Book Your Seat"
      ) : (
        "Unavailable"
      )}
    </Button>
  );

  if (isIcon) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>Request to book again</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};

export default BookingButton;
