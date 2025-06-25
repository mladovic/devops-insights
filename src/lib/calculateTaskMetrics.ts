import { differenceInCalendarDays, parseISO, isValid } from "date-fns";

export interface RawTask {
  ID: number | string;
  "Work Item Type": string;
  "Created Date": string;
  "Activated Date"?: string;
  "Closed Date"?: string;
}

export interface TaskMetrics {
  ID: number;
  WorkItemType: string;
  CycleTimeDays?: number;
  LeadTimeDays?: number;
  Status: "Complete" | "Incomplete";
}

export function calculateTaskMetrics(tasks: RawTask[]): TaskMetrics[] {
  return tasks.map((task) => {
    const id = Number(task.ID);
    const workItemType = task["Work Item Type"];
    const closedDateStr = task["Closed Date"];

    if (!closedDateStr) {
      return {
        ID: id,
        WorkItemType: workItemType,
        Status: "Incomplete",
      };
    }

    const closedDate = parseISO(closedDateStr);
    if (!isValid(closedDate)) {
      return {
        ID: id,
        WorkItemType: workItemType,
        Status: "Incomplete",
      };
    }

    const createdDate = parseISO(task["Created Date"]);
    const activatedDateStr = task["Activated Date"] ?? task["Created Date"];
    const activatedDate = parseISO(activatedDateStr);

    const cycleTimeDays = isValid(activatedDate)
      ? differenceInCalendarDays(closedDate, activatedDate)
      : undefined;
    const leadTimeDays = isValid(createdDate)
      ? differenceInCalendarDays(closedDate, createdDate)
      : undefined;

    return {
      ID: id,
      WorkItemType: workItemType,
      CycleTimeDays: cycleTimeDays,
      LeadTimeDays: leadTimeDays,
      Status: "Complete",
    };
  });
}
