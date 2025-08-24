"use client";

import { useSearchParams } from "next/navigation";
import qs from "query-string";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useOrigin } from "@/hooks/use-origin";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
}

export const PaginationComponent = ({
  currentPage,
  totalPages,
}: PaginationComponentProps) => {
  const searchParams = useSearchParams();
  const queries = qs.parse(searchParams.toString());
  const currentHref = useOrigin();

  const getPageHref = (page: number) =>
    qs.stringifyUrl({
      url: currentHref,
      query: {
        ...queries,
        page: page.toString(),
      },
    });

  const renderPageLinks = () => {
    const maxPagesToShow = 5; // Define maxPagesToShow here
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href={getPageHref(i)}
            isActive={i === currentPage}
            className={i === currentPage ? "bg-zinc-100 rounded-md" : ""}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage === 1 ? "#" : getPageHref(currentPage - 1)}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
        {currentPage > 3 && totalPages > 5 && (
          <>
            <PaginationItem>
              <PaginationLink href={getPageHref(1)}>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}
        {renderPageLinks()}
        {currentPage < totalPages - 2 && totalPages > 5 && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href={getPageHref(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationNext
            href={
              currentPage === totalPages ? "#" : getPageHref(currentPage + 1)
            }
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
