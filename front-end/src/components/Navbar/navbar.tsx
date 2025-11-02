"use client";

import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { routes } from "@/data/routes";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";

import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import UserMenu from "./UserMenu";
import Logo from "./Logo";
import type { NavbarProps, NavbarNavItem } from "./types";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const defaultLinks: NavbarNavItem[] = [
  { href: routes.home, label: "Home" },
  { href: routes.createRoute, label: "Create Route", protected: true },
];

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  (
    {
      className,
      logo,
      logoHref = "/",
      navigationLinks = defaultLinks,
      signInText = "Sign in",
      signInHref = routes.login,
      ctaText = "Get Started",
      ctaHref = routes.register,
      onSignInClick,
      onCtaClick,
      ...props
    },
    ref
  ) => {
    const { isAuthenticated } = useAuth();
    const pathname = usePathname();
    const [isMobile, setIsMobile] = useState(false);
    const [openMobile, setOpenMobile] = useState(false);
    const containerRef = useRef<HTMLElement>(null);

    const isActive = useCallback(
      (href: string) => pathname === href,
      [pathname]
    );

    useEffect(() => {
      setOpenMobile(false);
    }, [pathname]);

    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setIsMobile(width < 768);
        }
      };

      checkWidth();
      const resizeObserver = new ResizeObserver(checkWidth);

      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    const mergedRef = useCallback(
      (node: HTMLElement | null) => {
        containerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    return (
      <header
        ref={mergedRef}
        className={cn(
          "sticky top-2 z-50 w-[90%] mx-auto border-b rounded-full bg-background/95 backdrop-blur px-4 md:px-6",
          className
        )}
        {...props}
      >
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {isMobile && (
              <DropdownMenu open={openMobile} onOpenChange={setOpenMobile}>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" aria-label="Toggle menu">
                    <MenuIcon />
                  </Button>
                </DropdownMenuTrigger>
                <MobileNav
                  links={navigationLinks}
                  isAuthenticated={isAuthenticated}
                />
              </DropdownMenu>
            )}

            <Logo logo={logo} href={logoHref} />
            {!isMobile && (
              <DesktopNav
                links={navigationLinks}
                isAuthenticated={isAuthenticated}
                isActive={isActive}
              />
            )}
          </div>

          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <div className="flex gap-2">
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
          )}
        </div>
      </header>
    );
  }
);

Navbar.displayName = "Navbar";
export default Navbar;
