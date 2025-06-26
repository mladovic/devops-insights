export const ThresholdConfig = {
  thresholds: {
    XS: 2,
    S: 7,
    M: 14,
    L: 30,
    XL: 60,
  },
  rcaDeviationPercentage: 20,
};

export type ThresholdConfig = typeof ThresholdConfig;
