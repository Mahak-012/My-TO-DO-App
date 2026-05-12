import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useTheme } from "../../src/context/ThemeContext";
import { useTasks } from "../../src/context/TaskContext";
import { spacing, fontSize, fontWeight } from "../../src/constants/theme";

const confirmAction = (title: string, message: string, onYes: () => void) => {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined" && window.confirm(`${title}\n\n${message}`)) onYes();
  } else {
    Alert.alert(title, message, [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: onYes },
    ]);
  }
};

export default function SettingsScreen() {
  const { colors, mode, setMode } = useTheme();
  const { tasks, clearAll } = useTasks();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top"]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { maxWidth: 720, alignSelf: "center", width: "100%" }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(360)}>
          <Text style={[styles.eyebrow, { color: colors.textSecondary }]}>PREFERENCES</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Settings.</Text>
        </Animated.View>

        {/* Theme */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(380)}
          style={[styles.card, { borderColor: colors.border, backgroundColor: colors.surface }]}
        >
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>APPEARANCE</Text>
          <View style={styles.themeRow}>
            {(["light", "dark"] as const).map((m) => {
              const active = mode === m;
              return (
                <TouchableOpacity
                  key={m}
                  onPress={() => setMode(m)}
                  style={[
                    styles.themeOption,
                    {
                      borderColor: colors.border,
                      backgroundColor: active ? colors.textPrimary : "transparent",
                    },
                  ]}
                  testID={`theme-${m}`}
                >
                  <Ionicons
                    name={m === "light" ? "sunny-outline" : "moon-outline"}
                    size={20}
                    color={active ? colors.background : colors.textPrimary}
                  />
                  <Text
                    style={[
                      styles.themeText,
                      { color: active ? colors.background : colors.textPrimary },
                    ]}
                  >
                    {m.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* About */}
        <Animated.View
          entering={FadeInUp.delay(180).duration(380)}
          style={[styles.card, { borderColor: colors.border, backgroundColor: colors.surface }]}
        >
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>ABOUT</Text>
          <Text style={[styles.aboutTitle, { color: colors.textPrimary }]}>
            Tasks · A portfolio piece
          </Text>
          <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
            Built with Expo, React Native, Reanimated and Expo Router. Runs on iOS, Android & Web
            from a single codebase. All data is stored locally on this device.
          </Text>
          <View style={[styles.metaRow, { borderTopColor: colors.borderSoft }]}>
            <View style={styles.metaCell}>
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>TASKS</Text>
              <Text style={[styles.metaVal, { color: colors.textPrimary }]}>{tasks.length}</Text>
            </View>
            <View style={[styles.metaCell, { borderLeftColor: colors.borderSoft, borderLeftWidth: 1 }]}>
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>STORAGE</Text>
              <Text style={[styles.metaVal, { color: colors.textPrimary }]}>LOCAL</Text>
            </View>
            <View style={[styles.metaCell, { borderLeftColor: colors.borderSoft, borderLeftWidth: 1 }]}>
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>VERSION</Text>
              <Text style={[styles.metaVal, { color: colors.textPrimary }]}>1.0.0</Text>
            </View>
          </View>
        </Animated.View>

        {/* Danger */}
        <Animated.View
          entering={FadeInUp.delay(240).duration(380)}
          style={[styles.card, { borderColor: colors.priorityHigh, backgroundColor: colors.surface }]}
        >
          <Text style={[styles.fieldLabel, { color: colors.priorityHigh }]}>DANGER ZONE</Text>
          <Text style={[styles.aboutText, { color: colors.textSecondary, marginTop: 4 }]}>
            This will permanently delete every task on this device.
          </Text>
          <TouchableOpacity
            onPress={() =>
              confirmAction(
                "Clear all tasks?",
                "This action cannot be undone.",
                () => clearAll()
              )
            }
            style={[
              styles.dangerBtn,
              { borderColor: colors.priorityHigh, backgroundColor: colors.priorityHigh },
            ]}
            testID="clear-all-btn"
          >
            <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
            <Text style={styles.dangerText}>CLEAR ALL TASKS</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: spacing.lg, gap: spacing.md, paddingBottom: 100 },
  eyebrow: { fontSize: 10, letterSpacing: 2, fontWeight: "700", marginBottom: 4 },
  title: { fontSize: 44, fontWeight: fontWeight.black, letterSpacing: -2, lineHeight: 46 },
  card: { borderWidth: 1, padding: spacing.md, marginTop: spacing.md },
  fieldLabel: { fontSize: 10, letterSpacing: 2, fontWeight: "700", marginBottom: 12 },
  themeRow: { flexDirection: "row", gap: 8 },
  themeOption: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  themeText: { fontSize: 12, fontWeight: "800", letterSpacing: 1.5 },
  aboutTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  aboutText: { fontSize: fontSize.sm, lineHeight: 20 },
  metaRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    marginTop: spacing.md,
    paddingTop: spacing.md,
  },
  metaCell: { flex: 1, alignItems: "center", paddingVertical: 4 },
  metaLabel: { fontSize: 9, letterSpacing: 1.6, fontWeight: "700" },
  metaVal: { fontSize: 18, fontWeight: "800", marginTop: 4, letterSpacing: -0.5 },
  dangerBtn: {
    marginTop: 14,
    borderWidth: 1,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  dangerText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800", letterSpacing: 1.5 },
});
