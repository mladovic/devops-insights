import { differenceInCalendarDays, isValid } from "date-fns";
import type { RawTask } from "./calculateTaskMetrics";

export interface ThroughputMetrics {
  /** Completed tasks in the last 7 days from referenceDate */
  weeklyThroughput: number;
  /** Completed tasks in the last 30 days from referenceDate */
  monthlyThroughput: number;
  throughputLast14Days: number;
  throughputLast30Days: number;
  throughputLast60Days: number;
}

export function calculateThroughputMetrics(
  tasks: RawTask[],
  referenceDate: Date
): ThroughputMetrics {
  let weekly = 0;
  let monthly = 0;
  let last14 = 0;
  let last30 = 0;
  let last60 = 0;

  for (const task of tasks) {
    const closedStr = task["Closed Date"];
    if (!closedStr) continue;

    const closedDate = new Date(closedStr);
    if (!isValid(closedDate)) continue;

    const diff = differenceInCalendarDays(referenceDate, closedDate);
    if (diff < 0) continue; // ignore future dates

    if (diff < 7) weekly++;
    if (diff < 30) monthly++;
    if (diff < 14) last14++;
    if (diff < 30) last30++;
    if (diff < 60) last60++;
  }

  return {
    weeklyThroughput: weekly,
    monthlyThroughput: monthly,
    throughputLast14Days: last14,
    throughputLast30Days: last30,
    throughputLast60Days: last60,
  };
}
