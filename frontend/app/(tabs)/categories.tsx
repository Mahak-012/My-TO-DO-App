import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeIn, Layout } from "react-native-reanimated";
import { useTheme } from "../../src/context/ThemeContext";
import { useTasks } from "../../src/context/TaskContext";
import { spacing, fontSize, fontWeight } from "../../src/constants/theme";

const COLOR_OPTIONS = [
  "#FF3B30",
  "#FF9500",
  "#FFCC00",
  "#34C759",
  "#007AFF",
  "#5856D6",
  "#AF52DE",
  "#FF2D55",
  "#E2FF3D",
];

const confirm = (message: string, onYes: () => void) => {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined" && window.confirm(message)) onYes();
  } else {
    Alert.alert("Delete category?", message, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: onYes },
    ]);
  }
};

export default function CategoriesScreen() {
  const { colors } = useTheme();
  const { categories, tasks, addCategory, deleteCategory, updateCategory } = useTasks();
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const m: Record<string, { total: number; done: number }> = {};
    for (const c of categories) m[c.id] = { total: 0, done: 0 };
    for (const t of tasks) {
      if (!m[t.categoryId]) continue;
      m[t.categoryId].total += 1;
      if (t.completed) m[t.categoryId].done += 1;
    }
    return m;
  }, [categories, tasks]);

  const handleSave = () => {
    if (!name.trim()) return;
    if (editingId) {
      updateCategory(editingId, { name: name.trim(), color });
      setEditingId(null);
    } else {
      addCategory(name.trim(), color);
    }
    setName("");
    setColor(COLOR_OPTIONS[0]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top"]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { maxWidth: 960, alignSelf: "center", width: "100%" }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(360)}>
          <Text style={[styles.eyebrow, { color: colors.textSecondary }]}>ORGANIZE</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Categories.</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Group your work, life, and side-quests.
          </Text>
        </Animated.View>

        {/* Add / Edit form */}
        <View
          style={[
            styles.card,
            { borderColor: colors.border, backgroundColor: colors.surface },
          ]}
        >
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
            {editingId ? "EDIT CATEGORY" : "NEW CATEGORY"}
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Side Project"
            placeholderTextColor={colors.textSecondary}
            style={[
              styles.input,
              {
                borderColor: colors.border,
                color: colors.textPrimary,
                backgroundColor: colors.surfaceSecondary,
              },
            ]}
            testID="category-name-input"
          />
          <Text style={[styles.fieldLabel, { color: colors.textSecondary, marginTop: spacing.md }]}>
            COLOR
          </Text>
          <View style={styles.colorRow}>
            {COLOR_OPTIONS.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setColor(c)}
                style={[
                  styles.swatch,
                  {
                    backgroundColor: c,
                    borderColor: color === c ? colors.textPrimary : colors.borderSoft,
                    borderWidth: color === c ? 3 : 1,
                  },
                ]}
                testID={`color-${c}`}
              />
            ))}
          </View>
          <View style={{ flexDirection: "row", gap: 8, marginTop: spacing.md }}>
            {editingId && (
              <TouchableOpacity
                onPress={() => {
                  setEditingId(null);
                  setName("");
                }}
                style={[styles.btn, { borderColor: colors.border }]}
              >
                <Text style={[styles.btnText, { color: colors.textPrimary }]}>CANCEL</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleSave}
              style={[
                styles.btn,
                { backgroundColor: colors.accentPrimary, borderColor: colors.border, flex: 1 },
              ]}
              testID="save-category-btn"
            >
              <Text style={[styles.btnText, { color: "#FFFFFF" }]}>
                {editingId ? "SAVE" : "ADD CATEGORY"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Category list */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          {categories.length} CATEGORIES
        </Text>

        <View style={{ gap: spacing.sm }}>
          {categories.map((c, i) => {
            const stat = counts[c.id] || { total: 0, done: 0 };
            const pct = stat.total === 0 ? 0 : Math.round((stat.done / stat.total) * 100);
            return (
              <Animated.View
                key={c.id}
                entering={FadeIn.delay(i * 50).duration(280)}
                layout={Layout.springify()}
                style={[
                  styles.catRow,
                  { borderColor: colors.border, backgroundColor: colors.surface },
                ]}
                testID={`category-row-${c.id}`}
              >
                <View style={[styles.catColorBlock, { backgroundColor: c.color }]} />
                <View style={{ flex: 1, paddingVertical: spacing.md, paddingHorizontal: spacing.md }}>
                  <Text style={[styles.catName, { color: colors.textPrimary }]}>{c.name}</Text>
                  <Text style={[styles.catMeta, { color: colors.textSecondary }]}>
                    {stat.total} TASKS · {stat.done} DONE · {pct}%
                  </Text>
                  {/* progress bar */}
                  <View style={[styles.barBg, { backgroundColor: colors.borderSoft }]}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${pct}%`, backgroundColor: c.color },
                      ]}
                    />
                  </View>
                </View>
                <View style={styles.catActions}>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingId(c.id);
                      setName(c.name);
                      setColor(c.color);
                    }}
                    style={styles.iconBtn}
                    testID={`edit-cat-${c.id}`}
                  >
                    <Ionicons name="create-outline" size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      confirm(
                        `This will delete "${c.name}" and ${stat.total} task${stat.total === 1 ? "" : "s"} inside it.`,
                        () => deleteCategory(c.id)
                      )
                    }
                    style={styles.iconBtn}
                    testID={`delete-cat-${c.id}`}
                  >
                    <Ionicons name="trash-outline" size={18} color={colors.accentPrimary} />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            );
          })}
        </View>

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
  subtitle: { marginTop: 6, fontSize: fontSize.sm },
  card: {
    borderWidth: 1,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  fieldLabel: {
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "700",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: fontSize.md,
  },
  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  swatch: { width: 28, height: 28 },
  btn: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { fontSize: 12, fontWeight: "800", letterSpacing: 1.4 },
  sectionTitle: {
    fontSize: 13,
    letterSpacing: 2,
    fontWeight: "700",
    marginTop: spacing.lg,
  },
  catRow: {
    flexDirection: "row",
    borderWidth: 1,
    overflow: "hidden",
  },
  catColorBlock: { width: 8 },
  catName: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, letterSpacing: -0.5 },
  catMeta: { fontSize: 10, letterSpacing: 1.5, fontWeight: "700", marginTop: 4 },
  barBg: { height: 4, marginTop: 10, width: "100%" },
  barFill: { height: 4 },
  catActions: {
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    gap: 6,
  },
  iconBtn: { padding: 6 },
});
