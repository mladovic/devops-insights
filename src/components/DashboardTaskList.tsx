import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RCAIndicator from "@/components/RCAIndicator";
import SortableTableHeader from "@/components/SortableTableHeader";
import { checkRCAIndicator } from "@/lib/checkRCAIndicator";
import { filterTasksByDateRange, type DateRangeOption } from "@/lib/filterTasksByDateRange";
import { sortTasks, type SortDirection } from "@/lib/sortTasks";
import { useSettings } from "@/context/SettingsContext";
import { useMemo, useState } from "react";

export interface TaskItem {
  ID: number;
  Title: string;
  WorkItemType: string;
  Assignee: string | null;
  CycleTimeDays?: number;
  LeadTimeDays?: number;
  ClosedDate?: string;
}

export interface DashboardTaskListProps {
  tasks: TaskItem[];
  selectedDateRange: DateRangeOption;
}

export default function DashboardTaskList({
  tasks,
  selectedDateRange,
}: DashboardTaskListProps) {
  if (!tasks || tasks.length === 0) {
    return null;
  }

  const { config } = useSettings();
  const [sortColumn, setSortColumn] = useState<string>("ClosedDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

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

  const handleSortChange = (columnKey: string, direction: SortDirection) => {
    setSortColumn(columnKey);
    setSortDirection(direction);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <SortableTableHeader onSortChange={handleSortChange} />
          <TableBody>
            {sortedCompleted.length > 0 && (
              <>
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={7} className="font-semibold">
                    Completed
                  </TableCell>
                </TableRow>
                {sortedCompleted.map((task) => {
                  const isRCA =
                    typeof task.CycleTimeDays === "number" &&
                    checkRCAIndicator(task.CycleTimeDays, "M", config);

                  return (
                    <TableRow key={`c-${task.ID}`}>
                      <TableCell>{task.ID}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {task.Title}
                          <RCAIndicator isRCA={isRCA} />
                        </div>
                      </TableCell>
                      <TableCell>{task.WorkItemType}</TableCell>
                      <TableCell>{task.Assignee ?? "-"}</TableCell>
                      <TableCell>
                        {typeof task.CycleTimeDays === "number"
                          ? task.CycleTimeDays
                          : "-"}
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
                  <TableCell colSpan={7} className="font-semibold">
                    In Progress
                  </TableCell>
                </TableRow>
                {sortedInProgress.map((task) => {
                  const isRCA =
                    typeof task.CycleTimeDays === "number" &&
                    checkRCAIndicator(task.CycleTimeDays, "M", config);

                  return (
                    <TableRow key={`p-${task.ID}`}>
                      <TableCell>{task.ID}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {task.Title}
                          <RCAIndicator isRCA={isRCA} />
                        </div>
                      </TableCell>
                      <TableCell>{task.WorkItemType}</TableCell>
                      <TableCell>{task.Assignee ?? "-"}</TableCell>
                      <TableCell>
                        {typeof task.CycleTimeDays === "number"
                          ? task.CycleTimeDays
                          : "-"}
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
