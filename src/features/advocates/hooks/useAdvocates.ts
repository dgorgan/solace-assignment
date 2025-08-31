"use client";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/lib/useDebounce";
import { fetchAdvocates } from "../api/client";
import type { AdvocatesQuery, AdvocatesResponse } from "../api/client";

export function useAdvocates(params: AdvocatesQuery) {
  const debouncedSearch = useDebounce(params.search ?? "", 300);
  const queryKey = ["advocates", { ...params, search: debouncedSearch }];
  return useQuery<AdvocatesResponse>({
    queryKey,
    queryFn: () => fetchAdvocates({ ...params, search: debouncedSearch || undefined }),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
