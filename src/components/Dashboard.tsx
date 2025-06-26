import { useMemo, useState } from "react";
import MetricsSummary, {
  type MetricsSummaryProps,
} from "@/components/MetricsSummary";
import DashboardTaskList, {
  type TaskItem,
} from "@/components/DashboardTaskList";
import DashboardInProgressList from "@/components/DashboardInProgressList";
import DashboardNotStartedList from "@/components/DashboardNotStartedList";
import TaskTableVisibilityToggle from "@/components/TaskTableVisibilityToggle";
import DateRangeFilter from "@/components/filters/DateRangeFilter";
import { usePersistentDateRange } from "@/hooks/usePersistentDateRange";
import { filterTasksByDateRange } from "@/lib/filterTasksByDateRange";
import { useSettings } from "@/context/SettingsContext";
import { calculateTaskMetrics, type RawTask } from "@/lib/calculateTaskMetrics";
import { calculateOverallMetrics } from "@/lib/calculateOverallMetrics";
import { aggregateMetricsByType } from "@/lib/aggregateMetricsByType";
import { calculateThroughputMetrics } from "@/lib/calculateThroughputMetrics";
import type { SortDirection } from "@/lib/sortTasks";
import { classifyTasksByStatus } from "@/lib/classifyTasksByStatus";
import { usePersistentTaskTableVisibility } from "@/hooks/usePersistentTaskTableVisibility";

export interface DashboardProps {
  rawTasks: RawTask[];
}

export default function Dashboard({ rawTasks }: DashboardProps) {
  const { config } = useSettings();

  const { range: selectedRange, setRange: setSelectedRange } =
    usePersistentDateRange();

  const { visibility, setVisibility } = usePersistentTaskTableVisibility();

  const [sortColumn, setSortColumn] = useState<string>("ClosedDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const normalizedTasks = useMemo(
    () =>
      rawTasks.map((t) => ({
        ID: t.ID,
        Title: (t as any).Title,
        WorkItemType: (t as any)["Work Item Type"],
        Assignee: (t as any)["Assigned To"] ?? null,
        CreatedDate: (t as any)["Created Date"],
        ActivatedDate: (t as any)["Activated Date"] ?? undefined,
        ClosedDate: (t as any)["Closed Date"] ?? undefined,
      })),
    [rawTasks]
  );

  const { completedTasks, inProgressTasks, notStartedTasks } = useMemo(() => {
    const { completedTasks, inProgressTasks, notStartedTasks } =
      classifyTasksByStatus(normalizedTasks);
    return { completedTasks, inProgressTasks, notStartedTasks };
  }, [normalizedTasks]);

  const { completedTasks: filteredCompleted } = useMemo(
    () => filterTasksByDateRange(completedTasks, selectedRange),
    [completedTasks, selectedRange]
  );

  const openTasks = useMemo(
    () => [...inProgressTasks, ...notStartedTasks],
    [inProgressTasks, notStartedTasks]
  );

  const completedRawTasks: RawTask[] = useMemo(
    () =>
      filteredCompleted.map((task) => {
        const { ClosedDate, ...rest } = task;
        return { ...rest, "Closed Date": ClosedDate } as RawTask;
      }),
    [filteredCompleted]
  );

  const openRawTasks: RawTask[] = useMemo(
    () =>
      openTasks.map((task) => {
        const { ClosedDate, ...rest } = task;
        return { ...rest, "Closed Date": ClosedDate } as unknown as RawTask;
      }),
    [openTasks]
  );

  const filteredRawTasks: RawTask[] = useMemo(
    () => [...completedRawTasks, ...openRawTasks],
    [completedRawTasks, openRawTasks]
  );

  const completedMetrics = useMemo(
    () => calculateTaskMetrics(completedRawTasks),
    [completedRawTasks]
  );

  const inProgressMetrics = useMemo(
    () => calculateTaskMetrics(openRawTasks),
    [openRawTasks]
  );

  const metricsData: MetricsSummaryProps = useMemo(
    () => ({
      overall: calculateOverallMetrics({
        completedTasks: completedMetrics,
        incompleteCount: inProgressMetrics.length,
      }),
      byType: aggregateMetricsByType({
        completedTasks: completedMetrics,
        incompleteTasks: inProgressMetrics,
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

  const completedTaskData: TaskItem[] = useMemo(
    () =>
      filteredCompleted.map((task, idx) => ({
        ID: Number(task.ID),
        Title: task.Title,
        WorkItemType: task.WorkItemType,
        Assignee: task.Assignee ?? null,
        CycleTimeDays: completedMetrics[idx].CycleTimeDays,
        LeadTimeDays: completedMetrics[idx].LeadTimeDays,
        ClosedDate: task.ClosedDate ?? undefined,
      })),
    [filteredCompleted, completedMetrics]
  );

  const inProgressListData = useMemo(
    () =>
      inProgressTasks.map((task) => ({
        ID: task.ID,
        Title: task.Title,
        WorkItemType: task.WorkItemType,
        Assignee: task.Assignee ?? null,
        ActivatedDate: task.ActivatedDate,
      })),
    [inProgressTasks]
  );

  const notStartedListData = useMemo(
    () =>
      notStartedTasks.map((task) => ({
        ID: task.ID,
        Title: task.Title,
        WorkItemType: task.WorkItemType,
        Assignee: task.Assignee ?? null,
        CreatedDate: task.CreatedDate,
      })),
    [notStartedTasks]
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
        <div className="flex flex-wrap gap-2">
          <DateRangeFilter onRangeChange={setSelectedRange} />
          <TaskTableVisibilityToggle onToggleChange={setVisibility} />
        </div>
      </div>

      {hasMetricsData && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Metrics Overview</h2>
          <MetricsSummary {...metricsData} />
        </section>
      )}

      {visibility.completed && completedTaskData.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Completed Tasks</h2>
          <DashboardTaskList
            tasks={completedTaskData}
            selectedDateRange={selectedRange}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
          />
        </section>
      )}

      {visibility.inProgress && inProgressListData.length > 0 && (
        <section className="space-y-4">
          <DashboardInProgressList tasks={inProgressListData} />
        </section>
      )}

      {visibility.notStarted && notStartedListData.length > 0 && (
        <section className="space-y-4">
          <DashboardNotStartedList tasks={notStartedListData} />
        </section>
      )}
    </div>
  );
}
