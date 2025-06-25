export interface Task {
  ID: number | string;
  Title: string;
  WorkItemType: string;
  Assignee?: string | null;
  CreatedDate: string;
  ActivatedDate?: string;
  ClosedDate?: string;
}

export interface ClassifiedTasks {
  completedTasks: Task[];
  inProgressTasks: Task[];
  notStartedTasks: Task[];
}

export function classifyTasksByStatus(tasks: Task[]): ClassifiedTasks {
  const completedTasks: Task[] = [];
  const inProgressTasks: Task[] = [];
  const notStartedTasks: Task[] = [];

  for (const task of tasks) {
    if (task.ClosedDate) {
      completedTasks.push(task);
    } else if (task.ActivatedDate) {
      inProgressTasks.push(task);
    } else {
      notStartedTasks.push(task);
    }
  }

  return { completedTasks, inProgressTasks, notStartedTasks };
}
