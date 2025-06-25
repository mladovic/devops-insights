"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "selectedDateRange";

const OPTIONS = [
  "Last week",
  "Last two weeks",
  "Last month",
  "Last three months",
  "Last six months",
  "Last year",
  "All",
] as const;

export type DateRangeOption = (typeof OPTIONS)[number];

export interface DateRangeFilterProps {
  onRangeChange?: (range: DateRangeOption) => void;
  className?: string;
}

export default function DateRangeFilter({
  onRangeChange,
  className,
}: DateRangeFilterProps) {
  const [range, setRange] = useState<DateRangeOption>("Last month");

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as DateRangeOption | null;
      if (stored && OPTIONS.includes(stored)) {
        setRange(stored);
        onRangeChange?.(stored);
        return;
      }
    } catch {
      // ignore JSON parse errors
    }
    onRangeChange?.("Last month");
  }, [onRangeChange]);

  // Persist to localStorage whenever range changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, range);
    } catch {
      // ignore write errors
    }
  }, [range]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as DateRangeOption;
    setRange(value);
    onRangeChange?.(value);
  };

  return (
    <select
      className={cn(
        "border-input focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:border-ring dark:bg-input/30 w-full h-9 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs md:text-sm",
        className,
      )}
      value={range}
      onChange={handleChange}
    >
      {OPTIONS.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
