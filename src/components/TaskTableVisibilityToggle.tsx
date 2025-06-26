"use client";

import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

export interface TaskTableVisibility {
  completed: boolean;
  inProgress: boolean;
  notStarted: boolean;
}

export interface TaskTableVisibilityToggleProps {
  onToggleChange?: (state: TaskTableVisibility) => void;
  className?: string;
}

const STORAGE_KEY = "taskTableVisibility";

export default function TaskTableVisibilityToggle({
  onToggleChange,
  className,
}: TaskTableVisibilityToggleProps) {
  const [state, setState] = useState<TaskTableVisibility>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as Partial<TaskTableVisibility>;
          return {
            completed:
              typeof parsed.completed === "boolean" ? parsed.completed : true,
            inProgress:
              typeof parsed.inProgress === "boolean" ? parsed.inProgress : true,
            notStarted:
              typeof parsed.notStarted === "boolean" ? parsed.notStarted : true,
          };
        }
      } catch {
        // ignore JSON parse errors
      }
    }
    return { completed: true, inProgress: true, notStarted: true };
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore write errors
    }
    onToggleChange?.(state);
  }, [state, onToggleChange]);

  const toggle = (key: keyof TaskTableVisibility) => {
    setState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <ToggleGroup type="multiple" className={cn(className)}>
      <ToggleGroupItem
        value="completed"
        pressed={state.completed}
        onPressedChange={() => toggle("completed")}
      >
        Completed
      </ToggleGroupItem>
      <ToggleGroupItem
        value="inProgress"
        pressed={state.inProgress}
        onPressedChange={() => toggle("inProgress")}
      >
        In Progress
      </ToggleGroupItem>
      <ToggleGroupItem
        value="notStarted"
        pressed={state.notStarted}
        onPressedChange={() => toggle("notStarted")}
      >
        Not Started
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

