"use client";

export function EmptyState({ term }:{ term?:string }){
  return (
    <div className="max-w-none mx-auto px-6 sm:px-12 py-6">
      <div className="card p-6 max-w-[90vw] mx-auto">No advocates found{term ? ` for "${term}"` : ""}.</div>
    </div>
  );
}
