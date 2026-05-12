import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/context/ThemeContext";
import { useTasks } from "../../src/context/TaskContext";
import { StatCard } from "../../src/components/StatCard";
import { TaskItem } from "../../src/components/TaskItem";
import { AddTaskModal } from "../../src/components/AddTaskModal";
import { EmptyState } from "../../src/components/EmptyState";
import { spacing, fontSize, fontWeight } from "../../src/constants/theme";

export default function DashboardScreen() {
  const { colors, mode, toggleTheme } = useTheme();
  const { tasks } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 720;

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.completed).length;
    const pending = total - done;
    const high = tasks.filter((t) => !t.completed && t.priority === "high").length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, pending, high, pct };
  }, [tasks]);

  const recent = useMemo(
    () =>
      [...tasks]
        .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1))
        .slice(0, 5),
    [tasks]
  );

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { maxWidth: 960, alignSelf: "center", width: "100%" }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(380)} style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.eyebrow, { color: colors.textSecondary }]}>
              {today.toUpperCase()}
            </Text>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {stats.pending > 0 ? `${stats.pending} tasks` : "All clear."}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {stats.pending > 0
                ? `${stats.high} high priority · ${stats.done} done today`
                : "You're caught up. Take a breath."}
            </Text>
          </View>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.themeBtn, { borderColor: colors.border }]}
            testID="theme-toggle-btn"
          >
            <Ionicons
              name={mode === "dark" ? "sunny-outline" : "moon-outline"}
              size={18}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Hero stat */}
        <View style={[styles.row, { gap: spacing.sm }]}>
          <StatCard
            label="COMPLETION"
            value={`${stats.pct}%`}
            accent={colors.accentPrimary}
            big
            delay={60}
            testID="stat-completion"
          />
          <View style={{ flex: 1, gap: spacing.sm }}>
            <StatCard label="TOTAL" value={stats.total} delay={120} testID="stat-total" />
            <StatCard label="DONE" value={stats.done} delay={180} testID="stat-done" />
          </View>
        </View>

        <View style={[styles.row, { gap: spacing.sm }]}>
          <StatCard label="PENDING" value={stats.pending} delay={240} testID="stat-pending" />
          <StatCard
            label="HIGH PRIORITY"
            value={stats.high}
            accent={colors.priorityHigh}
            delay={300}
            testID="stat-high"
          />
        </View>

        {/* CTA */}
        <TouchableOpacity
          onPress={() => setModalOpen(true)}
          style={[
            styles.cta,
            { backgroundColor: colors.accentPrimary, borderColor: colors.border },
          ]}
          testID="dashboard-add-task-btn"
        >
          <Ionicons name="add" size={22} color="#FFFFFF" />
          <Text style={styles.ctaText}>NEW TASK</Text>
        </TouchableOpacity>

        {/* Recent tasks */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>RECENT</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/tasks")} testID="view-all-btn">
            <Text style={[styles.sectionLink, { color: colors.accentPrimary }]}>VIEW ALL →</Text>
          </TouchableOpacity>
        </View>

        {recent.length === 0 ? (
          <EmptyState
            icon="rocket-outline"
            title="Start your first task"
            subtitle="Tap NEW TASK to add something to your list. Everything is saved locally on your device."
          />
        ) : (
          <View>
            {recent.map((t, i) => (
              <TaskItem key={t.id} task={t} index={i} />
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <AddTaskModal visible={modalOpen} onClose={() => setModalOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: spacing.lg, gap: spacing.md, paddingBottom: 100 },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "700",
    marginBottom: 6,
  },
  title: {
    fontSize: 44,
    fontWeight: fontWeight.black,
    letterSpacing: -2,
    lineHeight: 46,
  },
  subtitle: {
    marginTop: 6,
    fontSize: fontSize.sm,
  },
  themeBtn: {
    width: 44,
    height: 44,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  row: { flexDirection: "row" },
  cta: {
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
    marginTop: spacing.sm,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 13,
    letterSpacing: 2,
    fontWeight: "700",
  },
  sectionLink: {
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: "700",
  },
});
