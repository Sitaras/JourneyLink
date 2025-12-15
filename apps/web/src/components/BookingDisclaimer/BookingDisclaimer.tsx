import { AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react";

interface BookingDisclaimerProps {
  canBook: boolean;
  cannotBookReason?: string | null;
}

const getReasonDisclaimer = (reason: string | null | undefined) => {
  switch (reason) {
    case "USER_IS_DRIVER":
      return {
        text: "You are the driver of this ride.",
        variant: "info" as const,
        icon: Info,
      };
    case "ALREADY_BOOKED":
      return {
        text: "You have a confirmed booking for this ride.",
        variant: "success" as const,
        icon: CheckCircle,
      };
    case "ALREADY_REQUESTED":
      return {
        text: "You have already requested to join this ride.",
        variant: "info" as const,
        icon: Info,
      };
    case "RIDE_INACTIVE":
      return {
        text: "This ride is no longer active (completed or cancelled).",
        variant: "error" as const,
        icon: AlertCircle,
      };
    case "NO_AVAILABLE_SEATS":
      return {
        text: "This ride is fully booked.",
        variant: "warning" as const,
        icon: AlertTriangle,
      };
    default:
      return null;
  }
};

export const BookingDisclaimer = ({
  canBook,
  cannotBookReason,
}: BookingDisclaimerProps) => {
  const disclaimer = !canBook ? getReasonDisclaimer(cannotBookReason) : null;

  if (!disclaimer) return null;

  const Icon = disclaimer.icon;

  return (
    <div
      className={`p-4 rounded-md border flex items-center gap-3 ${
        disclaimer.variant === "error"
          ? "bg-destructive/10 border-destructive/20 text-destructive"
          : disclaimer.variant === "warning"
            ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-600"
            : disclaimer.variant === "success"
              ? "bg-green-500/10 border-green-500/20 text-green-600"
              : "bg-blue-500/10 border-blue-500/20 text-blue-600"
      }`}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="text-sm font-medium">{disclaimer.text}</span>
    </div>
  );
};
