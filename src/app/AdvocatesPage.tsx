"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "../lib/useDebounce";
import { qsp } from "../lib/qsp";
import { useAdvocates } from "../features/advocates/hooks/useAdvocates";
import { 
  DEFAULT_PAGE, 
  DEFAULT_PAGE_SIZE, 
  DEFAULT_SORT, 
  DEFAULT_DIR,
  type SortColumn,
  type SortDir 
} from "../features/advocates/constants";
import { HeroHeader } from "../features/advocates/components/HeroHeader";
import { PageHeader } from "../features/advocates/components/PageHeader";
import { SearchBar } from "../features/advocates/components/SearchBar";
import { EmptyState } from "../features/advocates/components/EmptyState";
import { AdvocatesTable } from "../features/advocates/components/AdvocatesTable";

export default function AdvocatesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Read URL params with defaults
  const page = parseInt(searchParams.get('page') || String(DEFAULT_PAGE), 10);
  const pageSize = parseInt(searchParams.get('pageSize') || String(DEFAULT_PAGE_SIZE), 10);
  const urlSearch = searchParams.get('search') || '';
  const sort = (searchParams.get('sort') as SortColumn) || DEFAULT_SORT;
  const dir = (searchParams.get('dir') as SortDir) || DEFAULT_DIR;

  // Local search state for controlled input
  const [searchInput, setSearchInput] = useState(urlSearch);
  
  // Debounce the search input for navigation
  const debouncedSearch = useDebounce(searchInput, 300);
  
  // Update URL when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== urlSearch) {
      const newParams = new URLSearchParams(searchParams.toString());
      if (debouncedSearch) {
        newParams.set('search', debouncedSearch);
      } else {
        newParams.delete('search');
      }
      newParams.set('page', '1'); // Reset to page 1 on search
      router.replace(`/?${newParams.toString()}`, { scroll: false });
    }
  }, [debouncedSearch, urlSearch, searchParams, router]);

  // Sync input with URL when URL changes (back/forward navigation)
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  // Fetch data using the hook (uses URL params, not local input state)
  const { data, isLoading, error } = useAdvocates({ page, pageSize, search: urlSearch, sort, dir });

  const updateURL = (updates: Record<string, string | number>) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    const newParams = { ...currentParams, ...updates };
    const qs = qsp(newParams);
    router.replace(`/?${qs}`, { scroll: false });
  };

  return (
    <main>
      <HeroHeader />
      <PageHeader />
      <SearchBar 
        value={searchInput} 
        onChange={setSearchInput} 
        onReset={() => setSearchInput("")} 
      />
      
      {error ? (
        <div className="max-w-none mx-auto px-6 sm:px-12 py-6">
          <div className="card p-6 text-red-600 max-w-[90vw] mx-auto">Error: {error.message}</div>
        </div>
      ) : data?.total === 0 ? (
        <EmptyState term={urlSearch} />
      ) : data ? (
        <AdvocatesTable
          rows={data.data} 
          total={data.total}
          page={page} 
          pageSize={pageSize} 
          hasMore={data.hasMore}
          sort={sort} 
          dir={dir}
          isLoading={isLoading}
          onSortChange={(col) => updateURL(col === sort ? { dir: dir === "asc" ? "desc" : "asc" } : { sort: col, dir: "asc" })}
          onPageChange={(p) => updateURL({ page: p })}
          onPageSizeChange={(n) => updateURL({ pageSize: n, page: 1 })}
        />
      ) : isLoading ? (
        <div className="max-w-none mx-auto px-6 sm:px-12 py-6">
          <div className="card p-6 text-center max-w-[90vw] mx-auto">
            <div className="flex items-center justify-center gap-2 text-primary">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
              <span>Loading advocates...</span>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
