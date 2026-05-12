import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useTheme } from "../context/ThemeContext";
import { spacing, fontSize, fontWeight } from "../constants/theme";

interface Props {
  label: string;
  value: string | number;
  accent?: string;
  delay?: number;
  testID?: string;
  big?: boolean;
}

export const StatCard: React.FC<Props> = ({ label, value, accent, delay = 0, testID, big }) => {
  const { colors } = useTheme();
  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(380).springify().damping(16)}
      style={[
        styles.card,
        { borderColor: colors.border, backgroundColor: colors.surface, flex: big ? 2 : 1 },
      ]}
      testID={testID}
    >
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <Text
        style={[
          styles.value,
          {
            color: accent || colors.textPrimary,
            fontSize: big ? 64 : 40,
          },
        ]}
      >
        {value}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: spacing.md,
    minHeight: 110,
    justifyContent: "space-between",
  },
  label: {
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "700",
  },
  value: {
    fontWeight: fontWeight.black,
    letterSpacing: -2,
    lineHeight: 64,
  },
});
