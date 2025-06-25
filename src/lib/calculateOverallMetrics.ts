export interface OverallMetrics {
  overallAverageCycleTimeDays: number;
  overallAverageLeadTimeDays: number;
  totalCompletedTasks: number;
  totalIncompleteTasks: number;
}

import type { TaskMetrics } from "./calculateTaskMetrics";

export interface FilteredTaskMetrics {
  completedTasks: TaskMetrics[];
  inProgressTasks: TaskMetrics[];
}

export function calculateOverallMetrics({
  completedTasks,
  inProgressTasks,
}: FilteredTaskMetrics): OverallMetrics {
  let totalCycleTime = 0;
  let totalLeadTime = 0;

  const completed = completedTasks.length;
  const incomplete = inProgressTasks.length;

  for (const metric of completedTasks) {
    if (typeof metric.CycleTimeDays === "number") {
      totalCycleTime += metric.CycleTimeDays;
    }
    if (typeof metric.LeadTimeDays === "number") {
      totalLeadTime += metric.LeadTimeDays;
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
