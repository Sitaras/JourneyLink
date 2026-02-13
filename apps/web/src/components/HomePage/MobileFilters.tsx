"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { Trans } from "@lingui/react/macro";
import { useState } from "react";

interface MobileFiltersProps {
  children: React.ReactNode;
}

export function MobileFilters({ children }: MobileFiltersProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden w-full mb-4">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          <Trans>Filters</Trans>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[300px] sm:w-[400px] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="sr-only">
            <Trans>Filters</Trans>
          </SheetTitle>
          <SheetDescription className="sr-only">
            <Trans>Adjust search filters for rides</Trans>
          </SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
