import { differenceInCalendarDays, isValid } from "date-fns";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface NotStartedTask {
  ID: number | string;
  Title: string;
  WorkItemType: string;
  Assignee?: string | null;
  CreatedDate?: string;
}

export interface DashboardNotStartedListProps {
  tasks: NotStartedTask[];
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (!isValid(date)) return "-";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function calcDaysSinceCreated(dateStr?: string): string | number {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (!isValid(date)) return "-";
  return differenceInCalendarDays(new Date(), date);
}

export default function DashboardNotStartedList({
  tasks,
}: DashboardNotStartedListProps) {
  if (!tasks || tasks.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Not Started Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Work Item Type</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Days Since Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.ID}>
                <TableCell>{task.ID}</TableCell>
                <TableCell>{task.Title}</TableCell>
                <TableCell>{task.WorkItemType}</TableCell>
                <TableCell>{task.Assignee ?? "-"}</TableCell>
                <TableCell>{formatDate(task.CreatedDate)}</TableCell>
                <TableCell>{calcDaysSinceCreated(task.CreatedDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
