"use client";

import * as React from "react";
import type {
  Exam,
  Grade,
  PomodoroSession,
  Priority,
  Task,
  TaskCategory,
  UserProfile,
} from "@/lib/types";
import {
  initialCategories,
  initialExams,
  initialGrades,
  initialPomodoroSessions,
  initialProfile,
  initialTasks,
} from "@/lib/dummy-data";

const STORAGE_KEY = "delux-app-state-v1";

export interface AppState {
  tasks: Task[];
  categories: TaskCategory[];
  exams: Exam[];
  grades: Grade[];
  pomodoroSessions: PomodoroSession[];
  profile: UserProfile;
}

type Action =
  | { type: "HYDRATE"; payload: Partial<AppState> }
  | { type: "ADD_TASK"; payload: Omit<Task, "id" | "createdAt"> }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; id: string }
  | { type: "TOGGLE_TASK"; id: string }
  | { type: "ADD_CATEGORY"; payload: Omit<TaskCategory, "id"> }
  | { type: "DELETE_CATEGORY"; id: string }
  | { type: "ADD_EXAM"; payload: Omit<Exam, "id"> }
  | { type: "UPDATE_EXAM"; payload: Exam }
  | { type: "DELETE_EXAM"; id: string }
  | { type: "ADD_GRADE"; payload: Omit<Grade, "id"> }
  | { type: "DELETE_GRADE"; id: string }
  | { type: "ADD_POMODORO"; minutes: number }
  | { type: "UPDATE_PROFILE"; payload: Partial<UserProfile> };

const initialState: AppState = {
  tasks: initialTasks,
  categories: initialCategories,
  exams: initialExams,
  grades: initialGrades,
  pomodoroSessions: initialPomodoroSessions,
  profile: initialProfile,
};

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "HYDRATE": {
      const p = action.payload;
      return {
        tasks: Array.isArray(p.tasks) ? p.tasks : state.tasks,
        categories: Array.isArray(p.categories) ? p.categories : state.categories,
        exams: Array.isArray(p.exams) ? p.exams : state.exams,
        grades: Array.isArray(p.grades) ? p.grades : state.grades,
        pomodoroSessions: Array.isArray(p.pomodoroSessions)
          ? p.pomodoroSessions
          : state.pomodoroSessions,
        profile: p.profile && typeof p.profile === "object"
          ? { ...state.profile, ...p.profile }
          : state.profile,
      };
    }
    case "ADD_TASK": {
      const t: Task = {
        ...action.payload,
        id: uid("task"),
        createdAt: new Date().toISOString(),
      };
      return { ...state, tasks: [t, ...state.tasks] };
    }
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        ),
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.id),
      };
    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id ? { ...t, completed: !t.completed } : t,
        ),
      };
    case "ADD_CATEGORY": {
      const c: TaskCategory = {
        ...action.payload,
        id: uid("cat"),
      };
      return { ...state, categories: [...state.categories, c] };
    }
    case "DELETE_CATEGORY":
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== action.id),
        tasks: state.tasks.map((t) =>
          t.categoryId === action.id ? { ...t, categoryId: undefined } : t,
        ),
      };
    case "ADD_EXAM": {
      const e: Exam = { ...action.payload, id: uid("exam") };
      return { ...state, exams: [...state.exams, e] };
    }
    case "UPDATE_EXAM":
      return {
        ...state,
        exams: state.exams.map((e) =>
          e.id === action.payload.id ? action.payload : e,
        ),
      };
    case "DELETE_EXAM":
      return {
        ...state,
        exams: state.exams.filter((e) => e.id !== action.id),
      };
    case "ADD_GRADE": {
      const g: Grade = { ...action.payload, id: uid("grade") };
      return { ...state, grades: [...state.grades, g] };
    }
    case "DELETE_GRADE":
      return {
        ...state,
        grades: state.grades.filter((g) => g.id !== action.id),
      };
    case "ADD_POMODORO": {
      const p: PomodoroSession = {
        id: uid("pom"),
        minutes: action.minutes,
        date: new Date().toISOString().slice(0, 10),
      };
      return {
        ...state,
        pomodoroSessions: [p, ...state.pomodoroSessions],
      };
    }
    case "UPDATE_PROFILE":
      return {
        ...state,
        profile: { ...state.profile, ...action.payload },
      };
    default:
      return state;
  }
}

interface AppContextValue extends AppState {
  dispatch: React.Dispatch<Action>;
}

const AppContext = React.createContext<AppContextValue | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [storageReady, setStorageReady] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AppState>;
        dispatch({ type: "HYDRATE", payload: parsed });
      }
    } catch {
      /* ignore */
    }
    setStorageReady(true);
  }, []);

  React.useEffect(() => {
    if (!storageReady) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, storageReady]);

  const value = React.useMemo(
    () => ({ ...state, dispatch }),
    [state],
  );

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
}

export function useAppStore() {
  const ctx = React.useContext(AppContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}

export type { Priority };
