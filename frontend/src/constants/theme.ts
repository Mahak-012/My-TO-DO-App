// Modern Professional theme tokens — Light + Dark
// Refined palette with sophisticated indigo accent, rounded surfaces, soft shadows.

export const lightColors = {
  background: "#F7F8FA",
  surface: "#FFFFFF",
  surfaceSecondary: "#F1F3F7",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  textInverse: "#FFFFFF",
  border: "#E2E8F0",
  borderSoft: "#EEF1F6",
  accentPrimary: "#4F46E5",   // indigo-600
  accentSecondary: "#0EA5E9", // sky-500
  priorityHigh: "#EF4444",
  priorityMedium: "#F59E0B",
  priorityLow: "#10B981",
  shadow: "rgba(15, 23, 42, 0.08)",
};

export const darkColors = {
  background: "#0B1020",
  surface: "#11172B",
  surfaceSecondary: "#161D33",
  textPrimary: "#F1F5F9",
  textSecondary: "#94A3B8",
  textInverse: "#0B1020",
  border: "#222B45",
  borderSoft: "#1A2138",
  accentPrimary: "#6366F1",   // indigo-500
  accentSecondary: "#38BDF8", // sky-400
  priorityHigh: "#F87171",
  priorityMedium: "#FBBF24",
  priorityLow: "#34D399",
  shadow: "rgba(0, 0, 0, 0.45)",
};

export type ThemeColors = typeof lightColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 40,
};

export const radii = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  pill: 999,
};

export const fontSize = {
  xs: 11,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  display: 32,
};

export const fontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  black: "800" as const,
};
