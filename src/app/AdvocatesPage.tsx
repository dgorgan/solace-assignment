"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "../lib/useDebounce";
import { qsp } from "../lib/qsp";
import { formatUSPhone } from "../features/advocates/normalize";
import { useAdvocates } from "../features/advocates/hooks/useAdvocates";
import { 
  DEFAULT_PAGE, 
  DEFAULT_PAGE_SIZE, 
  DEFAULT_SORT, 
  DEFAULT_DIR,
  type SortColumn,
  type SortDir 
} from "../features/advocates/constants";

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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const onClick = () => {
    setSearchInput('');
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term">{urlSearch}</span>
        </p>
        <input 
          style={{ border: "1px solid black" }} 
          value={searchInput}
          onChange={onChange} 
          placeholder="Type to search..."
        />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      
      {isLoading && <div>Loading advocates...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && (
        <>
          <div>
            Showing {data.data.length} of {data.total} advocates 
            (Page {data.page} of {Math.ceil(data.total / data.pageSize)})
          </div>
          <br />
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th onClick={() => updateURL({ sort: 'lastName', dir: sort === 'lastName' && dir === 'asc' ? 'desc' : 'asc' })}>
                  Last Name {sort === 'lastName' && (dir === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => updateURL({ sort: 'city', dir: sort === 'city' && dir === 'asc' ? 'desc' : 'asc' })}>
                  City {sort === 'city' && (dir === 'asc' ? '↑' : '↓')}
                </th>
                <th>Degree</th>
                <th>Specialties</th>
                <th onClick={() => updateURL({ sort: 'yearsOfExperience', dir: sort === 'yearsOfExperience' && dir === 'asc' ? 'desc' : 'asc' })}>
                  Years of Experience {sort === 'yearsOfExperience' && (dir === 'asc' ? '↑' : '↓')}
                </th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((advocate) => {
                return (
                  <tr key={advocate.id}>
                    <td>{advocate.firstName}</td>
                    <td>{advocate.lastName}</td>
                    <td>{advocate.city}</td>
                    <td>{advocate.degree}</td>
                    <td>
                      {advocate.specialties && advocate.specialties.map((s, specIndex) => (
                        <div key={specIndex}>{s}</div>
                      ))}
                    </td>
                    <td>{advocate.yearsOfExperience}</td>
                    <td>{formatUSPhone(advocate.phoneNumber)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={() => updateURL({ page: Math.max(1, page - 1) })}
              disabled={page <= 1}
            >
              Previous
            </button>
            <span style={{ margin: '0 10px' }}>Page {page}</span>
            <button 
              onClick={() => updateURL({ page: page + 1 })}
              disabled={!data.hasMore}
            >
              Next
            </button>
          </div>
        </>
      )}
      
      {data && data.data.length === 0 && (
        <div>No advocates found matching your criteria.</div>
      )}
    </main>
  );
}
