"use client";
import Link from "next/link";
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
  signInText,
  signInHref = "/login",
  ctaText,
  ctaHref = "/register",
}: {
  links: NavbarNavItem[];
  isAuthenticated: boolean;
  signInText?: React.ReactNode;
  signInHref?: string;
  ctaText?: React.ReactNode;
  ctaHref?: string;
}) {
  return (
    <DropdownMenuContent align="start" className="w-56 p-2">
      {links.map((link, index) =>
        link.protected && !isAuthenticated ? null : (
          <React.Fragment key={link.href}>
            <Link href={link.href}>
              <DropdownMenuItem className="cursor-pointer">
                {link.label}
              </DropdownMenuItem>
            </Link>
            {links.length - 1 !== index && <DropdownMenuSeparator />}
          </React.Fragment>
        )
      )}
      {!isAuthenticated && (
        <>
          <DropdownMenuSeparator />
          <Link href={signInHref}>
            <DropdownMenuItem className="cursor-pointer">
              {signInText}
            </DropdownMenuItem>
          </Link>
          <Link href={ctaHref}>
            <DropdownMenuItem className="cursor-pointer font-semibold text-primary">
              {ctaText}
            </DropdownMenuItem>
          </Link>
        </>
      )}
    </DropdownMenuContent>
  );
}
