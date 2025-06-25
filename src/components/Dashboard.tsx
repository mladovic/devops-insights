import { useMemo } from "react";
import MetricsSummary, { type MetricsSummaryProps } from "@/components/MetricsSummary";
import DashboardTaskList, { type TaskItem } from "@/components/DashboardTaskList";
import { useSettings } from "@/context/SettingsContext";
import { calculateTaskMetrics, type RawTask } from "@/lib/calculateTaskMetrics";
import { calculateOverallMetrics } from "@/lib/calculateOverallMetrics";
import { aggregateMetricsByType } from "@/lib/aggregateMetricsByType";
import { calculateThroughputMetrics } from "@/lib/calculateThroughputMetrics";

export interface DashboardProps {
  rawTasks: RawTask[];
}

export default function Dashboard({ rawTasks }: DashboardProps) {
  const { config } = useSettings();

  const taskMetrics = useMemo(() => calculateTaskMetrics(rawTasks), [rawTasks]);

  const metricsData: MetricsSummaryProps = useMemo(
    () => ({
      overall: calculateOverallMetrics(taskMetrics),
      byType: aggregateMetricsByType(taskMetrics),
      throughput: calculateThroughputMetrics(rawTasks, new Date()),
    }),
    [taskMetrics, rawTasks, config],
  );

  const taskData: TaskItem[] = useMemo(
    () =>
      rawTasks.map((task, idx) => ({
        ID: Number(task.ID),
        Title: (task as any).Title,
        WorkItemType: (task as any)["Work Item Type"],
        Assignee: (task as any)["Assigned To"] ?? null,
        CycleTimeDays: taskMetrics[idx].CycleTimeDays,
        LeadTimeDays: taskMetrics[idx].LeadTimeDays,
      })),
    [rawTasks, taskMetrics, config],
  );

  const hasMetricsData =
    metricsData && Object.keys(metricsData.byType ?? {}).length > 0;

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-semibold">Project Dashboard</h1>

      {hasMetricsData && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Metrics Overview</h2>
          <MetricsSummary {...metricsData} />
        </section>
      )}

      {taskData && taskData.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Task List</h2>
          <DashboardTaskList taskData={taskData} />
        </section>
      )}
    </div>
  );
}
