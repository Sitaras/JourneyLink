"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { Notifications } from "../ Notifications/Notifications";
import UserMenu from "./UserMenu";

interface NavActionsProps {
  isAuthenticated: boolean;
  signInText?: React.ReactNode;
  signInHref?: string;
  ctaText?: React.ReactNode;
  ctaHref?: string;
  onSignInClick?: () => void;
  onCtaClick?: () => void;
}

export function NavActions({
  isAuthenticated,
  signInText,
  signInHref = "/login",
  ctaText,
  ctaHref = "/register",
  onSignInClick,
  onCtaClick,
}: NavActionsProps) {
  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden md:block">
          <LanguageSwitcher />
        </div>
        <Notifications />
        <UserMenu />
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <div className="hidden md:block">
        <LanguageSwitcher />
      </div>
      <div className="hidden md:flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSignInClick}
          asChild={!onSignInClick}
        >
          <Link href={signInHref}>{signInText}</Link>
        </Button>

        <Button
          size="sm"
          className="shadow-sm"
          onClick={onCtaClick}
          asChild={!onCtaClick}
        >
          <Link href={ctaHref}>{ctaText}</Link>
        </Button>
      </div>
    </div>
  );
}
