
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useState } from "react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export const PaginationControls = ({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  itemsPerPage,
  onPageChange,
  hasNext,
  hasPrev
}: PaginationControlsProps) => {
  const [inputPage, setInputPage] = useState(currentPage.toString());

  const handlePageInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const page = parseInt(inputPage);
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
      } else {
        setInputPage(currentPage.toString());
      }
    }
  };

  const getVisiblePages = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between bg-slate-800 border border-slate-700 rounded-lg p-4">
      <div className="flex items-center gap-4">
        <Badge variant="outline" className="border-slate-600 text-slate-300">
          Showing {startIndex} - {endIndex} of {totalItems} items
        </Badge>
        <div className="text-sm text-slate-400">
          Page {currentPage} of {totalPages}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={!hasPrev}
          className="border-slate-600"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrev}
          className="border-slate-600"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex gap-1">
          {getVisiblePages().map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className={page === currentPage ? "" : "border-slate-600"}
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className="border-slate-600"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNext}
          className="border-slate-600"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 ml-4">
          <span className="text-sm text-slate-400">Go to:</span>
          <Input
            type="number"
            value={inputPage}
            onChange={(e) => setInputPage(e.target.value)}
            onKeyDown={handlePageInput}
            onBlur={() => setInputPage(currentPage.toString())}
            className="w-16 h-8 bg-slate-700 border-slate-600 text-white text-center"
            min={1}
            max={totalPages}
          />
        </div>
      </div>
    </div>
  );
};
