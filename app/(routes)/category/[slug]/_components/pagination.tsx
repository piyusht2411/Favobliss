"use client";

import { useSearchParams } from "next/navigation";
import qs from "query-string";

interface PaginationComponentProps {
  lastPage: boolean;
}

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

export const PaginationComponent = ({ lastPage }: PaginationComponentProps) => {
  const searchParams = useSearchParams();
  const queries = qs.parse(searchParams.toString());
  const currentPage = searchParams.get("page");

  // Default to page 1 if currentPage is null, undefined, or invalid
  const pageNumber =
    currentPage && !isNaN(Number(currentPage)) ? Number(currentPage) : 1;

  const currentHref = useOrigin();

  const previousPageHref = qs.stringifyUrl({
    url: currentHref,
    query: {
      ...queries,
      page: Math.max(1, pageNumber - 1).toString(), // Ensure page is at least 1
    },
  });

  const nextPageHref = qs.stringifyUrl({
    url: currentHref,
    query: {
      ...queries,
      page: (pageNumber + 1).toString(),
    },
  });

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={pageNumber === 1 ? "#" : previousPageHref}
            className={pageNumber === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {pageNumber > 1 && (
          <PaginationItem>
            <PaginationLink href={previousPageHref}>
              {pageNumber - 1}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem className="bg-zinc-100 rounded-md">
          <PaginationLink href="#" isActive>
            {pageNumber}
          </PaginationLink>
        </PaginationItem>
        {!lastPage && (
          <PaginationItem>
            <PaginationLink href={nextPageHref}>
              {pageNumber + 1}
            </PaginationLink>
          </PaginationItem>
        )}
        {!lastPage && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            href={lastPage ? "#" : nextPageHref}
            className={lastPage ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
