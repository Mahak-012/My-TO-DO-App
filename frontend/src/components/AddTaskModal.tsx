import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import { useTheme } from "../context/ThemeContext";
import { useTasks, Task, Priority } from "../context/TaskContext";
import { spacing, fontSize, fontWeight, radii } from "../constants/theme";

interface Props {
  visible: boolean;
  onClose: () => void;
  editingTask?: Task | null;
}

const PRIORITIES: Priority[] = ["low", "medium", "high"];

const formatDateInput = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const AddTaskModal: React.FC<Props> = ({ visible, onClose, editingTask }) => {
  const { colors } = useTheme();
  const { addTask, updateTask, categories } = useTasks();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (visible) {
      if (editingTask) {
        setTitle(editingTask.title);
        setNotes(editingTask.notes || "");
        setPriority(editingTask.priority);
        setCategoryId(editingTask.categoryId);
        setDueDate(formatDateInput(editingTask.dueDate));
      } else {
        setTitle("");
        setNotes("");
        setPriority("medium");
        setCategoryId(categories[0]?.id || "");
        setDueDate("");
      }
      setError("");
    }
  }, [visible, editingTask, categories]);

  const handleSave = () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!categoryId) {
      setError("Pick a category");
      return;
    }
    const payload = {
      title: title.trim(),
      notes: notes.trim() || undefined,
      priority,
      categoryId,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
    };
    if (editingTask) {
      updateTask(editingTask.id, payload);
    } else {
      addTask(payload);
    }
    onClose();
  };

  const priorityColorFor = (p: Priority) =>
    p === "high" ? colors.priorityHigh : p === "medium" ? colors.priorityMedium : colors.priorityLow;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.backdrop}
      >
        <Animated.View entering={FadeIn.duration(180)} style={styles.backdropFill} />
        <Animated.View
          entering={SlideInDown.duration(280).springify().damping(18)}
          style={[
            styles.sheet,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              {editingTask ? "EDIT TASK" : "NEW TASK"}
            </Text>
            <TouchableOpacity onPress={onClose} testID="close-modal-btn" hitSlop={8}>
              <Ionicons name="close" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ maxHeight: 460 }}
            contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Title */}
            <View>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>TITLE</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="What needs doing?"
                placeholderTextColor={colors.textSecondary}
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    color: colors.textPrimary,
                    backgroundColor: colors.surfaceSecondary,
                  },
                ]}
                testID="task-title-input"
              />
            </View>

            {/* Notes */}
            <View>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>NOTES</Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Optional details"
                placeholderTextColor={colors.textSecondary}
                multiline
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    color: colors.textPrimary,
                    backgroundColor: colors.surfaceSecondary,
                    height: 72,
                    textAlignVertical: "top",
                  },
                ]}
                testID="task-notes-input"
              />
            </View>

            {/* Priority */}
            <View>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>PRIORITY</Text>
              <View style={styles.row}>
                {PRIORITIES.map((p) => {
                  const active = priority === p;
                  return (
                    <Pressable
                      key={p}
                      onPress={() => setPriority(p)}
                      style={[
                        styles.choice,
                        {
                          borderColor: colors.border,
                          backgroundColor: active ? priorityColorFor(p) : "transparent",
                        },
                      ]}
                      testID={`priority-${p}`}
                    >
                      <Text
                        style={{
                          color: active ? "#FFFFFF" : colors.textPrimary,
                          fontWeight: "700",
                          fontSize: 11,
                          letterSpacing: 1.4,
                        }}
                      >
                        {p.toUpperCase()}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Category */}
            <View>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>CATEGORY</Text>
              <View style={[styles.row, { flexWrap: "wrap" }]}>
                {categories.map((c) => {
                  const active = categoryId === c.id;
                  return (
                    <Pressable
                      key={c.id}
                      onPress={() => setCategoryId(c.id)}
                      style={[
                        styles.choice,
                        {
                          borderColor: colors.border,
                          backgroundColor: active ? c.color : "transparent",
                          flexDirection: "row",
                          gap: 6,
                        },
                      ]}
                      testID={`category-${c.id}`}
                    >
                      {!active && <View style={{ width: 8, height: 8, backgroundColor: c.color }} />}
                      <Text
                        style={{
                          color: active ? "#FFFFFF" : colors.textPrimary,
                          fontWeight: "600",
                          fontSize: 12,
                        }}
                      >
                        {c.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Due date */}
            <View>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                DUE DATE (YYYY-MM-DD)
              </Text>
              <TextInput
                value={dueDate}
                onChangeText={setDueDate}
                placeholder="2026-02-28"
                placeholderTextColor={colors.textSecondary}
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    color: colors.textPrimary,
                    backgroundColor: colors.surfaceSecondary,
                    fontFamily: Platform.select({
                      ios: "Menlo",
                      android: "monospace",
                      default: "monospace",
                    }),
                  },
                ]}
                testID="task-duedate-input"
              />
            </View>

            {error ? (
              <Text style={{ color: colors.priorityHigh, fontSize: 12 }}>{error}</Text>
            ) : null}
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.btn,
                { borderColor: colors.border, backgroundColor: "transparent" },
              ]}
              testID="cancel-task-btn"
            >
              <Text style={[styles.btnText, { color: colors.textPrimary }]}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={[
                styles.btn,
                { borderColor: colors.border, backgroundColor: colors.accentPrimary, flex: 1 },
              ]}
              testID="save-task-btn"
            >
              <Text style={[styles.btnText, { color: "#FFFFFF" }]}>
                {editingTask ? "SAVE CHANGES" : "ADD TASK"}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdropFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  sheet: {
    borderWidth: 1,
    maxWidth: 560,
    width: "100%",
    alignSelf: "center",
    marginBottom: 0,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 11,
    letterSpacing: 0.4,
    fontWeight: "700",
  },
  fieldLabel: {
    fontSize: 11,
    letterSpacing: 0.4,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: fontSize.md,
    borderRadius: radii.md,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  choice: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.pill,
  },
  footer: {
    flexDirection: "row",
    gap: 10,
    padding: spacing.md,
    borderTopWidth: 1,
  },
  btn: {
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.md,
  },
  btnText: {
    fontSize: 13,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.3,
  },
});
