import { advocateData } from "../../../db/seed/advocates";
import { parseIntParam, parseDir, parseString } from "../../../lib/params";
import { Advocate } from "../../../features/advocates/types";
import { normalizeAdvocate } from "../../../features/advocates/normalize";
import { 
  DEFAULT_PAGE, 
  DEFAULT_PAGE_SIZE, 
  MAX_PAGE_SIZE, 
  SORTABLE_COLUMNS, 
  DEFAULT_SORT, 
  DEFAULT_DIR,
  type SortColumn 
} from "../../../features/advocates/constants";

const err = (message: string, status = 400) =>
  Response.json({ error: { message } }, { status });

export async function GET(request: Request) {
  try {
  const { searchParams } = new URL(request.url);
  
  // Parse query parameters with defaults and validation
  const page = parseIntParam(searchParams.get('page'), DEFAULT_PAGE, 1, Number.MAX_SAFE_INTEGER);
  const pageSize = parseIntParam(searchParams.get('pageSize'), DEFAULT_PAGE_SIZE, 1, MAX_PAGE_SIZE);
  const search = parseString(searchParams.get('search'), 100);
  const sortParam = searchParams.get('sort');
  const dirParam = parseDir(searchParams.get('dir'));
  
  // Whitelist sort columns
  if (sortParam && !SORTABLE_COLUMNS.includes(sortParam as SortColumn)) {
    return err(`Invalid sort column. Must be one of: ${SORTABLE_COLUMNS.join(', ')}`);
  }
  const sort: SortColumn = (sortParam as SortColumn) || DEFAULT_SORT;
  const dir = dirParam || DEFAULT_DIR;

  // Normalize raw data at API boundary
  let data: Advocate[] = advocateData.map(normalizeAdvocate);

  // Apply search filter (case-insensitive substring search)
  if (search) {
    const searchLower = search.toLowerCase();
    data = data.filter((advocate) => {
      const searchableFields = [
        advocate.firstName,
        advocate.lastName,
        advocate.city,
        advocate.degree,
        advocate.phoneNumber,
        ...(Array.isArray(advocate.specialties) ? advocate.specialties : [])
      ];
      
      return searchableFields.some(field => 
        field && field.toString().toLowerCase().includes(searchLower)
      ) || advocate.yearsOfExperience.toString().includes(searchLower);
    });
  }

  // Apply sorting
  data.sort((a, b) => {
    let aVal = a[sort as keyof Advocate];
    let bVal = b[sort as keyof Advocate];
    
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    
    if (aVal < bVal) return dir === 'asc' ? -1 : 1;
    if (aVal > bVal) return dir === 'asc' ? 1 : -1;
    return 0;
  });

  // Calculate pagination
  const total = data.length;
  const offset = (page - 1) * pageSize;
  const paginatedData = data.slice(offset, offset + pageSize);
  const hasMore = offset + pageSize < total;

  const response = {
    data: paginatedData,
    page,
    pageSize,
    total,
    hasMore
  };

  return new Response(JSON.stringify(response), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=30, stale-while-revalidate=60'
    }
  });
  } catch (error) {
    console.error('Advocates API error:', error);
    return err('Internal server error', 500);
  }
}
