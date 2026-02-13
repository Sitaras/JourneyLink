"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  from?: string;
  to?: string;
  departureDate?: string;
  className?: string;
}

export default function PaginationBar({
  currentPage,
  totalPages,
  from = "",
  to = "",
  departureDate = "",
  className,
}: PaginationBarProps) {
  const router = useRouter();

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    const params = new URLSearchParams({
      from,
      to,
      departureDate,
      page: page.toString(),
    });

    router.push(`/?${params.toString()}`);
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination className={cn("mt-6", className)}>
      <PaginationContent className="gap-1">
        <PaginationItem>
          <PaginationLink
            aria-label="Go to first page"
            size="icon"
            onClick={() => goToPage(1)}
            className={cn(
              "cursor-pointer transition-all",
              isFirstPage && "pointer-events-none opacity-50"
            )}
            aria-disabled={isFirstPage}
          >
            <ChevronFirst className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            aria-label="Go to previous page"
            size="icon"
            onClick={() => goToPage(currentPage - 1)}
            className={cn(
              "cursor-pointer transition-all",
              isFirstPage && "pointer-events-none opacity-50"
            )}
            aria-disabled={isFirstPage}
          >
            <ChevronLeft className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>

        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((page, index) => (
            <PaginationItem key={index}>
              {page === "..." ? (
                <span className="px-4 py-2 text-sm text-muted-foreground">
                  ...
                </span>
              ) : (
                <PaginationLink
                  aria-label={`Go to page ${page}`}
                  onClick={() => goToPage(page as number)}
                  className={cn(
                    "cursor-pointer transition-all min-w-[40px]",
                    currentPage === page &&
                      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                  )}
                  isActive={currentPage === page}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
        </div>

        <PaginationItem className="sm:hidden">
          <span className="px-4 py-2 text-sm font-medium">
            {currentPage} / {totalPages}
          </span>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            aria-label="Go to next page"
            size="icon"
            onClick={() => goToPage(currentPage + 1)}
            className={cn(
              "cursor-pointer transition-all",
              isLastPage && "pointer-events-none opacity-50"
            )}
            aria-disabled={isLastPage}
          >
            <ChevronRight className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            aria-label="Go to last page"
            size="icon"
            onClick={() => goToPage(totalPages)}
            className={cn(
              "cursor-pointer transition-all",
              isLastPage && "pointer-events-none opacity-50"
            )}
            aria-disabled={isLastPage}
          >
            <ChevronLast className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
