"use client";
import type { Advocate } from "@/features/advocates/types";
import { formatUSPhone } from "@/features/advocates/normalize";
import { SortHeader } from "./SortHeader";

type Sort="lastName"|"city"|"yearsOfExperience"; 
type Dir="asc"|"desc";

export function AdvocatesTable({
  rows,total,page,pageSize,sort,dir,hasMore,isLoading,
  onSortChange,onPageChange,onPageSizeChange
}:{
  rows:Advocate[]; total:number; page:number; pageSize:number; sort:Sort; dir:Dir; hasMore:boolean; isLoading?:boolean;
  onSortChange:(s:Sort)=>void; onPageChange:(p:number)=>void; onPageSizeChange:(n:number)=>void;
}){
  return (
    <div className="max-w-none mx-auto px-3 sm:px-6 py-3 sm:py-6" data-section="advocates-table">
      <div className="card p-2 sm:p-4 max-w-[90vw] mx-auto">
        <div className="mb-3 flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="text-sm">
            Page size
            <select className="ml-2 border rounded px-2 py-1 focus-brand"
              value={pageSize} onChange={(e)=>onPageSizeChange(Number(e.target.value))}>
              <option value={25}>25</option><option value={50}>50</option><option value={100}>100</option>
            </select>
          </label>
          <div className="sm:ml-auto text-sm text-gray-600">
            Showing {rows.length} of {total} (Page {page} of {Math.max(1, Math.ceil(total/Math.max(pageSize,1)))})
          </div>
        </div>

        <div className="border rounded overflow-x-auto relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center">
              <div className="flex items-center gap-2 text-primary">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                <span className="text-sm font-medium">Updating...</span>
              </div>
            </div>
          )}
          <div className="max-h-[520px] overflow-y-auto">
            <table className="w-full min-w-[1000px] border-collapse">
              <colgroup>
                <col className="w-[100px]" />
                <col className="w-[120px]" />
                <col className="w-[120px]" />
                <col className="w-[80px]" />
                <col className="w-[300px]" />
                <col className="w-[80px]" />
                <col className="w-[120px]" />
              </colgroup>
            <thead className="sticky top-0 table-header shadow-sm z-10">
              <tr>
                <th className="text-left py-3 px-3 font-semibold">First</th>
                <SortHeader label="Last" col="lastName" active={sort==="lastName"} dir={dir} onClick={()=>onSortChange("lastName")} />
                <SortHeader label="City" col="city" active={sort==="city"} dir={dir} onClick={()=>onSortChange("city")} />
                <th className="text-left py-3 px-3 font-semibold">Degree</th>
                <th className="text-left py-3 px-3 font-semibold">Specialties</th>
                <SortHeader label="Years" col="yearsOfExperience" active={sort==="yearsOfExperience"} dir={dir}
                            onClick={()=>onSortChange("yearsOfExperience")} />
                <th className="text-left py-3 px-3 font-semibold">Phone</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(a => (
                <tr key={a.id} className="odd:bg-gray-50 hover:bg-gray-100 transition-colors">
                  <td className="py-2 px-3 truncate">{a.firstName}</td>
                  <td className="py-2 px-3 truncate">{a.lastName}</td>
                  <td className="py-2 px-3 truncate">{a.city}</td>
                  <td className="py-2 px-3 truncate">{a.degree}</td>
                  <td className="py-2 px-3">
                    <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto sm:max-h-none sm:overflow-visible">
                      {Array.isArray(a.specialties) && a.specialties.map((s,i)=>(<span key={i} className="chip">{s}</span>))}
                    </div>
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-gold font-semibold">{a.yearsOfExperience}</td>
                  <td className="py-2 px-3 truncate">
                    <a href={`tel:${a.phoneNumber}`} className="text-gray-700 hover:text-primary transition-colors">
                      {formatUSPhone(a.phoneNumber)}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4 justify-center">
          <button 
            onClick={()=>onPageChange(Math.max(1, page-1))} 
            disabled={page<=1} 
            className="btn-secondary focus-brand disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm font-medium px-4 py-2">Page {page}</span>
          <button 
            onClick={()=>onPageChange(page+1)} 
            disabled={!hasMore} 
            className="btn-secondary focus-brand disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
