import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTheme } from "../../src/context/ThemeContext";
import { useTasks, Task, Priority } from "../../src/context/TaskContext";
import { TaskItem } from "../../src/components/TaskItem";
import { AddTaskModal } from "../../src/components/AddTaskModal";
import { EmptyState } from "../../src/components/EmptyState";
import { spacing, fontSize, fontWeight } from "../../src/constants/theme";

type StatusFilter = "all" | "pending" | "done";
type PriorityFilter = "all" | Priority;

export default function TasksScreen() {
  const { colors } = useTheme();
  const { tasks, categories } = useTasks();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [priority, setPriority] = useState<PriorityFilter>("all");
  const [category, setCategory] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks
      .filter((t) => {
        if (status === "pending" && t.completed) return false;
        if (status === "done" && !t.completed) return false;
        if (priority !== "all" && t.priority !== priority) return false;
        if (category !== "all" && t.categoryId !== category) return false;
        if (q && !t.title.toLowerCase().includes(q) && !(t.notes || "").toLowerCase().includes(q))
          return false;
        return true;
      })
      .sort((a, b) =>
        a.completed === b.completed
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : a.completed
          ? 1
          : -1
      );
  }, [tasks, query, status, priority, category]);

  const openEdit = (t: Task) => {
    setEditing(t);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const Chip = ({
    label,
    active,
    onPress,
    testID,
  }: {
    label: string;
    active: boolean;
    onPress: () => void;
    testID?: string;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        {
          borderColor: colors.border,
          backgroundColor: active ? colors.textPrimary : "transparent",
        },
      ]}
      testID={testID}
    >
      <Text
        style={[
          styles.chipText,
          { color: active ? colors.background : colors.textPrimary },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={{ flex: 1, maxWidth: 960, width: "100%", alignSelf: "center" }}>
        <Animated.View entering={FadeInDown.duration(360)} style={styles.headerWrap}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.eyebrow, { color: colors.textSecondary }]}>ALL TASKS</Text>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                Inbox.
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setModalOpen(true)}
              style={[styles.addBtn, { backgroundColor: colors.accentPrimary, borderColor: colors.border }]}
              testID="add-task-btn"
            >
              <Ionicons name="add" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View
            style={[
              styles.searchBox,
              { borderColor: colors.border, backgroundColor: colors.surfaceSecondary },
            ]}
          >
            <Ionicons name="search" size={16} color={colors.textSecondary} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search tasks..."
              placeholderTextColor={colors.textSecondary}
              style={[styles.searchInput, { color: colors.textPrimary }]}
              testID="search-input"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")} testID="clear-search">
                <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersRow}
          >
            <Chip label="ALL" active={status === "all"} onPress={() => setStatus("all")} testID="filter-status-all" />
            <Chip label="PENDING" active={status === "pending"} onPress={() => setStatus("pending")} testID="filter-status-pending" />
            <Chip label="DONE" active={status === "done"} onPress={() => setStatus("done")} testID="filter-status-done" />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Chip label="ANY" active={priority === "all"} onPress={() => setPriority("all")} testID="filter-priority-all" />
            <Chip label="HIGH" active={priority === "high"} onPress={() => setPriority("high")} testID="filter-priority-high" />
            <Chip label="MED" active={priority === "medium"} onPress={() => setPriority("medium")} testID="filter-priority-medium" />
            <Chip label="LOW" active={priority === "low"} onPress={() => setPriority("low")} testID="filter-priority-low" />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Chip
              label="ALL CATEGORIES"
              active={category === "all"}
              onPress={() => setCategory("all")}
              testID="filter-cat-all"
            />
            {categories.map((c) => (
              <Chip
                key={c.id}
                label={c.name.toUpperCase()}
                active={category === c.id}
                onPress={() => setCategory(c.id)}
                testID={`filter-cat-${c.id}`}
              />
            ))}
          </ScrollView>

          <Text style={[styles.count, { color: colors.textSecondary }]}>
            {filtered.length} {filtered.length === 1 ? "TASK" : "TASKS"}
          </Text>
        </Animated.View>

        {filtered.length === 0 ? (
          <View style={{ padding: spacing.lg }}>
            <EmptyState
              icon="search-outline"
              title={tasks.length === 0 ? "No tasks yet" : "Nothing matches"}
              subtitle={
                tasks.length === 0
                  ? "Add a task to begin."
                  : "Try clearing filters or search."
              }
            />
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(t) => t.id}
            renderItem={({ item, index }) => (
              <TaskItem task={item} index={index} onEdit={openEdit} />
            )}
            contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <AddTaskModal visible={modalOpen} onClose={closeModal} editingTask={editing} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerWrap: { padding: spacing.lg, gap: spacing.md },
  headerRow: { flexDirection: "row", alignItems: "flex-end", gap: spacing.md },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "700",
    marginBottom: 4,
  },
  title: {
    fontSize: 44,
    fontWeight: fontWeight.black,
    letterSpacing: -2,
    lineHeight: 46,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.md,
    paddingVertical: 0,
  },
  filtersRow: {
    flexDirection: "row",
    gap: 6,
    paddingRight: 24,
    alignItems: "center",
  },
  chip: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 10,
    letterSpacing: 1.4,
    fontWeight: "700",
  },
  divider: {
    width: 1,
    height: 18,
    marginHorizontal: 4,
  },
  count: {
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "700",
  },
});
