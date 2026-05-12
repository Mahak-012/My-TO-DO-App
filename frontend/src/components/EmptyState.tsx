import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { useTheme } from "../context/ThemeContext";
import { spacing, fontSize, fontWeight } from "../constants/theme";

interface Props {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}

export const EmptyState: React.FC<Props> = ({ icon = "albums-outline", title, subtitle }) => {
  const { colors } = useTheme();
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={[styles.container, { borderColor: colors.border }]}
      testID="empty-state"
    >
      <View style={[styles.iconBox, { borderColor: colors.border }]}>
        <Ionicons name={icon} size={28} color={colors.textPrimary} />
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    borderWidth: 1,
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: fontSize.sm,
    textAlign: "center",
    maxWidth: 320,
    lineHeight: 20,
  },
});
