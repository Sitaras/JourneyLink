import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  // ChevronFirst,
  // ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function PaginationBar({
  currentPage,
  totalPages,
  onNext,
  onPrevious,
}: PaginationBarProps) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            aria-label="Previous page"
            size="icon"
            onClick={onPrevious}
            className="cursor-pointer"
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
            onClick={onNext}
            className="cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
