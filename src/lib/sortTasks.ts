export type SortDirection = "asc" | "desc";

export interface GenericTask {
  [key: string]: any;
}

function getComparableValue(task: GenericTask, key: string): number | string | Date | null {
  const value = task[key];

  switch (key) {
    case "ID":
    case "CycleTimeDays":
    case "LeadTimeDays":
      if (value === undefined || value === null || value === "") return null;
      const num = typeof value === "number" ? value : Number(value);
      return Number.isNaN(num) ? null : num;
    case "ClosedDate":
      if (!value) return null;
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    default:
      if (value === undefined || value === null) return "";
      return String(value).toLowerCase();
  }
}

export function sortTasks<T extends GenericTask>(
  tasks: T[],
  columnKey: string,
  sortDirection: SortDirection,
): T[] {
  const items = tasks.map((task, idx) => ({ task, idx }));

  items.sort((a, b) => {
    const aVal = getComparableValue(a.task, columnKey);
    const bVal = getComparableValue(b.task, columnKey);

    let result = 0;
    if (aVal === null && bVal === null) {
      result = 0;
    } else if (aVal === null) {
      result = -1;
    } else if (bVal === null) {
      result = 1;
    } else if (aVal instanceof Date && bVal instanceof Date) {
      result = aVal.getTime() - bVal.getTime();
    } else if (typeof aVal === "number" && typeof bVal === "number") {
      result = aVal - bVal;
    } else {
      result = String(aVal).localeCompare(String(bVal));
    }

    if (result === 0) {
      result = a.idx - b.idx;
    }

    return sortDirection === "asc" ? result : -result;
  });

  return items.map((item) => item.task);
}
