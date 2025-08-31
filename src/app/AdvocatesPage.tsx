"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { formatUSPhone } from "../features/advocates/normalize";
import { useAdvocates } from "../features/advocates/hooks/useAdvocates";

export default function AdvocatesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Read URL params with defaults
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '25', 10);
  const search = searchParams.get('search') || '';
  const sort = (searchParams.get('sort') as "lastName" | "city" | "yearsOfExperience") || 'lastName';
  const dir = (searchParams.get('dir') as "asc" | "desc") || 'asc';

  // Fetch data using the hook
  const { data, isLoading, error } = useAdvocates({ page, pageSize, search, sort, dir });

  const updateURL = (updates: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, String(value));
      } else {
        newParams.delete(key);
      }
    });
    router.replace(`/?${newParams.toString()}`);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    updateURL({ search: searchTerm, page: 1 });
  };

  const onClick = () => {
    updateURL({ search: '', page: 1 });
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term">{search}</span>
        </p>
        <input 
          style={{ border: "1px solid black" }} 
          value={search}
          onChange={onChange} 
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
