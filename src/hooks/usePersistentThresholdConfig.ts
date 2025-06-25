import { useEffect, useState } from "react";
import {
  defaultThresholdConfig,
  type ThresholdConfig,
} from "@/lib/defaultThresholdConfig";

const STORAGE_KEY = "thresholdConfig";

export function usePersistentThresholdConfig() {
  const [config, setConfig] = useState<ThresholdConfig>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored) as ThresholdConfig;
        }
      } catch {
        // ignore JSON parse errors
      }
    }
    return defaultThresholdConfig;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // ignore write errors
    }
  }, [config]);

  const getConfig = () => config;

  const updateConfig = (newConfig: ThresholdConfig) => {
    setConfig(newConfig);
  };

  return {
    getConfig,
    updateConfig,
  };
}
