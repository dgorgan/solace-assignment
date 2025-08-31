"use client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function SearchBar({ value, onChange, onReset }:{
  value:string; onChange:(v:string)=>void; onReset:()=>void;
}) {
  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <Input value={value} onChange={(e)=>onChange(e.target.value)}
             placeholder="Search by name, city, specialty, phone…" />
      <Button onClick={onReset} className="btn-ghost sm:w-auto">Reset</Button>
    </div>
  );
}
