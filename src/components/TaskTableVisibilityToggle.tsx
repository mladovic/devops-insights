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
  visibility?: TaskTableVisibility;
  onToggleChange?: (state: TaskTableVisibility) => void;
  className?: string;
}

const STORAGE_KEY = "taskTableVisibility";

export default function TaskTableVisibilityToggle({
  visibility,
  onToggleChange,
  className,
}: TaskTableVisibilityToggleProps) {
  console.log(
    "TaskTableVisibilityToggle rendered with visibility:",
    visibility
  );

  const resolveVisibility = () => {
    const values = [];
    if (visibility?.completed) {
      values.push("completed");
    }
    if (visibility?.inProgress) {
      values.push("inProgress");
    }
    if (visibility?.notStarted) {
      values.push("notStarted");
    }
    return values;
  };

  const toggle = (key: keyof TaskTableVisibility) => {
    const value = visibility?.[key];
    onToggleChange?.((prev) => ({
      ...prev,
      [key]: !value,
    }));
  };

  return (
    <ToggleGroup
      type="multiple"
      className={cn(className)}
      value={resolveVisibility()}
    >
      <ToggleGroupItem value="completed" onClick={() => toggle("completed")}>
        Completed
      </ToggleGroupItem>
      <ToggleGroupItem value="inProgress" onClick={() => toggle("inProgress")}>
        In Progress
      </ToggleGroupItem>
      <ToggleGroupItem value="notStarted" onClick={() => toggle("notStarted")}>
        Not Started
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
