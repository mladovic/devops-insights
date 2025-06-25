import { differenceInCalendarDays, isValid } from "date-fns";

export interface Task {
  ClosedDate?: string;
  [key: string]: any;
}

export type DateRangeOption =
  | "Last week"
  | "Last two weeks"
  | "Last month"
  | "Last three months"
  | "Last six months"
  | "Last year"
  | "All";

export interface FilteredTasks {
  completedTasks: Task[];
  inProgressTasks: Task[];
}

function rangeToDays(range: DateRangeOption): number {
  switch (range) {
    case "Last week":
      return 7;
    case "Last two weeks":
      return 14;
    case "Last month":
      return 30;
    case "Last three months":
      return 90;
    case "Last six months":
      return 180;
    case "Last year":
      return 365;
    case "All":
    default:
      return Infinity;
  }
}

export function filterTasksByDateRange(
  tasks: Task[],
  selectedRange: DateRangeOption,
  referenceDate: Date = new Date(),
): FilteredTasks {
  const completedTasks: Task[] = [];
  const inProgressTasks: Task[] = [];

  const days = rangeToDays(selectedRange);

  for (const task of tasks) {
    if (!task.ClosedDate) {
      inProgressTasks.push(task);
      continue;
    }

    const closedDate = new Date(task.ClosedDate);
    if (!isValid(closedDate)) {
      inProgressTasks.push(task);
      continue;
    }

    const diff = differenceInCalendarDays(referenceDate, closedDate);
    if (diff < 0) {
      continue; // ignore future dates
    }

    if (diff <= days) {
      completedTasks.push(task);
    }
  }

  return { completedTasks, inProgressTasks };
}
