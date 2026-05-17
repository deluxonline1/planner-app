import type {
  Exam,
  Grade,
  PomodoroSession,
  Task,
  TaskCategory,
  UserProfile,
} from "@/lib/types";

export const initialProfile: UserProfile = {
  fullName: "Ana Marković",
  email: "ana@skola.edu.rs",
  school: "Gimnazija „Jovan Jovanović Zmaj“, Novi Sad",
};

export const initialCategories: TaskCategory[] = [
  { id: "cat-1", name: "Matematika", color: "violet" },
  { id: "cat-2", name: "Fizika", color: "sky" },
  { id: "cat-3", name: "Engleski", color: "emerald" },
  { id: "cat-4", name: "Istorija", color: "amber" },
];

const today = new Date();
const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return iso(d);
};

export const initialTasks: Task[] = [
  {
    id: "t1",
    title: "Zadaci iz trigonometrije",
    description: "Str. 42–45, zadaci 1–8",
    completed: false,
    priority: "high",
    dueDate: addDays(0),
    categoryId: "cat-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "t2",
    title: "Čitanje lektire",
    completed: true,
    priority: "medium",
    dueDate: addDays(1),
    categoryId: "cat-4",
    createdAt: new Date().toISOString(),
  },
  {
    id: "t3",
    title: "Essay na engleskom",
    completed: false,
    priority: "high",
    dueDate: addDays(3),
    categoryId: "cat-3",
    createdAt: new Date().toISOString(),
  },
  {
    id: "t4",
    title: "Pripremiti laboratorijski izveštaj",
    completed: false,
    priority: "low",
    dueDate: addDays(5),
    categoryId: "cat-2",
    createdAt: new Date().toISOString(),
  },
];

export const initialExams: Exam[] = [
  {
    id: "e1",
    title: "Kontrolni — funkcije",
    subject: "Matematika",
    date: new Date(today.getTime() + 2 * 86400000).toISOString(),
    priority: "high",
  },
  {
    id: "e2",
    title: "Usmeni odgovor",
    subject: "Istorija",
    date: new Date(today.getTime() + 9 * 86400000).toISOString(),
    priority: "medium",
  },
  {
    id: "e3",
    title: "Pismeni test",
    subject: "Fizika",
    date: new Date(today.getTime() + 14 * 86400000).toISOString(),
    priority: "high",
  },
];

export const initialGrades: Grade[] = [
  { id: "g1", subject: "Matematika", value: 5 },
  { id: "g2", subject: "Fizika", value: 4 },
  { id: "g3", subject: "Engleski", value: 5 },
  { id: "g4", subject: "Istorija", value: 4 },
  { id: "g5", subject: "Srpski", value: 5 },
];

export const initialPomodoroSessions: PomodoroSession[] = [
  { id: "p1", minutes: 25, date: addDays(-1) },
  { id: "p2", minutes: 50, date: addDays(-1) },
  { id: "p3", minutes: 75, date: addDays(-2) },
  { id: "p4", minutes: 25, date: addDays(-3) },
  { id: "p5", minutes: 100, date: addDays(-4) },
];
