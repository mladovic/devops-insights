import { useEffect, useState } from "react";

export interface TaskTableVisibility {
  completed: boolean;
  inProgress: boolean;
  notStarted: boolean;
}

const STORAGE_KEY = "taskTableVisibility";

export function usePersistentTaskTableVisibility(
  initial: TaskTableVisibility = { completed: true, inProgress: true, notStarted: true },
) {
  const [visibility, setVisibility] = useState<TaskTableVisibility>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as Partial<TaskTableVisibility>;
          return {
            completed:
              typeof parsed.completed === "boolean" ? parsed.completed : initial.completed,
            inProgress:
              typeof parsed.inProgress === "boolean" ? parsed.inProgress : initial.inProgress,
            notStarted:
              typeof parsed.notStarted === "boolean" ? parsed.notStarted : initial.notStarted,
          } as TaskTableVisibility;
        }
      } catch {
        // ignore errors
      }
    }
    return initial;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visibility));
    } catch {
      // ignore errors
    }
  }, [visibility]);

  return { visibility, setVisibility } as const;
}
