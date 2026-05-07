import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const Pagination = ({ 
  currentPage, 
  totalRecords, 
  limit, 
  onPageChange,
  className 
}) => {
  const totalPages = Math.ceil(totalRecords / limit);
  
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5;
    
    let start = Math.max(1, currentPage - Math.floor(showMax / 2));
    let end = Math.min(totalPages, start + showMax - 1);
    
    if (end - start + 1 < showMax) {
      start = Math.max(1, end - showMax + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2", className)}>
      <div className="text-sm text-tmuted font-medium order-2 sm:order-1">
        Showing <span className="text-tmain font-bold">{Math.min((currentPage - 1) * limit + 1, totalRecords)}</span> to <span className="text-tmain font-bold">{Math.min(currentPage * limit, totalRecords)}</span> of <span className="text-tmain font-bold">{totalRecords}</span> entries
      </div>
      
      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-surfaceBorder bg-surface hover:bg-surface/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          title="First Page"
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-surfaceBorder bg-surface hover:bg-surface/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          title="Previous Page"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1 mx-1">
          {getPageNumbers().map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "min-w-[36px] h-9 rounded-lg text-sm font-bold transition-all shadow-sm border",
                currentPage === page
                  ? "bg-form-primary border-form-primary text-white shadow-form-primary/20"
                  : "bg-surface border-surfaceBorder text-tmain hover:border-form-primary/50 hover:bg-surface/80"
              )}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-surfaceBorder bg-surface hover:bg-surface/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          title="Next Page"
        >
          <ChevronRight size={16} />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-surfaceBorder bg-surface hover:bg-surface/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          title="Last Page"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
