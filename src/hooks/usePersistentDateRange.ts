import { useEffect, useState } from "react";
import type { DateRangeOption } from "@/components/filters/DateRangeFilter";

const STORAGE_KEY = "selectedDateRange";

export function usePersistentDateRange(
  initial: DateRangeOption = "Last month",
) {
  const [range, setRange] = useState<DateRangeOption>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY) as DateRangeOption | null;
        if (stored) {
          return stored;
        }
      } catch {
        // ignore parse errors
      }
    }
    return initial;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, range);
    } catch {
      // ignore write errors
    }
  }, [range]);

  return { range, setRange } as const;
}
