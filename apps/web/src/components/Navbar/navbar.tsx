"use client";

import * as React from "react";
import { Trans } from "@lingui/react/macro";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { routes } from "@/configs/routes";
import { useAuth } from "@/context/AuthClient";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";

import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import { NavActions } from "./NavActions";
import Logo from "./Logo";
import type { NavbarProps, NavbarNavItem } from "./types";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";

const defaultLinks: NavbarNavItem[] = [
  { href: routes.home, label: <Trans>Home</Trans> },
  {
    href: routes.createRide,
    label: <Trans>Create Ride</Trans>,
    protected: true,
  },
  { href: routes.myRides, label: <Trans>My rides</Trans>, protected: true },
];

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  (
    {
      className,
      logo,
      logoHref = "/",
      navigationLinks = defaultLinks,
      signInText = <Trans>Sign in</Trans>,
      signInHref = routes.login,
      ctaText = <Trans>Get Started</Trans>,
      ctaHref = routes.register,
      onSignInClick,
      onCtaClick,
      ...props
    },
    ref
  ) => {
    const { isAuthenticated, isLoading } = useAuth();
    const pathname = usePathname();
    const [openMobile, setOpenMobile] = useState(false);

    const isActive = useCallback(
      (href: string) => pathname === href,
      [pathname]
    );

    // Close mobile menu when path changes
    useEffect(() => {
      setOpenMobile(false);
    }, [pathname]);

    return (
      <header
        ref={ref}
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur px-4 md:px-6 md:top-2 md:w-[90%] md:rounded-full md:mx-auto shadow-sm",
          className
        )}
        {...props}
      >
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="md:hidden">
              <DropdownMenu open={openMobile} onOpenChange={setOpenMobile}>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" aria-label="Toggle menu">
                    <MenuIcon className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <MobileNav
                  links={navigationLinks}
                  isAuthenticated={isAuthenticated}
                  signInText={signInText}
                  signInHref={signInHref}
                  ctaText={ctaText}
                  ctaHref={ctaHref}
                />
              </DropdownMenu>
            </div>

            <Logo logo={logo} href={logoHref} />

            <div className="hidden md:flex">
              <DesktopNav
                links={navigationLinks}
                isAuthenticated={isAuthenticated}
                isActive={isActive}
              />
            </div>
          </div>

          {!isLoading && (
            <NavActions
              isAuthenticated={isAuthenticated}
              signInText={signInText}
              signInHref={signInHref}
              ctaText={ctaText}
              ctaHref={ctaHref}
              onSignInClick={onSignInClick}
              onCtaClick={onCtaClick}
            />
          )}
        </div>
      </header>
    );
  }
);

Navbar.displayName = "Navbar";
export default Navbar;
