"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import type { NavbarNavItem } from "./types";

export default function DesktopNav({
  links,
  isActive,
  isAuthenticated,
}: {
  links: NavbarNavItem[];
  isActive: (href: string) => boolean;
  isAuthenticated: boolean;
}) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {links.map((l) =>
          l.protected && !isAuthenticated ? null : (
            <NavigationMenuItem key={l.href}>
              <NavigationMenuLink asChild>
                <Link
                  href={l.href}
                  className={cn(
                    "px-4 py-2 text-sm no-underline font-medium relative h-10 flex items-center gap-2 hover:bg-accent hover:text-accent-foreground",
                    isActive(l.href) &&
                      "before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:bg-primary"
                  )}
                >
                  {l.label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
