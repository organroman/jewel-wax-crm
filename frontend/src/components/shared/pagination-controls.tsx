"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface PaginationControlsProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls = ({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationControlsProps) => {
  if (!Number.isFinite(totalPages) || totalPages < 1) return null;

  const getVisiblePages = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 4) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            aria-disabled={currentPage <= 1}
            size="sm"
            className={cn(
              "text-xs mr-2 py-1 rounded-sm cursor-pointer",
              currentPage <= 1 ? "pointer-events-none opacity-50" : ""
            )}
          />
        </PaginationItem>

        {visiblePages.map((page, idx) => (
          <PaginationItem key={idx}>
            {page === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => {
                  if (page !== currentPage) {
                    onPageChange(page);
                  }
                }}
                className="text-xs size-7 rounded-sm bg-transparent border-ui-border hover:border-text-light"
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            aria-disabled={currentPage >= totalPages}
            size="sm"
            className={cn(
              "text-xs ml-2 cursor-pointer",
              currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
