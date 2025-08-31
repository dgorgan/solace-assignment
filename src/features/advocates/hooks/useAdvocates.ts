"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchAdvocates } from "../api/client";
import type { AdvocatesQuery, AdvocatesResponse } from "../api/client";

export function useAdvocates(params: AdvocatesQuery) {
  return useQuery<AdvocatesResponse>({
    queryKey: ["advocates", params],
    queryFn: () => fetchAdvocates(params),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
