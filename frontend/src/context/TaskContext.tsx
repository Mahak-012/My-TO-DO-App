import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Priority = "high" | "medium" | "low";

export interface Task {
  id: string;
  title: string;
  notes?: string;
  completed: boolean;
  priority: Priority;
  categoryId: string;
  dueDate?: string; // ISO
  createdAt: string;
  completedAt?: string;
  order: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

interface TaskContextValue {
  tasks: Task[];
  categories: Category[];
  loaded: boolean;
  addTask: (data: Omit<Task, "id" | "completed" | "createdAt" | "order">) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  reorderTasks: (newOrder: Task[]) => void;
  addCategory: (name: string, color: string) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  clearAll: () => void;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

const TASKS_KEY = "@todo_tasks_v1";
const CATEGORIES_KEY = "@todo_categories_v1";

const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat-work", name: "Work", color: "#007AFF" },
  { id: "cat-personal", name: "Personal", color: "#FF3B30" },
  { id: "cat-shopping", name: "Shopping", color: "#FF9500" },
  { id: "cat-health", name: "Health", color: "#34C759" },
];

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [t, c] = await Promise.all([
          AsyncStorage.getItem(TASKS_KEY),
          AsyncStorage.getItem(CATEGORIES_KEY),
        ]);
        if (t) setTasks(JSON.parse(t));
        if (c) setCategories(JSON.parse(c));
      } catch (e) {
        console.warn("Load error", e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks)).catch(() => {});
  }, [tasks, loaded]);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories)).catch(() => {});
  }, [categories, loaded]);

  const addTask: TaskContextValue["addTask"] = useCallback((data) => {
    setTasks((prev) => [
      {
        ...data,
        id: uid(),
        completed: false,
        createdAt: new Date().toISOString(),
        order: prev.length,
      },
      ...prev,
    ]);
  }, []);

  const updateTask: TaskContextValue["updateTask"] = useCallback((id, data) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toISOString() : undefined,
            }
          : t
      )
    );
  }, []);

  const reorderTasks = useCallback((newOrder: Task[]) => {
    setTasks(newOrder.map((t, i) => ({ ...t, order: i })));
  }, []);

  const addCategory = useCallback((name: string, color: string) => {
    setCategories((prev) => [...prev, { id: uid(), name, color }]);
  }, []);

  const updateCategory = useCallback((id: string, data: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setTasks((prev) => prev.filter((t) => t.categoryId !== id));
  }, []);

  const clearAll = useCallback(() => {
    setTasks([]);
  }, []);

  const value = useMemo(
    () => ({
      tasks,
      categories,
      loaded,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,
      reorderTasks,
      addCategory,
      updateCategory,
      deleteCategory,
      clearAll,
    }),
    [tasks, categories, loaded, addTask, updateTask, deleteTask, toggleTask, reorderTasks, addCategory, updateCategory, deleteCategory, clearAll]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within TaskProvider");
  return ctx;
};
