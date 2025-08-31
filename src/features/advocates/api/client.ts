import type { Advocate } from "@/features/advocates/types";
import type { SortColumn, SortDir } from "@/features/advocates/constants";
import { qsp } from "@/lib/qsp";

export type AdvocatesQuery = {
  page: number;
  pageSize: number;
  search?: string;
  sort?: SortColumn;
  dir?: SortDir;
};

export type AdvocatesResponse = {
  data: Advocate[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
};

export async function fetchAdvocates(params: AdvocatesQuery): Promise<AdvocatesResponse> {
  const qs = qsp({
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
    sort: params.sort,
    dir: params.dir
  });
  const res = await fetch(`/api/advocates?${qs}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({} as any));
    throw new Error(body?.error?.message || body?.message || `Failed to fetch advocates (${res.status})`);
  }
  return res.json();
}
