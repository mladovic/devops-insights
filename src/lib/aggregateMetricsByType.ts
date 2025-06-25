export interface AggregatedMetrics {
  [WorkItemType: string]: {
    averageCycleTimeDays: number;
    averageLeadTimeDays: number;
    completedTasks: number;
    incompleteTasks: number;
  };
}

import type { TaskMetrics } from "./calculateTaskMetrics";

export interface FilteredTaskMetrics {
  completedTasks: TaskMetrics[];
  inProgressTasks: TaskMetrics[];
}

export function aggregateMetricsByType({
  completedTasks,
  inProgressTasks,
}: FilteredTaskMetrics): AggregatedMetrics {
  const result: AggregatedMetrics = {};

  const allMetrics = [...completedTasks, ...inProgressTasks];

  for (const metric of allMetrics) {
    const type = metric.WorkItemType;
    if (!result[type]) {
      result[type] = {
        averageCycleTimeDays: 0,
        averageLeadTimeDays: 0,
        completedTasks: 0,
        incompleteTasks: 0,
      };
    }

    if (metric.Status === "Complete") {
      result[type].completedTasks += 1;
      if (typeof metric.CycleTimeDays === "number") {
        result[type].averageCycleTimeDays += metric.CycleTimeDays;
      }
      if (typeof metric.LeadTimeDays === "number") {
        result[type].averageLeadTimeDays += metric.LeadTimeDays;
      }
    } else {
      result[type].incompleteTasks += 1;
    }
  }

  for (const type of Object.keys(result)) {
    const data = result[type];
    if (data.completedTasks > 0) {
      data.averageCycleTimeDays = data.averageCycleTimeDays / data.completedTasks;
      data.averageLeadTimeDays = data.averageLeadTimeDays / data.completedTasks;
    } else {
      data.averageCycleTimeDays = 0;
      data.averageLeadTimeDays = 0;
    }
  }

  return result;
}
