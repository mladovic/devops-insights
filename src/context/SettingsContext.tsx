"use client";

import { createContext, useContext } from "react";
import { usePersistentThresholdConfig } from "@/hooks/usePersistentThresholdConfig";
import type { ThresholdConfig } from "@/lib/defaultThresholdConfig";

interface SettingsContextValue {
  config: ThresholdConfig;
  updateConfig: (value: ThresholdConfig) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { getConfig, updateConfig } = usePersistentThresholdConfig();
  const config = getConfig();

  return (
    <SettingsContext.Provider value={{ config, updateConfig }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
