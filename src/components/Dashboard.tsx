import { useMemo, useState } from "react";
import MetricsSummary, {
  type MetricsSummaryProps,
} from "@/components/MetricsSummary";
import DashboardTaskList, {
  type TaskItem,
} from "@/components/DashboardTaskList";
import DateRangeFilter from "@/components/filters/DateRangeFilter";
import { usePersistentDateRange } from "@/hooks/usePersistentDateRange";
import { filterTasksByDateRange } from "@/lib/filterTasksByDateRange";
import { useSettings } from "@/context/SettingsContext";
import { calculateTaskMetrics, type RawTask } from "@/lib/calculateTaskMetrics";
import { calculateOverallMetrics } from "@/lib/calculateOverallMetrics";
import { aggregateMetricsByType } from "@/lib/aggregateMetricsByType";
import { calculateThroughputMetrics } from "@/lib/calculateThroughputMetrics";
import type { SortDirection } from "@/lib/sortTasks";

export interface DashboardProps {
  rawTasks: RawTask[];
}

export default function Dashboard({ rawTasks }: DashboardProps) {
  const { config } = useSettings();

  const { range: selectedRange, setRange: setSelectedRange } =
    usePersistentDateRange();

  const [sortColumn, setSortColumn] = useState<string>("ClosedDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const tasksForFilter = useMemo(
    () =>
      rawTasks.map((t) => ({
        ...t,
        ClosedDate: (t as any)["Closed Date"] ?? undefined,
      })),
    [rawTasks]
  );

  const { completedTasks, inProgressTasks } = useMemo(
    () => filterTasksByDateRange(tasksForFilter, selectedRange),
    [tasksForFilter, selectedRange]
  );

  const filteredTasks = useMemo(
    () => [...completedTasks, ...inProgressTasks],
    [completedTasks, inProgressTasks]
  );

  const completedRawTasks: RawTask[] = useMemo(
    () =>
      completedTasks.map((task) => {
        const { ClosedDate, ...rest } = task;
        return { ...rest, "Closed Date": ClosedDate } as RawTask;
      }),
    [completedTasks]
  );

  const inProgressRawTasks: RawTask[] = useMemo(
    () =>
      inProgressTasks.map((task) => {
        const { ClosedDate, ...rest } = task;
        return { ...rest, "Closed Date": ClosedDate } as RawTask;
      }),
    [inProgressTasks]
  );

  const filteredRawTasks: RawTask[] = useMemo(
    () => [...completedRawTasks, ...inProgressRawTasks],
    [completedRawTasks, inProgressRawTasks]
  );

  const completedMetrics = useMemo(
    () => calculateTaskMetrics(completedRawTasks),
    [completedRawTasks]
  );

  const inProgressMetrics = useMemo(
    () => calculateTaskMetrics(inProgressRawTasks),
    [inProgressRawTasks]
  );

  const taskMetrics = useMemo(
    () => [...completedMetrics, ...inProgressMetrics],
    [completedMetrics, inProgressMetrics]
  );

  const metricsData: MetricsSummaryProps = useMemo(
    () => ({
      overall: calculateOverallMetrics({
        completedTasks: completedMetrics,
        inProgressTasks: inProgressMetrics,
      }),
      byType: aggregateMetricsByType({
        completedTasks: completedMetrics,
        inProgressTasks: inProgressMetrics,
      }),
      throughput: calculateThroughputMetrics(filteredRawTasks, new Date()),
      selectedDateRange: selectedRange,
    }),
    [
      completedMetrics,
      inProgressMetrics,
      filteredRawTasks,
      selectedRange,
      config,
    ]
  );

  const taskData: TaskItem[] = useMemo(
    () =>
      filteredTasks.map((task, idx) => ({
        ID: Number(task.ID),
        Title: (task as any).Title,
        WorkItemType: (task as any)["Work Item Type"],
        Assignee: (task as any)["Assigned To"] ?? null,
        CycleTimeDays: taskMetrics[idx].CycleTimeDays,
        LeadTimeDays: taskMetrics[idx].LeadTimeDays,
        ClosedDate: task.ClosedDate ?? undefined,
      })),
    [filteredTasks, taskMetrics, config]
  );

  const handleSortChange = (column: string, direction: SortDirection) => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  const hasMetricsData =
    metricsData && Object.keys(metricsData.byType ?? {}).length > 0;

  return (
    <div className="p-4 space-y-8">
      <div className="flex flex-col gap-2 items-start">
        <h1 className="text-2xl font-semibold">Project Dashboard</h1>
        <DateRangeFilter onRangeChange={setSelectedRange} />
      </div>

      {hasMetricsData && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Metrics Overview</h2>
          <MetricsSummary {...metricsData} />
        </section>
      )}

      {taskData && taskData.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Task List</h2>
          <DashboardTaskList
            tasks={taskData}
            selectedDateRange={selectedRange}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
          />
        </section>
      )}
    </div>
  );
}
