"use client";

import { createContext, useContext, useState } from "react";

interface SettingsContextValue {
  rcaDeviationPercentage: number;
  setRcaDeviationPercentage: (value: number) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [rcaDeviationPercentage, setRcaDeviationPercentage] = useState(20);

  return (
    <SettingsContext.Provider value={{ rcaDeviationPercentage, setRcaDeviationPercentage }}>
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
