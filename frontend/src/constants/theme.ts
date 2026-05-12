// Swiss / High-Contrast theme tokens — Light + Dark
export const lightColors = {
  background: "#F9F9F7",
  surface: "#FFFFFF",
  surfaceSecondary: "#F0F0EE",
  textPrimary: "#111111",
  textSecondary: "#555555",
  textInverse: "#FFFFFF",
  border: "#111111",
  borderSoft: "#E0E0E0",
  accentPrimary: "#FF3B30",
  accentSecondary: "#007AFF",
  priorityHigh: "#FF3B30",
  priorityMedium: "#FF9500",
  priorityLow: "#34C759",
  shadow: "#000000",
};

export const darkColors = {
  background: "#0A0A0A",
  surface: "#141414",
  surfaceSecondary: "#1C1C1C",
  textPrimary: "#F5F5F5",
  textSecondary: "#A0A0A0",
  textInverse: "#0A0A0A",
  border: "#333333",
  borderSoft: "#1F1F1F",
  accentPrimary: "#E2FF3D",
  accentSecondary: "#0A84FF",
  priorityHigh: "#FF453A",
  priorityMedium: "#FF9F0A",
  priorityLow: "#32D74B",
  shadow: "#E2FF3D",
};

export type ThemeColors = typeof lightColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  none: 0,
  sm: 2,
  md: 4,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 40,
  display: 56,
};

export const fontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  black: "900" as const,
};
