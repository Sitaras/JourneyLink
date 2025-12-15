"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface BackButtonProps extends ButtonProps {
  label?: string;
  className?: string;
}

export const BackButton = ({
  label = "Back",
  className,
  variant = "ghost",
  onClick,
  ...props
}: BackButtonProps) => {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant={variant}
      className={cn("gap-2 pl-0 hover:pl-2 transition-all", className)}
      onClick={handleBack}
      {...props}
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </Button>
  );
};
