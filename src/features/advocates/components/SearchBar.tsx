"use client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function SearchBar({ value, onChange, onReset }:{
  value:string; onChange:(v:string)=>void; onReset:()=>void;
}) {
  return (
    <div className="max-w-none mx-auto px-6 sm:px-12 mt-4">
      <div className="max-w-[90vw] mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Input value={value} onChange={(e)=>onChange(e.target.value)}
               placeholder="Search by name, city, specialty, phone…" />
        <Button onClick={onReset} className="btn-primary sm:w-auto">Reset</Button>
      </div>
    </div>
  );
}
