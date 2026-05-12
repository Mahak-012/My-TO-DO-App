import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useTheme } from "../../src/context/ThemeContext";
import { useTasks } from "../../src/context/TaskContext";
import { spacing, fontSize, fontWeight } from "../../src/constants/theme";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export default function StatsScreen() {
  const { colors } = useTheme();
  const { tasks, categories } = useTasks();
  const { width } = useWindowDimensions();

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.completed).length;
    const pending = total - done;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);

    // last 7 days completion counts
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return d;
    });
    const counts = days.map((d) => {
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      return tasks.filter((t) => {
        if (!t.completedAt) return false;
        const c = new Date(t.completedAt);
        return c >= d && c < next;
      }).length;
    });

    // streak (consecutive days w/ at least one done, ending today/yesterday)
    let streak = 0;
    for (let i = counts.length - 1; i >= 0; i--) {
      if (counts[i] > 0) streak += 1;
      else break;
    }

    // by priority
    const byPriority = {
      high: tasks.filter((t) => t.priority === "high").length,
      medium: tasks.filter((t) => t.priority === "medium").length,
      low: tasks.filter((t) => t.priority === "low").length,
    };

    // by category
    const byCat = categories.map((c) => ({
      ...c,
      total: tasks.filter((t) => t.categoryId === c.id).length,
      done: tasks.filter((t) => t.categoryId === c.id && t.completed).length,
    }));

    return { total, done, pending, pct, days, counts, streak, byPriority, byCat };
  }, [tasks, categories]);

  const maxCount = Math.max(1, ...stats.counts);
  const chartWidth = Math.min(width - spacing.lg * 2, 920 - spacing.lg * 2);
  const barWidth = (chartWidth - 6 * 8) / 7;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top"]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { maxWidth: 960, alignSelf: "center", width: "100%" }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(360)}>
          <Text style={[styles.eyebrow, { color: colors.textSecondary }]}>ANALYTICS</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Insights.</Text>
        </Animated.View>

        {/* Hero numbers */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(380)}
          style={[styles.heroCard, { borderColor: colors.border, backgroundColor: colors.surface }]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.heroLabel, { color: colors.textSecondary }]}>COMPLETION RATE</Text>
            <Text style={[styles.heroValue, { color: colors.accentPrimary }]}>{stats.pct}%</Text>
            <Text style={[styles.heroSub, { color: colors.textSecondary }]}>
              {stats.done} of {stats.total} done
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.heroLabel, { color: colors.textSecondary }]}>STREAK</Text>
            <Text style={[styles.heroValue, { color: colors.textPrimary }]}>
              {stats.streak}
              <Text style={{ fontSize: 20 }}>d</Text>
            </Text>
            <Text style={[styles.heroSub, { color: colors.textSecondary }]}>
              consecutive days
            </Text>
          </View>
        </Animated.View>

        {/* Bar Chart */}
        <Animated.View
          entering={FadeInUp.delay(180).duration(380)}
          style={[styles.card, { borderColor: colors.border, backgroundColor: colors.surface }]}
        >
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>LAST 7 DAYS</Text>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            {stats.counts.reduce((a, b) => a + b, 0)} tasks completed
          </Text>

          <View style={[styles.chart, { width: chartWidth }]}>
            {stats.counts.map((c, i) => {
              const h = (c / maxCount) * 140;
              const day = stats.days[i];
              const isToday = i === stats.counts.length - 1;
              return (
                <View key={i} style={{ alignItems: "center", gap: 6, width: barWidth }}>
                  <Text style={[styles.barCount, { color: colors.textSecondary }]}>{c}</Text>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: Math.max(2, h),
                        width: barWidth,
                        backgroundColor: isToday ? colors.accentPrimary : colors.textPrimary,
                      },
                    ]}
                  />
                  <Text style={[styles.barLabel, { color: colors.textSecondary }]}>
                    {DAY_LABELS[day.getDay()]}
                  </Text>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* Priority breakdown */}
        <Animated.View
          entering={FadeInUp.delay(240).duration(380)}
          style={[styles.card, { borderColor: colors.border, backgroundColor: colors.surface }]}
        >
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>BY PRIORITY</Text>
          <View style={{ gap: 10, marginTop: 8 }}>
            {[
              { k: "high", label: "HIGH", color: colors.priorityHigh, v: stats.byPriority.high },
              { k: "medium", label: "MEDIUM", color: colors.priorityMedium, v: stats.byPriority.medium },
              { k: "low", label: "LOW", color: colors.priorityLow, v: stats.byPriority.low },
            ].map((r) => {
              const max = Math.max(1, stats.byPriority.high, stats.byPriority.medium, stats.byPriority.low);
              const w = (r.v / max) * 100;
              return (
                <View key={r.k}>
                  <View style={styles.barRowHead}>
                    <Text style={[styles.barRowLabel, { color: colors.textPrimary }]}>{r.label}</Text>
                    <Text style={[styles.barRowVal, { color: colors.textSecondary }]}>{r.v}</Text>
                  </View>
                  <View style={[styles.hbarBg, { backgroundColor: colors.borderSoft }]}>
                    <View style={[styles.hbarFill, { width: `${w}%`, backgroundColor: r.color }]} />
                  </View>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* By Category */}
        <Animated.View
          entering={FadeInUp.delay(300).duration(380)}
          style={[styles.card, { borderColor: colors.border, backgroundColor: colors.surface }]}
        >
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>BY CATEGORY</Text>
          <View style={{ gap: 10, marginTop: 8 }}>
            {stats.byCat.length === 0 ? (
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>No categories.</Text>
            ) : (
              stats.byCat.map((c) => {
                const max = Math.max(1, ...stats.byCat.map((x) => x.total));
                const w = (c.total / max) * 100;
                return (
                  <View key={c.id}>
                    <View style={styles.barRowHead}>
                      <Text style={[styles.barRowLabel, { color: colors.textPrimary }]}>
                        {c.name.toUpperCase()}
                      </Text>
                      <Text style={[styles.barRowVal, { color: colors.textSecondary }]}>
                        {c.done}/{c.total}
                      </Text>
                    </View>
                    <View style={[styles.hbarBg, { backgroundColor: colors.borderSoft }]}>
                      <View style={[styles.hbarFill, { width: `${w}%`, backgroundColor: c.color }]} />
                    </View>
                  </View>
                );
              })
            )}
          </View>
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
  heroCard: {
    flexDirection: "row",
    borderWidth: 1,
    padding: spacing.md,
    marginTop: spacing.md,
    gap: spacing.md,
  },
  divider: { width: 1, alignSelf: "stretch" },
  heroLabel: { fontSize: 10, letterSpacing: 2, fontWeight: "700" },
  heroValue: { fontSize: 56, fontWeight: "900", letterSpacing: -3, lineHeight: 60, marginTop: 4 },
  heroSub: { fontSize: 11, letterSpacing: 1.2, marginTop: 4 },
  card: { borderWidth: 1, padding: spacing.md },
  fieldLabel: { fontSize: 10, letterSpacing: 2, fontWeight: "700" },
  cardTitle: { fontSize: 22, fontWeight: "800", letterSpacing: -1, marginTop: 6, marginBottom: 16 },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    minHeight: 180,
  },
  bar: {},
  barCount: { fontSize: 10, fontWeight: "700" },
  barLabel: { fontSize: 10, letterSpacing: 1, fontWeight: "700" },
  barRowHead: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  barRowLabel: { fontSize: 11, letterSpacing: 1.4, fontWeight: "700" },
  barRowVal: { fontSize: 11, fontWeight: "700" },
  hbarBg: { height: 8, width: "100%" },
  hbarFill: { height: 8 },
});
