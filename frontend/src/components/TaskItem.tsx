import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeIn,
  Layout,
  FadeOut,
} from "react-native-reanimated";
import { useTheme } from "../context/ThemeContext";
import { useTasks, Task } from "../context/TaskContext";
import { spacing, fontSize, fontWeight, radii } from "../constants/theme";

interface Props {
  task: Task;
  index: number;
  onEdit?: (task: Task) => void;
}

const priorityLabel = (p: Task["priority"]) => p[0].toUpperCase() + p.slice(1);

export const TaskItem: React.FC<Props> = ({ task, index, onEdit }) => {
  const { colors } = useTheme();
  const { toggleTask, deleteTask, categories } = useTasks();
  const progress = useSharedValue(task.completed ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(task.completed ? 1 : 0, { duration: 220 });
  }, [task.completed, progress]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value * 0.5,
    textDecorationLine: progress.value > 0.5 ? ("line-through" as const) : ("none" as const),
  }));

  const checkScale = useSharedValue(0);
  useEffect(() => {
    checkScale.value = withSpring(task.completed ? 1 : 0, { damping: 12, stiffness: 220 });
  }, [task.completed, checkScale]);

  const checkmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));

  const category = categories.find((c) => c.id === task.categoryId);
  const priorityColor =
    task.priority === "high"
      ? colors.priorityHigh
      : task.priority === "medium"
      ? colors.priorityMedium
      : colors.priorityLow;

  return (
    <Animated.View
      entering={FadeIn.delay(index * 40).duration(280)}
      exiting={FadeOut.duration(180)}
      layout={Layout.springify().damping(18).stiffness(180)}
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
      testID={`task-item-${task.id}`}
    >
      {/* Left priority strip */}
      <View style={[styles.priorityStrip, { backgroundColor: priorityColor }]} />

      <View style={styles.body}>
        <View style={styles.topRow}>
          <Pressable
            onPress={() => toggleTask(task.id)}
            style={[
              styles.checkbox,
              {
                borderColor: colors.border,
                backgroundColor: task.completed ? colors.accentPrimary : "transparent",
              },
            ]}
            testID={`task-checkbox-${task.id}`}
            hitSlop={10}
          >
            <Animated.View style={checkmarkStyle}>
              <Ionicons name="checkmark-sharp" size={18} color="#FFFFFF" />
            </Animated.View>
          </Pressable>

          <Animated.Text
            style={[
              styles.title,
              { color: colors.textPrimary },
              titleStyle,
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Animated.Text>
        </View>

        <View style={styles.metaRow}>
          {category && (
            <View style={[styles.tag, { borderColor: colors.borderSoft }]}>
              <View style={[styles.tagDot, { backgroundColor: category.color }]} />
              <Text style={[styles.tagText, { color: colors.textSecondary }]} numberOfLines={1}>
                {category.name.toLowerCase()}
              </Text>
            </View>
          )}
          <View style={[styles.tag, { borderColor: colors.borderSoft }]}>
            <Text style={[styles.tagText, { color: priorityColor, fontWeight: "700" }]}>
              {priorityLabel(task.priority)}
            </Text>
          </View>
          {task.dueDate && (
            <View style={[styles.tag, { borderColor: colors.borderSoft }]}>
              <Ionicons name="calendar-outline" size={11} color={colors.textSecondary} />
              <Text style={[styles.tagText, { color: colors.textSecondary }]}>
                {new Date(task.dueDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        {onEdit && (
          <TouchableOpacity
            onPress={() => onEdit(task)}
            style={styles.actionBtn}
            testID={`task-edit-${task.id}`}
            hitSlop={8}
          >
            <Ionicons name="create-outline" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => deleteTask(task.id)}
          style={styles.actionBtn}
          testID={`task-delete-${task.id}`}
          hitSlop={8}
        >
          <Ionicons name="trash-outline" size={18} color={colors.accentPrimary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    marginBottom: spacing.sm,
    minHeight: 76,
    overflow: "hidden",
    borderRadius: radii.lg,
  },
  priorityStrip: {
    width: 3,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: 8,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    paddingLeft: 38,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tagText: {
    fontSize: 10,
    letterSpacing: 0.3,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    gap: 6,
  },
  actionBtn: {
    padding: 6,
  },
});
