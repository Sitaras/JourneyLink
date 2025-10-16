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

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  from?: string;
  to?: string;
  departureDate?: string;
}

export default function PaginationBar({
  currentPage,
  totalPages,
  from = "",
  to = "",
  departureDate = "",
}: PaginationBarProps) {
  const router = useRouter();

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const query = `from=${encodeURIComponent(from)}&to=${encodeURIComponent(
      to
    )}&departureDate=${encodeURIComponent(departureDate)}&page=${page}`;
    router.push(`/?${query}`);
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            aria-label="First page"
            size="icon"
            onClick={() => goToPage(1)}
            className="cursor-pointer"
            isActive={currentPage > 1}
          >
            <ChevronFirst className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            aria-label="Previous page"
            size="icon"
            onClick={() => goToPage(currentPage - 1)}
            className="cursor-pointer"
            isActive={currentPage > 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            aria-label="Next page"
            size="icon"
            onClick={() => goToPage(currentPage + 1)}
            className="cursor-pointer"
            isActive={currentPage < totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            aria-label="Last page"
            size="icon"
            onClick={() => goToPage(totalPages)}
            className="cursor-pointer"
            isActive={currentPage < totalPages}
          >
            <ChevronLast className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
