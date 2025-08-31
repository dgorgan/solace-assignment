import type { Advocate } from "@/features/advocates/types";
import type { SortColumn, SortDir } from "@/features/advocates/constants";

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
  const qs = new URLSearchParams();
  qs.set("page", String(params.page));
  qs.set("pageSize", String(params.pageSize));
  if (params.search) qs.set("search", params.search);
  if (params.sort) qs.set("sort", params.sort);
  if (params.dir) qs.set("dir", params.dir);
  const res = await fetch(`/api/advocates?${qs.toString()}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({} as any));
    throw new Error(body?.error?.message || body?.message || `Failed to fetch advocates (${res.status})`);
  }
  return res.json();
}
