"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { NavbarNavItem } from "./types";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import React from "react";

export default function MobileNav({
  links,
  isAuthenticated,
}: {
  links: NavbarNavItem[];
  isAuthenticated: boolean;
}) {
  return (
    <DropdownMenuContent align="start" className="w-48">
      {links.map((link, index) =>
        link.protected && !isAuthenticated ? null : (
          <React.Fragment key={link.href}>
            <Link href={link.href}>
              <DropdownMenuItem>{link.label}</DropdownMenuItem>
            </Link>
            {links.length - 1 !== index && <DropdownMenuSeparator />}
          </React.Fragment>
        )
      )}
    </DropdownMenuContent>
  );
}
