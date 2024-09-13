import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

export interface PageComponentProps {
  totalPages: number;
  pageRange: number;
  onPageChange: (page: number) => void; // 添加一个新的属性，这是一个函数，当页面改变时会被调用
}

export function PageComponent({
  totalPages,
  pageRange,
  onPageChange,
}: PageComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const startPage = Math.max(1, currentPage - pageRange);
  const endPage = Math.min(totalPages, currentPage + pageRange);
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const handlePageClick =
    (p: number) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      setCurrentPage(p);
      onPageChange(p);
    };

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious onClick={handlePageClick(currentPage - 1)} />
          </PaginationItem>
        )}
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              isActive={page === currentPage}
              onClick={handlePageClick(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {currentPage < totalPages && (
          <>
            <PaginationItem>
              <PaginationNext onClick={handlePageClick(currentPage + 1)} />
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
}

export default PageComponent;
