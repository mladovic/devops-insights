export const defaultThresholdConfig = {
  thresholds: {
    XS: { lower: 1, upper: 2 },
    S: { lower: 2, upper: 4 },
    M: { lower: 3, upper: 6 },
    L: { lower: 5, upper: 10 },
    XL: { lower: 8, upper: 15 },
  },
  rcaDeviationPercentage: 20,
};

export type ThresholdConfig = typeof defaultThresholdConfig;
