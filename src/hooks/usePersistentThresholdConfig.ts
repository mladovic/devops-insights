import { useEffect, useState } from "react";
import { ThresholdConfig } from "@/lib/defaultThresholdConfig";
import type {
  ThresholdConfig as ThresholdConfigType,
} from "@/lib/defaultThresholdConfig";

const STORAGE_KEY = "thresholdConfig";

export function usePersistentThresholdConfig() {
  const [config, setConfig] = useState<ThresholdConfigType>(ThresholdConfig);

  // Load any previously stored configuration on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setConfig(JSON.parse(stored) as ThresholdConfigType);
      }
    } catch {
      // ignore JSON parse errors
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // ignore write errors
    }
  }, [config]);

  const getConfig = () => config;

  const updateConfig = (newConfig: ThresholdConfigType) => {
    setConfig(newConfig);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
      } catch {
        // ignore write errors
      }
    }
  };

  return {
    getConfig,
    updateConfig,
  };
}
