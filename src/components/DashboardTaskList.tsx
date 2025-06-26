import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SortableTableHeader from "@/components/SortableTableHeader";
import { getCycleTimePercentageColor } from "@/lib/getCycleTimePercentageColor";
import { filterTasksByDateRange, type DateRangeOption } from "@/lib/filterTasksByDateRange";
import { sortTasks, type SortDirection } from "@/lib/sortTasks";
import { useSettings } from "@/context/SettingsContext";
import { useMemo } from "react";

export interface TaskItem {
  ID: number;
  Title: string;
  WorkItemType: string;
  Assignee: string | null;
  CycleTimeDays?: number;
  LeadTimeDays?: number;
  TShirtSize?: import("@/lib/checkRCAIndicator").TShirtSize;
  CycleTimePercentage?: number | "No reference";
  ClosedDate?: string;
}

export interface DashboardTaskListProps {
  tasks: TaskItem[];
  selectedDateRange: DateRangeOption;
  sortColumn: string;
  sortDirection: SortDirection;
  onSortChange: (columnKey: string, direction: SortDirection) => void;
}

export default function DashboardTaskList({
  tasks,
  selectedDateRange,
  sortColumn,
  sortDirection,
  onSortChange,
}: DashboardTaskListProps) {
  if (!tasks || tasks.length === 0) {
    return null;
  }

  const { config } = useSettings();

  const { completedTasks, inProgressTasks } = useMemo(
    () => filterTasksByDateRange(tasks, selectedDateRange),
    [tasks, selectedDateRange],
  );

  const sortedCompleted = useMemo(
    () => sortTasks(completedTasks, sortColumn, sortDirection),
    [completedTasks, sortColumn, sortDirection],
  );

  const sortedInProgress = useMemo(
    () => sortTasks(inProgressTasks, sortColumn, sortDirection),
    [inProgressTasks, sortColumn, sortDirection],
  );


  return (
    <Card>
      <CardHeader>
        <CardTitle>Task List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <SortableTableHeader
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSortChange={onSortChange}
          />
          <TableBody>
            {sortedCompleted.length > 0 && (
              <>
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={8} className="font-semibold">
                    Completed
                  </TableCell>
                </TableRow>
                {sortedCompleted.map((task) => {
                  return (
                    <TableRow key={`c-${task.ID}`}>
                      <TableCell>{task.ID}</TableCell>
                      <TableCell>{task.Title}</TableCell>
                      <TableCell>{task.WorkItemType}</TableCell>
                      <TableCell>{task.Assignee ?? "-"}</TableCell>
                      <TableCell>
                        {typeof task.CycleTimeDays === "number"
                          ? task.CycleTimeDays
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {task.CycleTimePercentage !== undefined ? (
                          <span
                            className={(() => {
                              const color = getCycleTimePercentageColor(
                                task.CycleTimePercentage,
                                config.rcaDeviationPercentage,
                              );
                              if (color === "black") return "text-black";
                              return `text-${color}-500`;
                            })()}
                          >
                            {task.CycleTimePercentage}
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {typeof task.LeadTimeDays === "number"
                          ? task.LeadTimeDays
                          : "-"}
                      </TableCell>
                      <TableCell>{task.ClosedDate ?? "-"}</TableCell>
                    </TableRow>
                  );
                })}
              </>
            )}

            {sortedInProgress.length > 0 && (
              <>
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={8} className="font-semibold">
                    In Progress
                  </TableCell>
                </TableRow>
                {sortedInProgress.map((task) => {
                  return (
                    <TableRow key={`p-${task.ID}`}>
                      <TableCell>{task.ID}</TableCell>
                      <TableCell>{task.Title}</TableCell>
                      <TableCell>{task.WorkItemType}</TableCell>
                      <TableCell>{task.Assignee ?? "-"}</TableCell>
                      <TableCell>
                        {typeof task.CycleTimeDays === "number"
                          ? task.CycleTimeDays
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {task.CycleTimePercentage !== undefined ? (
                          <span
                            className={(() => {
                              const color = getCycleTimePercentageColor(
                                task.CycleTimePercentage,
                                config.rcaDeviationPercentage,
                              );
                              if (color === "black") return "text-black";
                              return `text-${color}-500`;
                            })()}
                          >
                            {task.CycleTimePercentage}
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {typeof task.LeadTimeDays === "number"
                          ? task.LeadTimeDays
                          : "-"}
                      </TableCell>
                      <TableCell>{task.ClosedDate ?? "-"}</TableCell>
                    </TableRow>
                  );
                })}
              </>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
