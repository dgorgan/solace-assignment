"use client";

export function EmptyState({ term }:{ term?:string }){
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="card p-6">No advocates found{term ? ` for "${term}"` : ""}.</div>
    </div>
  );
}
