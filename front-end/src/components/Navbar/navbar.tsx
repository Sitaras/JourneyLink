"use client";
import * as React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { routes } from "@/data/routes";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { UserRoundIcon } from "lucide-react";

const HamburgerIcon = ({
  className,
  ...props
}: React.SVGAttributes<SVGElement>) => (
  <svg
    className={cn("pointer-events-none", className)}
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 12L20 12"
      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
    />
    <path
      d="M4 12H20"
      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
    />
    <path
      d="M4 12H20"
      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
    />
  </svg>
);

export interface NavbarNavItem {
  href: string;
  label: string;
  external?: boolean;
  protected?: boolean;
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoHref?: string;
  navigationLinks?: NavbarNavItem[];
  signInText?: string;
  signInHref?: string;
  ctaText?: string;
  ctaHref?: string;
  onSignInClick?: () => void;
  onCtaClick?: () => void;
}

const defaultNavigationLinks: NavbarNavItem[] = [
  { href: routes.home, label: "Home" },
  { href: routes.settings, label: "Settings", protected: true },
];

export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  (
    {
      className,
      logo,
      logoHref = "/",
      navigationLinks = defaultNavigationLinks,
      signInText = "Sign In",
      signInHref = routes.login,
      ctaText = "Get Started",
      ctaHref = routes.register,
      onSignInClick,
      onCtaClick,
      ...props
    },
    ref
  ) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLElement>(null);
    const pathname = usePathname();

    const { isAuthenticated } = useAuth();

    // Check if a link is active based on current pathname
    const isLinkActive = useCallback(
      (href: string) => {
        if (href === "/") {
          return pathname === "/";
        }
        return pathname.startsWith(href);
      },
      [pathname]
    );

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

    // Close mobile menu on route change
    useEffect(() => {
      setIsOpen(false);
    }, [pathname]);

    // Combine refs
    const combinedRef = useCallback(
      (node: HTMLElement | null) => {
        containerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    const handleSignInClick = (e: React.MouseEvent) => {
      if (onSignInClick) {
        e.preventDefault();
        onSignInClick();
      }
    };

    const handleCtaClick = (e: React.MouseEvent) => {
      if (onCtaClick) {
        e.preventDefault();
        onCtaClick();
      }
    };

    return (
      <header
        ref={combinedRef}
        className={cn(
          "sticky top-2 z-50 w-[90%] mx-auto border-b rounded-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6",
          className
        )}
        {...props}
      >
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex items-center gap-2">
            {/* Mobile menu trigger */}
            {isMobile && (
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    className="group h-9 w-9 hover:bg-accent hover:text-accent-foreground"
                    variant="ghost"
                    size="icon"
                    aria-label="Toggle navigation menu"
                  >
                    <HamburgerIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-64 p-1">
                  <NavigationMenu className="max-w-none">
                    <NavigationMenuList className="flex-col items-start gap-0">
                      {navigationLinks.map((link) => {
                        if (link.protected && !isAuthenticated) return null;
                        return (
                          <NavigationMenuItem
                            key={link.href}
                            className="w-full"
                          >
                            {link.external ? (
                              <a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                  "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:text-accent-foreground no-underline",
                                  isLinkActive(link.href) &&
                                    "text-accent-foreground"
                                )}
                              >
                                {link.label}
                              </a>
                            ) : (
                              <Link
                                href={link.href}
                                className={cn(
                                  "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:text-accent-foreground no-underline",
                                  isLinkActive(link.href) &&
                                    "bg-accent text-accent-foreground"
                                )}
                              >
                                {link.label}
                              </Link>
                            )}
                          </NavigationMenuItem>
                        );
                      })}
                    </NavigationMenuList>
                  </NavigationMenu>
                </PopoverContent>
              </Popover>
            )}

            {/* Logo */}
            <div className="flex items-center gap-6">
              <Link
                href={logoHref}
                className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors no-underline"
              >
                {logo && <div className="text-2xl">{logo}</div>}
                <span className="hidden font-bold text-xl sm:inline-block">
                  JourneyLink
                </span>
              </Link>

              {/* Desktop Navigation menu */}
              {!isMobile && (
                <NavigationMenu className="flex">
                  <NavigationMenuList className="gap-1">
                    {navigationLinks.map((link, index) => {
                      if (link.protected && !isAuthenticated) return null;
                      return (
                        <NavigationMenuItem key={index}>
                          {link.external ? (
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={cn(
                                "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 relative no-underline",
                                "before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-primary before:scale-x-0 before:transition-transform before:duration-300 hover:before:scale-x-100",
                                isLinkActive(link.href) &&
                                  "before:scale-x-100 text-primary"
                              )}
                            >
                              {link.label}
                            </a>
                          ) : (
                            <NavigationMenuLink asChild>
                              <Link
                                href={link.href}
                                className={cn(
                                  "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 relative no-underline",
                                  "before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-primary before:scale-x-0 before:transition-transform before:duration-300 hover:before:scale-x-100",
                                  isLinkActive(link.href) &&
                                    "before:scale-x-100 text-primary"
                                )}
                              >
                                {link.label}
                              </Link>
                            </NavigationMenuLink>
                          )}
                        </NavigationMenuItem>
                      );
                    })}
                  </NavigationMenuList>
                </NavigationMenu>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Avatar>
                <AvatarFallback>
                  <UserRoundIcon className="size-4.5" />
                </AvatarFallback>
              </Avatar>
            ) : (
              <>
                {onSignInClick ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                    onClick={handleSignInClick}
                  >
                    {signInText}
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                    asChild
                  >
                    <Link href={signInHref}>{signInText}</Link>
                  </Button>
                )}

                {onCtaClick ? (
                  <Button
                    size="sm"
                    className="text-sm font-medium px-4 h-9 rounded-md shadow-sm"
                    onClick={handleCtaClick}
                  >
                    {ctaText}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="text-sm font-medium px-4 h-9 rounded-md shadow-sm"
                    asChild
                  >
                    <Link href={ctaHref}>{ctaText}</Link>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </header>
    );
  }
);

Navbar.displayName = "Navbar";
