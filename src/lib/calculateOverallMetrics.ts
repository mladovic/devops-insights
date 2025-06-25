export interface OverallMetrics {
  overallAverageCycleTimeDays: number;
  overallAverageLeadTimeDays: number;
  totalCompletedTasks: number;
  totalIncompleteTasks: number;
}

import type { TaskMetrics } from "./calculateTaskMetrics";

export function calculateOverallMetrics(taskMetrics: TaskMetrics[]): OverallMetrics {
  let totalCycleTime = 0;
  let totalLeadTime = 0;
  let completed = 0;
  let incomplete = 0;

  for (const metric of taskMetrics) {
    if (metric.Status === "Complete") {
      completed += 1;
      if (typeof metric.CycleTimeDays === "number") {
        totalCycleTime += metric.CycleTimeDays;
      }
      if (typeof metric.LeadTimeDays === "number") {
        totalLeadTime += metric.LeadTimeDays;
      }
    } else {
      incomplete += 1;
    }
  }

  const overallAverageCycleTimeDays =
    completed > 0 ? totalCycleTime / completed : 0;
  const overallAverageLeadTimeDays =
    completed > 0 ? totalLeadTime / completed : 0;

  return {
    overallAverageCycleTimeDays,
    overallAverageLeadTimeDays,
    totalCompletedTasks: completed,
    totalIncompleteTasks: incomplete,
  };
}
