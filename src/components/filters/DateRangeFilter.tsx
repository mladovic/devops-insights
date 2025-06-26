"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePersistentDateRange } from "@/hooks/usePersistentDateRange";

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
  const { range, setRange } = usePersistentDateRange();

  useEffect(() => {
    onRangeChange?.(range);
  }, [range, onRangeChange]);

  const handleChange = (value: string) => {
    const val = value as DateRangeOption;
    setRange(val);
  };

  return (
    <Select value={range} onValueChange={handleChange}>
      <SelectTrigger
        className={cn(
          "border-input focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:border-ring dark:bg-input/30 w-full h-9 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs md:text-sm",
          className,
        )}
      >
        <SelectValue>{range}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
