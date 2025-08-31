"use client";

type Dir="asc"|"desc"; 
type Col="lastName"|"city"|"yearsOfExperience";

export function SortHeader({ label, col, active, dir, onClick }:{
  label:string; col:Col; active:boolean; dir:Dir; onClick:()=>void;
}){
  const arrow = active ? (dir==="asc"?"▲":"▼") : "";
  return (
    <th aria-sort={active ? (dir==="asc"?"ascending":"descending") : "none"} className="text-left py-3 px-3">
      <button onClick={onClick}
              className="text-white font-semibold hover:text-gray-200 rounded focus-brand transition-colors"
              aria-label={`Sort by ${label}`}>
        {label} {arrow && <span className="ml-1">{arrow}</span>}
      </button>
    </th>
  );
}
