import { differenceInCalendarDays, isValid } from "date-fns";

export interface RawTask {
  ID: number | string;
  WorkItemType: string;
  CreatedDate: string;
  ActivatedDate?: string;
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
    const workItemType = task["WorkItemType"];
    const closedDateStr = task["Closed Date"];

    if (!closedDateStr) {
      return {
        ID: id,
        WorkItemType: workItemType,
        Status: "Incomplete",
      };
    }

    const closedDate = new Date(closedDateStr);
    if (!isValid(closedDate)) {
      return {
        ID: id,
        WorkItemType: workItemType,
        Status: "Incomplete",
      };
    }

    const createdDate = new Date(task["CreatedDate"]);
    const activatedDateStr = task["ActivatedDate"] ?? task["CreatedDate"];
    const activatedDate = new Date(activatedDateStr);

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
