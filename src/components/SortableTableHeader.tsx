"use client";

import { useCallback } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import {
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import type { SortDirection } from "@/lib/sortTasks";

export interface SortableTableHeaderProps {
  sortColumn: string;
  sortDirection: SortDirection;
  onSortChange?: (columnKey: string, sortDirection: SortDirection) => void;
  className?: string;
}

interface ColumnDef {
  key: string;
  label: string;
}

const COLUMNS: ColumnDef[] = [
  { key: "ID", label: "ID" },
  { key: "Title", label: "Title" },
  { key: "WorkItemType", label: "Work Item Type" },
  { key: "Assignee", label: "Assignee" },
  { key: "CycleTimeDays", label: "Cycle Time" },
  { key: "LeadTimeDays", label: "Lead Time" },
  { key: "ClosedDate", label: "Closed Date" },
];

export default function SortableTableHeader({
  sortColumn,
  sortDirection,
  onSortChange,
  className,
}: SortableTableHeaderProps) {

  const handleClick = useCallback(
    (key: string) => {
      let newColumn = key;
      let newDirection: SortDirection = "asc";

      if (sortColumn === key) {
        if (sortDirection === "asc") {
          newDirection = "desc";
        } else if (sortDirection === "desc") {
          newColumn = "ClosedDate";
          newDirection = "desc";
        }
      }

      onSortChange?.(newColumn, newDirection);
    },
    [sortColumn, sortDirection, onSortChange],
  );

  const renderIndicator = (key: string) => {
    if (sortColumn !== key) return null;
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3" />
    );
  };

  return (
    <TableHeader className={className}>
      <TableRow>
        {COLUMNS.map((col) => (
          <TableHead
            key={col.key}
            className="cursor-pointer select-none"
            onClick={() => handleClick(col.key)}
          >
            <span className="flex items-center">
              {col.label}
              {renderIndicator(col.key)}
            </span>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
